import type { CorrelationResult } from "@/types/analysis";
import type { DatasetColumn, DatasetRow } from "@/types/dataset";
import type { ThesisExportSection } from "@/types/export";

export const workflowSteps = ["Upload", "Profile", "Goal", "Variables", "Results"];

export const featureCards = [
  {
    title: "Upload Excel or CSV",
    description:
      "Start with the files students already have, then inspect them before analysis.",
    icon: "upload",
  },
  {
    title: "Get test recommendations",
    description:
      "Choose a research goal and see why a statistical test fits the selected variables.",
    icon: "brain",
  },
  {
    title: "Generate research plots",
    description:
      "Use clean, thesis-friendly chart layouts instead of raw spreadsheet visuals.",
    icon: "chart",
  },
  {
    title: "Export thesis-style results",
    description:
      "Turn results, figures, interpretation, and disclaimers into a polished draft page.",
    icon: "document",
  },
];

export const sampleRows: DatasetRow[] = [
  {
    "Respondent ID": "R-001",
    "Study Hours": 2,
    "Final Grade": 78,
    "Satisfaction Score": 4,
    Gender: "Female",
    "Year Level": "3rd Year",
    "Internet Access": "Yes",
  },
  {
    "Respondent ID": "R-002",
    "Study Hours": 5,
    "Final Grade": 90,
    "Satisfaction Score": 5,
    Gender: "Male",
    "Year Level": "3rd Year",
    "Internet Access": "Yes",
  },
  {
    "Respondent ID": "R-003",
    "Study Hours": 3,
    "Final Grade": 84,
    "Satisfaction Score": 4,
    Gender: "Female",
    "Year Level": "2nd Year",
    "Internet Access": "No",
  },
  {
    "Respondent ID": "R-004",
    "Study Hours": 6,
    "Final Grade": 94,
    "Satisfaction Score": 5,
    Gender: "Male",
    "Year Level": "4th Year",
    "Internet Access": "Yes",
  },
  {
    "Respondent ID": "R-005",
    "Study Hours": 4,
    "Final Grade": 86,
    "Satisfaction Score": 4,
    Gender: "Female",
    "Year Level": "3rd Year",
    "Internet Access": "Yes",
  },
  {
    "Respondent ID": "R-006",
    "Study Hours": 1,
    "Final Grade": null,
    "Satisfaction Score": 3,
    Gender: "Female",
    "Year Level": "2nd Year",
    "Internet Access": "No",
  },
];

export const sampleColumns: DatasetColumn[] = [
  { name: "Respondent ID", type: "text", missingCount: 0, uniqueCount: 120 },
  { name: "Study Hours", type: "numeric", missingCount: 0, uniqueCount: 9 },
  { name: "Final Grade", type: "numeric", missingCount: 2, uniqueCount: 27 },
  { name: "Satisfaction Score", type: "likert", missingCount: 0, uniqueCount: 5 },
  { name: "Gender", type: "categorical", missingCount: 0, uniqueCount: 3 },
  { name: "Year Level", type: "categorical", missingCount: 0, uniqueCount: 4 },
  { name: "Internet Access", type: "categorical", missingCount: 0, uniqueCount: 2 },
];

export const sampleResult: CorrelationResult = {
  analysisType: "Pearson Correlation Result",
  xVariable: "Study Hours",
  yVariable: "Final Grade",
  sampleSize: 118,
  rValue: 0.72,
  pValue: 0.003,
  strength: "Strong positive relationship",
  decision: "Significant",
  interpretation:
    "The Pearson correlation analysis showed a strong positive relationship between Study Hours and Final Grade, r = 0.72, p = 0.003. This indicates that students who reported higher study hours also tended to have higher final grades. Since the p-value is less than 0.05, the relationship is statistically significant.",
  disclaimer:
    "This interpretation is automatically generated and should be reviewed by a research adviser, statistician, or qualified academic reviewer.",
};

export const profileWarnings = [
  "Final Grade has 2 missing values.",
  "Satisfaction Score may be Likert-scale data.",
  "Correlation does not imply causation.",
];

export const thesisExportSections: ThesisExportSection[] = [
  {
    label: "Title",
    body: "Relationship Between Study Hours and Final Grade",
  },
  {
    label: "Research Objective",
    body: "To determine whether there is a significant relationship between study hours and final grade.",
  },
  {
    label: "Statistical Test Used",
    body: "Pearson Product-Moment Correlation",
  },
  {
    label: "Variables",
    body: "Variable X: Study Hours\nVariable Y: Final Grade",
  },
  {
    label: "Results",
    body: "r-value | p-value | Strength | Decision\n0.72 | 0.003 | Strong positive | Significant",
  },
  {
    label: "Figure 1",
    body: "Scatter Plot of Study Hours and Final Grade",
  },
  {
    label: "Interpretation",
    body: "The Pearson correlation analysis showed a strong positive relationship between Study Hours and Final Grade...",
  },
  {
    label: "Disclaimer",
    body: "This interpretation is automatically generated and should be reviewed by a research adviser, statistician, or qualified academic reviewer.",
  },
];
