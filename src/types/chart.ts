export type ChartType = "scatter" | "histogram" | "box" | "bar";

export type ChartSummary = {
  title: string;
  type: ChartType;
  xLabel: string;
  yLabel: string;
};
