import type { ColumnType } from "@/types/dataset";

export type ResearchGoalStatus = "available" | "coming-soon";

export type AnalysisGoalId =
  | "describe_data"
  | "find_relationship"
  | "compare_groups"
  | "predict_outcome";

export type ResearchGoal = {
  id: AnalysisGoalId;
  title: string;
  description: string;
  status: ResearchGoalStatus;
  examples: string[];
  possibleOutputs: string[];
  recommendedFor?: string;
  warning?: string;
  nextStepGuidance: string;
};

export type VariableRole = "primary" | "x" | "y" | "group" | "outcome" | "predictor";

export type SelectedVariable = {
  name: string;
  role: VariableRole;
  type: ColumnType;
};

export type AnalysisDraftStatus =
  | "goal_selected"
  | "variables_selected"
  | "recommendation_ready";

export type RecommendationStatus =
  | "ready"
  | "ready_with_caution"
  | "coming_soon"
  | "unsupported"
  | "needs_review";

export type RecommendedTestId =
  | "descriptive_numeric"
  | "descriptive_categorical"
  | "descriptive_likert"
  | "date_summary"
  | "text_summary"
  | "pearson_correlation"
  | "spearman_correlation"
  | "chi_square"
  | "group_comparison"
  | "unsupported"
  | "review_column_type";

export type RecommendedChartId =
  | "histogram"
  | "box_plot"
  | "bar_chart"
  | "frequency_bar_chart"
  | "scatter_plot"
  | "scatter_plot_with_trendline"
  | "clustered_bar_chart"
  | "ordinal_relationship_summary"
  | "none";

export type TestRecommendation = {
  id: RecommendedTestId;
  label: string;
  status: RecommendationStatus;
  goalId: AnalysisGoalId;
  selectedVariables: SelectedVariable[];
  recommendedChart: {
    id: RecommendedChartId;
    label: string;
  };
  reason: string;
  plainLanguageSummary: string;
  warnings: string[];
  assumptions: string[];
  nextStepLabel: string;
  canRunInCurrentMvp: boolean;
};

export type AnalysisDraft = {
  datasetId: string;
  datasetName: string;
  goalId: AnalysisGoalId;
  goalTitle: string;
  status: AnalysisDraftStatus;
  selectedVariables?: SelectedVariable[];
  recommendation?: TestRecommendation;
  createdAt: string;
  updatedAt: string;
};

export type CorrelationResult = {
  analysisType: string;
  xVariable: string;
  yVariable: string;
  sampleSize: number;
  rValue: number;
  pValue: number;
  strength: string;
  decision: string;
  interpretation: string;
  disclaimer: string;
};
