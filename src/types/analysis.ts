export type ResearchGoalStatus = "available" | "coming-soon";

export type ResearchGoal = {
  id: string;
  title: string;
  description: string;
  status: ResearchGoalStatus;
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
