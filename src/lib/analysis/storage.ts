import type { AnalysisDraft, SelectedVariable, TestRecommendation } from "@/types/analysis";

export const ANALYSIS_DRAFT_STORAGE_KEY = "scholarstat.analysisDraft";

function hasBrowserStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function isAnalysisDraftRecord(value: unknown): value is AnalysisDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<AnalysisDraft>;

  return (
    typeof record.datasetId === "string" &&
    typeof record.datasetName === "string" &&
    typeof record.goalId === "string" &&
    typeof record.goalTitle === "string" &&
    (record.status === "goal_selected" ||
      record.status === "variables_selected" ||
      record.status === "recommendation_ready") &&
    (record.selectedVariables === undefined || Array.isArray(record.selectedVariables)) &&
    (record.recommendation === undefined ||
      (typeof record.recommendation === "object" && record.recommendation !== null)) &&
    typeof record.createdAt === "string" &&
    typeof record.updatedAt === "string"
  );
}

export function saveAnalysisDraft(draft: AnalysisDraft) {
  if (!hasBrowserStorage()) {
    return;
  }

  window.sessionStorage.setItem(ANALYSIS_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function readAnalysisDraft(): AnalysisDraft | null {
  if (!hasBrowserStorage()) {
    return null;
  }

  const stored = window.sessionStorage.getItem(ANALYSIS_DRAFT_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as unknown;

    if (!isAnalysisDraftRecord(parsed)) {
      window.sessionStorage.removeItem(ANALYSIS_DRAFT_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.sessionStorage.removeItem(ANALYSIS_DRAFT_STORAGE_KEY);
    return null;
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
