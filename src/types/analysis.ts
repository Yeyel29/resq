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

export type AnalysisDraftStatus = "goal_selected";

export type AnalysisDraft = {
  datasetId: string;
  datasetName: string;
  goalId: AnalysisGoalId;
  goalTitle: string;
  status: AnalysisDraftStatus;
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
