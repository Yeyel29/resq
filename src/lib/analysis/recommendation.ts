import type {
  AnalysisDraft,
  RecommendedChartId,
  RecommendedTestId,
  RecommendationStatus,
  SelectedVariable,
  TestRecommendation,
} from "@/types/analysis";
import type { ColumnType, UploadedDataset } from "@/types/dataset";

type RecommendationInput = {
  id: RecommendedTestId;
  label: string;
  status: RecommendationStatus;
  chartId: RecommendedChartId;
  chartLabel: string;
  reason: string;
  plainLanguageSummary: string;
  warnings?: string[];
  assumptions?: string[];
  nextStepLabel: string;
  canRunInCurrentMvp: boolean;
};

function getEffectiveSelectedVariables(
  draft: AnalysisDraft,
  dataset?: UploadedDataset,
): SelectedVariable[] {
  return (draft.selectedVariables ?? []).map((variable) => {
    const profile = dataset?.columnProfiles?.find((column) => column.name === variable.name);

    return {
      ...variable,
      type: profile?.userConfirmedType ?? profile?.detectedType ?? variable.type,
    };
  });
}

function buildRecommendation(
  draft: AnalysisDraft,
  selectedVariables: SelectedVariable[],
  input: RecommendationInput,
): TestRecommendation {
  return {
    id: input.id,
    label: input.label,
    status: input.status,
    goalId: draft.goalId,
    selectedVariables,
    recommendedChart: {
      id: input.chartId,
      label: input.chartLabel,
    },
    reason: input.reason,
    plainLanguageSummary: input.plainLanguageSummary,
    warnings: input.warnings ?? [],
    assumptions: input.assumptions ?? [],
    nextStepLabel: input.nextStepLabel,
    canRunInCurrentMvp: input.canRunInCurrentMvp,
  };
}

function createNeedsReviewRecommendation(
  draft: AnalysisDraft,
  selectedVariables: SelectedVariable[],
): TestRecommendation {
  return buildRecommendation(draft, selectedVariables, {
    id: "review_column_type",
    label: "Review column type first",
    status: "needs_review",
    chartId: "none",
    chartLabel: "Not available",
    reason:
      "One or more selected variables has an unknown type. Review the Data Profile and confirm the correct variable type before continuing.",
    plainLanguageSummary:
      "ScholarStat needs clearer variable type information before it can suggest a reliable starting analysis path.",
    warnings: [
      "Review the Data Profile before continuing.",
      "Generated recommendations should be reviewed by an adviser, statistician, or qualified academic reviewer.",
    ],
    assumptions: ["The selected variables should have confirmed column types."],
    nextStepLabel: "Review Data Profile",
    canRunInCurrentMvp: false,
  });
}

function createUnsupportedRecommendation(
  draft: AnalysisDraft,
  selectedVariables: SelectedVariable[],
): TestRecommendation {
  return buildRecommendation(draft, selectedVariables, {
    id: "unsupported",
    label: "Not supported in MVP",
    status: "unsupported",
    chartId: "none",
    chartLabel: "Not available",
    reason:
      "One or more selected variables is text-based. Open-ended text analysis is not part of the first ScholarStat MVP.",
    plainLanguageSummary:
      "Choose numeric, categorical, or Likert variables for the current guided analysis workflow.",
    warnings: [
      "Text response analysis is not implemented yet.",
      "Review generated recommendations with an adviser, statistician, or qualified academic reviewer.",
    ],
    assumptions: ["This MVP focuses on descriptive summaries and correlation-oriented workflows."],
    nextStepLabel: "Back to Variables",
    canRunInCurrentMvp: false,
  });
}

function hasType(variables: SelectedVariable[], type: ColumnType) {
  return variables.some((variable) => variable.type === type);
}

function normalizeTypePair(firstType: ColumnType, secondType: ColumnType) {
  return [firstType, secondType].sort().join("+");
}

