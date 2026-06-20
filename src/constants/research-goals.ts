import type { ResearchGoal } from "@/types/analysis";

export const researchGoals: ResearchGoal[] = [
  {
    id: "describe",
    title: "Describe my data",
    description:
      "Summarize one variable using counts, averages, percentages, and a recommended chart.",
    status: "available",
  },
  {
    id: "relationship",
    title: "Find relationship between variables",
    description:
      "Check whether two variables move together using Pearson or Spearman correlation.",
    status: "available",
  },
  {
    id: "compare",
    title: "Compare groups",
    description:
      "Compare outcomes between two or more groups. Planned for t-test and ANOVA support.",
    status: "coming-soon",
  },
  {
    id: "predict",
    title: "Predict an outcome",
    description:
      "Estimate an outcome using regression-style analysis. Planned after the core MVP.",
    status: "coming-soon",
  },
];
