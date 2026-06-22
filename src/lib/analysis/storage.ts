import type {
  AnalysisDraft,
  AnalysisDraftStatus,
  AnalysisGoalId,
  RecommendedChartId,
  RecommendedTestId,
  RecommendationStatus,
  SelectedVariable,
  TestRecommendation,
  VariableRole,
} from "@/types/analysis";
import type { ColumnType } from "@/types/dataset";

export const ANALYSIS_DRAFT_STORAGE_KEY = "scholarstat.analysisDraft";

function hasBrowserStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isAnalysisGoalId(value: unknown): value is AnalysisGoalId {
  return (
    value === "describe_data" ||
    value === "find_relationship" ||
    value === "compare_groups" ||
    value === "predict_outcome"
  );
}

export function isVariableRole(value: unknown): value is VariableRole {
  return (
    value === "primary" ||
    value === "x" ||
    value === "y" ||
    value === "group" ||
    value === "outcome" ||
    value === "predictor"
  );
}

function isColumnType(value: unknown): value is ColumnType {
  return (
    value === "numeric" ||
    value === "categorical" ||
    value === "likert" ||
    value === "date" ||
    value === "text" ||
    value === "unknown"
  );
}

function isAnalysisDraftStatus(value: unknown): value is AnalysisDraftStatus {
  return (
    value === "goal_selected" ||
    value === "variables_selected" ||
    value === "recommendation_ready"
  );
}

export function isSelectedVariable(value: unknown): value is SelectedVariable {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === "string" &&
    isVariableRole(value.role) &&
    isColumnType(value.type)
  );
}

export function isRecommendationStatus(value: unknown): value is RecommendationStatus {
  return (
    value === "ready" ||
    value === "ready_with_caution" ||
    value === "coming_soon" ||
    value === "unsupported" ||
    value === "needs_review"
  );
}

function isRecommendedTestId(value: unknown): value is RecommendedTestId {
  return (
    value === "descriptive_numeric" ||
    value === "descriptive_categorical" ||
    value === "descriptive_likert" ||
    value === "date_summary" ||
    value === "text_summary" ||
    value === "pearson_correlation" ||
    value === "spearman_correlation" ||
    value === "chi_square" ||
    value === "group_comparison" ||
    value === "unsupported" ||
    value === "review_column_type"
  );
}

function isRecommendedChartId(value: unknown): value is RecommendedChartId {
  return (
    value === "histogram" ||
    value === "box_plot" ||
    value === "bar_chart" ||
    value === "frequency_bar_chart" ||
    value === "scatter_plot" ||
    value === "scatter_plot_with_trendline" ||
    value === "clustered_bar_chart" ||
    value === "ordinal_relationship_summary" ||
    value === "none"
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isTestRecommendation(value: unknown): value is TestRecommendation {
  if (!isRecord(value) || !isRecord(value.recommendedChart)) {
    return false;
  }

  return (
    isRecommendedTestId(value.id) &&
    typeof value.label === "string" &&
    isRecommendationStatus(value.status) &&
    isAnalysisGoalId(value.goalId) &&
    Array.isArray(value.selectedVariables) &&
    value.selectedVariables.every(isSelectedVariable) &&
    isRecommendedChartId(value.recommendedChart.id) &&
    typeof value.recommendedChart.label === "string" &&
    typeof value.reason === "string" &&
    typeof value.plainLanguageSummary === "string" &&
    isStringArray(value.warnings) &&
    isStringArray(value.assumptions) &&
    typeof value.nextStepLabel === "string" &&
    typeof value.canRunInCurrentMvp === "boolean"
  );
}

export function isAnalysisDraft(value: unknown): value is AnalysisDraft {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.datasetId === "string" &&
    typeof value.datasetName === "string" &&
    isAnalysisGoalId(value.goalId) &&
    typeof value.goalTitle === "string" &&
    isAnalysisDraftStatus(value.status) &&
    (value.selectedVariables === undefined ||
      (Array.isArray(value.selectedVariables) &&
        value.selectedVariables.every(isSelectedVariable))) &&
    (value.recommendation === undefined || isTestRecommendation(value.recommendation)) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

export function saveAnalysisDraft(draft: AnalysisDraft) {
  if (!hasBrowserStorage()) {
    return;
  }

  window.sessionStorage.setItem(ANALYSIS_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function readAnalysisDraft(): AnalysisDraft | null {
  const state = readAnalysisDraftState();
  return state.status === "ready" ? state.draft : null;
}

export function readAnalysisDraftState():
  | { status: "ready"; draft: AnalysisDraft }
  | { status: "missing" }
  | { status: "corrupt" } {
  if (!hasBrowserStorage()) {
    return { status: "missing" };
  }

  const stored = window.sessionStorage.getItem(ANALYSIS_DRAFT_STORAGE_KEY);

  if (!stored) {
    return { status: "missing" };
  }

  try {
    const parsed = JSON.parse(stored) as unknown;

    if (!isAnalysisDraft(parsed)) {
      window.sessionStorage.removeItem(ANALYSIS_DRAFT_STORAGE_KEY);
      return { status: "corrupt" };
    }

    return { status: "ready", draft: parsed };
  } catch {
    window.sessionStorage.removeItem(ANALYSIS_DRAFT_STORAGE_KEY);
    return { status: "corrupt" };
  }
}

export function clearAnalysisDraft() {
  if (!hasBrowserStorage()) {
    return;
  }

  window.sessionStorage.removeItem(ANALYSIS_DRAFT_STORAGE_KEY);
}

export function updateDraftSelectedVariables(
  draft: AnalysisDraft,
  selectedVariables: SelectedVariable[],
): AnalysisDraft {
  return {
    ...draft,
    selectedVariables,
    status: "variables_selected",
    updatedAt: new Date().toISOString(),
  };
}

export function updateDraftRecommendation(
  draft: AnalysisDraft,
  recommendation: TestRecommendation,
): AnalysisDraft {
  return {
    ...draft,
    recommendation,
    selectedVariables: recommendation.selectedVariables,
    status: "recommendation_ready",
    updatedAt: new Date().toISOString(),
  };
}