function recommendDescriptive(
  draft: AnalysisDraft,
  selectedVariables: SelectedVariable[],
): TestRecommendation {
  const variable = selectedVariables.find((selected) => selected.role === "primary") ??
    selectedVariables[0];

  if (!variable || variable.type === "unknown") {
    return createNeedsReviewRecommendation(draft, selectedVariables);
  }

  if (variable.type === "numeric") {
    return buildRecommendation(draft, [variable], {
      id: "descriptive_numeric",
      label: "Descriptive statistics",
      status: "ready",
      chartId: "histogram",
      chartLabel: "Histogram or box plot",
      reason:
        "You selected one numeric variable. Descriptive statistics can summarize its average, spread, minimum, maximum, and distribution.",
      plainLanguageSummary:
        "ScholarStat can calculate count, mean, median, mode, standard deviation, minimum, maximum, and range.",
      warnings: [
        "Missing values will not be included in the summary.",
        "Generated results should be reviewed by your adviser, statistician, or qualified academic reviewer.",
      ],
      assumptions: [
        "The selected variable should represent numeric measurements or scores.",
        "Missing values should be reviewed before interpreting the summary.",
      ],
      nextStepLabel: "Continue to Analysis",
      canRunInCurrentMvp: true,
    });
  }

  if (variable.type === "categorical") {
    return buildRecommendation(draft, [variable], {
      id: "descriptive_categorical",
      label: "Frequency and percentage table",
      status: "ready",
      chartId: "bar_chart",
      chartLabel: "Bar chart",
      reason:
        "You selected one categorical variable. Frequency and percentage summaries can show how many respondents belong to each category.",
      plainLanguageSummary:
        "ScholarStat can count each category and calculate its percentage.",
      warnings: [
        "Check whether category labels are consistent before interpreting the result.",
        "Generated results should be reviewed by your adviser, statistician, or qualified academic reviewer.",
      ],
      assumptions: [
        "Each response should belong to a clear category.",
        "Blank or missing responses should be reviewed before analysis.",
      ],
      nextStepLabel: "Continue to Analysis",
      canRunInCurrentMvp: true,
    });
  }

  if (variable.type === "likert") {
    return buildRecommendation(draft, [variable], {
      id: "descriptive_likert",
      label: "Likert frequency summary",
      status: "ready",
      chartId: "frequency_bar_chart",
      chartLabel: "Frequency bar chart",
      reason:
        "You selected a Likert-scale variable. Likert data is usually summarized using frequencies, percentages, median, and mode.",
      plainLanguageSummary:
        "ScholarStat can summarize the response distribution and identify common response levels.",
      warnings: [
        "Likert responses are ordinal, so interpret averages carefully.",
        "Generated results should be reviewed by your adviser, statistician, or qualified academic reviewer.",
      ],
      assumptions: [
        "Response levels should follow an ordered scale.",
        "Missing values will not be included in the summary.",
      ],
      nextStepLabel: "Continue to Analysis",
      canRunInCurrentMvp: true,
    });
  }

  if (variable.type === "date") {
    return buildRecommendation(draft, [variable], {
      id: "date_summary",
      label: "Date summary",
      status: "coming_soon",
      chartId: "none",
      chartLabel: "Coming soon",
      reason:
        "You selected a date variable. Date-based summaries are useful for timelines or time periods, but they are planned for a later phase.",
      plainLanguageSummary:
        "ScholarStat cannot run date summaries in the current MVP yet.",
      warnings: ["Date summary support is coming soon."],
      assumptions: ["Date values should be consistently formatted."],
      nextStepLabel: "Review Data Profile",
      canRunInCurrentMvp: false,
    });
  }

  if (variable.type === "text") {
    return buildRecommendation(draft, [variable], {
      id: "text_summary",
      label: "Text response summary",
      status: "coming_soon",
      chartId: "none",
      chartLabel: "Coming soon",
      reason:
        "You selected a text variable. Open-ended text summaries are planned for a later phase and are not part of the current MVP.",
      plainLanguageSummary:
        "Choose a numeric, categorical, or Likert variable for the current descriptive workflow.",
      warnings: ["Text response summaries are not implemented yet."],
      assumptions: ["Text responses may require qualitative coding before statistical analysis."],
      nextStepLabel: "Back to Variables",
      canRunInCurrentMvp: false,
    });
  }

  return createNeedsReviewRecommendation(draft, [variable]);
}

