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

export type AnalysisDraft = {
  datasetId: string;
  datasetName: string;
  goalId: AnalysisGoalId;
  goalTitle: string;
  status: AnalysisDraftStatus;
  selectedVariables?: SelectedVariable[];
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
