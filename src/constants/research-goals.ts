import type { ResearchGoal } from "@/types/analysis";

export const researchGoals: ResearchGoal[] = [
  {
    id: "describe_data",
    title: "Describe my data",
    status: "available",
    description:
      "Use this when you want to summarize your respondents, scores, ratings, or survey answers using counts, percentages, averages, and spread.",
    examples: [
      "What is the average final grade?",
      "How many respondents selected Agree?",
      "What is the distribution of satisfaction scores?",
    ],
    possibleOutputs: [
      "Mean",
      "Median",
      "Mode",
      "Standard deviation",
      "Frequency",
      "Percentage",
      "Histogram",
      "Bar chart",
    ],
    recommendedFor: "Chapter 4 descriptive results",
    nextStepGuidance:
      "Next, you will choose one variable to summarize, such as Final Grade, Satisfaction Score, Gender, or Year Level.",
  },
  {
    id: "find_relationship",
    title: "Find a relationship between variables",
    status: "available",
    description:
      "Use this when you want to check whether two variables move together or are related.",
    examples: [
      "Are study hours related to final grade?",
      "Is satisfaction score related to academic performance?",
      "Is internet access related to online learning score?",
    ],
    possibleOutputs: [
      "Pearson correlation",
      "Spearman correlation",
      "Scatter plot",
      "Relationship interpretation",
    ],
    warning: "Relationship does not mean cause and effect.",
    nextStepGuidance:
      "Next, you will choose two variables to check for a relationship, such as Study Hours and Final Grade.",
  },
  {
    id: "compare_groups",
    title: "Compare groups",
    status: "coming-soon",
    description:
      "Use this when you want to compare scores between two or more groups.",
    examples: [
      "Do male and female respondents have different satisfaction scores?",
      "Do year levels differ in academic performance?",
    ],
    possibleOutputs: [
      "t-test",
      "ANOVA",
      "Box plot",
      "Group comparison table",
    ],
    nextStepGuidance:
      "This workflow will later help you choose grouping and outcome variables for group comparison.",
  },
  {
    id: "predict_outcome",
    title: "Predict an outcome",
    status: "coming-soon",
    description:
      "Use this when you want to estimate or predict one variable using another variable.",
    examples: [
      "Can study hours predict final grade?",
      "Can satisfaction score predict academic performance?",
    ],
    possibleOutputs: [
      "Simple linear regression",
      "Prediction equation",
      "Regression plot",
    ],
    nextStepGuidance:
      "This workflow will later help you choose predictor and outcome variables for prediction.",
  },
];

export function getResearchGoalById(goalId: string | null | undefined) {
  return researchGoals.find((goal) => goal.id === goalId);
}