function recommendRelationship(
  draft: AnalysisDraft,
  selectedVariables: SelectedVariable[],
): TestRecommendation {
  const relationshipVariables = [
    selectedVariables.find((selected) => selected.role === "x"),
    selectedVariables.find((selected) => selected.role === "y"),
  ].filter(Boolean) as SelectedVariable[];

  if (relationshipVariables.length !== 2) {
    return createNeedsReviewRecommendation(draft, selectedVariables);
  }

  if (hasType(relationshipVariables, "unknown")) {
    return createNeedsReviewRecommendation(draft, relationshipVariables);
  }

  if (hasType(relationshipVariables, "text")) {
    return createUnsupportedRecommendation(draft, relationshipVariables);
  }

  const [xVariable, yVariable] = relationshipVariables;
  const typePair = normalizeTypePair(xVariable.type, yVariable.type);

  if (typePair === "numeric+numeric") {
    return buildRecommendation(draft, relationshipVariables, {
      id: "pearson_correlation",
      label: "Pearson correlation",
      status: "ready",
      chartId: "scatter_plot_with_trendline",
      chartLabel: "Scatter plot with trendline",
      reason:
        "Both selected variables are numeric. Pearson correlation is commonly used to examine whether two numeric variables have a linear relationship.",
      plainLanguageSummary:
        "ScholarStat suggests this as a starting test for checking whether the two numeric variables move together.",
      warnings: [
        "Correlation does not imply causation.",
        "Missing values may reduce the number of usable rows.",
        "Generated results should be reviewed by your adviser, statistician, or qualified academic reviewer.",
      ],
      assumptions: [
        "Both variables should be numeric.",
        "The relationship should be roughly linear.",
        "Extreme outliers may affect the result.",
      ],
      nextStepLabel: "Continue to Analysis",
      canRunInCurrentMvp: true,
    });
  }

  if (typePair === "likert+likert") {
    return buildRecommendation(draft, relationshipVariables, {
      id: "spearman_correlation",
      label: "Spearman correlation",
      status: "ready",
      chartId: "ordinal_relationship_summary",
      chartLabel: "Scatter/ranked relationship plot or ordinal relationship summary",
      reason:
        "Both selected variables appear to be ordinal or Likert-scale. Spearman correlation is more appropriate for ranked or ordinal relationships.",
      plainLanguageSummary:
        "ScholarStat suggests this as a starting test for checking whether two ordinal variables tend to move in the same or opposite direction.",
      warnings: [
        "Correlation does not imply causation.",
        "Likert responses should be interpreted as ordinal data unless your adviser approves another treatment.",
        "Generated results should be reviewed by your adviser, statistician, or qualified academic reviewer.",
      ],
      assumptions: [
        "Variables may be ordinal, ranked, or not normally distributed.",
        "The relationship should be monotonic.",
      ],
      nextStepLabel: "Continue to Analysis",
      canRunInCurrentMvp: true,
    });
  }

  if (typePair === "likert+numeric") {
    return buildRecommendation(draft, relationshipVariables, {
      id: "spearman_correlation",
      label: "Spearman correlation",
      status: "ready_with_caution",
      chartId: "scatter_plot",
      chartLabel: "Scatter/ranked relationship plot",
      reason:
        "At least one selected variable appears to be ordinal or Likert-scale. Spearman correlation is often a safer starting point for ordinal or ranked relationships.",
      plainLanguageSummary:
        "ScholarStat suggests Spearman correlation with caution because the selected variables mix numeric and ordinal-style data.",
      warnings: [
        "Correlation does not imply causation.",
        "Confirm with your adviser whether the Likert variable should be treated as ordinal.",
        "Missing values may reduce the number of usable rows.",
      ],
      assumptions: [
        "At least one variable may be ordinal or ranked.",
        "The relationship should be monotonic.",
      ],
      nextStepLabel: "Continue to Analysis",
      canRunInCurrentMvp: true,
    });
  }

  if (typePair === "categorical+categorical") {
    return buildRecommendation(draft, relationshipVariables, {
      id: "chi_square",
      label: "Chi-square test",
      status: "coming_soon",
      chartId: "clustered_bar_chart",
      chartLabel: "Clustered bar chart",
      reason:
        "Both selected variables are categorical. A chi-square test is commonly used to examine whether two categorical variables are associated.",
      plainLanguageSummary:
        "This test is planned for a later phase and cannot be run yet.",
      warnings: [
        "Chi-square support is coming soon.",
        "Correlation wording should not be used for categorical association results.",
      ],
      assumptions: [
        "Categories should be mutually exclusive.",
        "Expected cell counts should be checked before interpreting a chi-square result.",
      ],
      nextStepLabel: "Choose Another Variable",
      canRunInCurrentMvp: false,
    });
  }

  if (typePair === "categorical+numeric" || typePair === "categorical+likert") {
    return buildRecommendation(draft, relationshipVariables, {
      id: "group_comparison",
      label: "Group comparison",
      status: "coming_soon",
      chartId: "box_plot",
      chartLabel: "Box plot or bar chart",
      reason:
        "One selected variable is categorical and the other is numeric or Likert-style. This usually points to a group comparison workflow, which is planned for a later phase.",
      plainLanguageSummary:
        "ScholarStat cannot run group comparison tests in the current MVP yet.",
      warnings: [
        "Group comparison workflows are coming soon.",
        "Choose numeric or Likert variables for the current relationship MVP.",
      ],
      assumptions: [
        "One variable should define groups.",
        "The other variable should be the score, rating, or outcome being compared.",
      ],
      nextStepLabel: "Choose Another Variable",
      canRunInCurrentMvp: false,
    });
  }

  return createUnsupportedRecommendation(draft, relationshipVariables);
}

export function getTestRecommendation(
  draft: AnalysisDraft,
  dataset?: UploadedDataset,
): TestRecommendation {
  const selectedVariables = getEffectiveSelectedVariables(draft, dataset);

  if (draft.goalId === "describe_data") {
    return recommendDescriptive(draft, selectedVariables);
  }

  if (draft.goalId === "find_relationship") {
    return recommendRelationship(draft, selectedVariables);
  }

  return buildRecommendation(draft, selectedVariables, {
    id: "unsupported",
    label: "Analysis type coming soon",
    status: "coming_soon",
    chartId: "none",
    chartLabel: "Not available",
    reason:
      "This research goal is planned for a later ScholarStat phase and is not available in the current MVP.",
    plainLanguageSummary:
      "Use Describe my data or Find a relationship between variables for the current MVP.",
    warnings: ["This analysis path is not implemented yet."],
    assumptions: ["The current MVP focuses on descriptive statistics and correlation workflows."],
    nextStepLabel: "Choose Another Goal",
    canRunInCurrentMvp: false,
  });
}
