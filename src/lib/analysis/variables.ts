import type { SelectedVariable } from "@/types/analysis";
import type { ColumnProfile, ColumnType, DatasetCell, UploadedDataset } from "@/types/dataset";

export type SelectableVariable = {
  name: string;
  type: ColumnType;
  missingCount: number;
  uniqueCount: number;
  sampleValues: DatasetCell[];
  warnings: string[];
  limitedSupport: boolean;
};

export type ValidationResult = {
  isValid: boolean;
  tone: "neutral" | "warning" | "error";
  message: string;
};

export function getEffectiveColumnType(profile: ColumnProfile): ColumnType {
  return profile.userConfirmedType ?? profile.detectedType;
}

export function getVariableSupportMessage(type: ColumnType) {
  const messages: Record<ColumnType, string> = {
    numeric: "Good for mean, median, standard deviation, histogram, or box plot.",
    categorical: "Good for frequency and percentage summaries.",
    likert: "Good for frequency, percentage, median, and mode.",
    date: "Can be summarized by date or time period in a later phase.",
    text: "Open-ended text summaries are not part of the first MVP.",
    unknown: "Review this column type in Data Profile before analysis.",
  };

  return messages[type];
}

export function getSelectableColumns(
  dataset: UploadedDataset,
  profiles: ColumnProfile[],
): SelectableVariable[] {
  return dataset.columns.map((column) => {
    const profile = profiles.find((candidate) => candidate.name === column);
    const type = profile ? getEffectiveColumnType(profile) : "unknown";

    return {
      name: column,
      type,
      missingCount: profile?.missingCount ?? 0,
      uniqueCount: profile?.uniqueCount ?? 0,
      sampleValues: profile?.sampleValues ?? [],
      warnings: profile?.warnings ?? [],
      limitedSupport: type === "date" || type === "text" || type === "unknown",
    };
  });
}

export function validateDescriptiveSelection(
  selectedVariable: SelectableVariable | null,
): ValidationResult {
  if (!selectedVariable) {
    return {
      isValid: false,
      message: "Select one variable to describe before continuing.",
      tone: "neutral",
    };
  }

  if (selectedVariable.limitedSupport) {
    return {
      isValid: true,
      message:
        "This variable has limited MVP support. You can save it, but review the Data Profile if the type looks incorrect.",
      tone: "warning",
    };
  }

  return {
    isValid: true,
    message: "This variable can be reviewed in the next step.",
    tone: "neutral",
  };
}

export function validateRelationshipSelection(
  xVariable: SelectableVariable | null,
  yVariable: SelectableVariable | null,
): ValidationResult {
  if (!xVariable || !yVariable) {
    return {
      isValid: false,
      message: "Select Variable X and Variable Y before continuing.",
      tone: "neutral",
    };
  }

  if (xVariable.name === yVariable.name) {
    return {
      isValid: false,
      message: "Variable X and Variable Y must be different columns.",
      tone: "error",
    };
  }

  if (xVariable.type === "text" && yVariable.type === "text") {
    return {
      isValid: false,
      message:
        "Both selected variables are text. Choose at least one non-text variable for this relationship workflow.",
      tone: "error",
    };
  }

  return getRelationshipCompatibilityMessage(xVariable.type, yVariable.type);
}

export function getRelationshipCompatibilityMessage(
  xType: ColumnType,
  yType: ColumnType,
): ValidationResult {
  if (xType === "unknown" || yType === "unknown") {
    return {
      isValid: true,
      message:
        "One selected variable has an unknown type. Review the Data Profile if this looks incorrect.",
      tone: "warning",
    };
  }

  const bothNumericOrLikert =
    (xType === "numeric" || xType === "likert") &&
    (yType === "numeric" || yType === "likert");

  if (bothNumericOrLikert) {
    return {
      isValid: true,
      message:
        "These variables can be reviewed in the next step. ScholarStat will suggest a suitable statistical test based on their types.",
      tone: xType === yType ? "neutral" : "warning",
    };
  }

  if (xType === "categorical" && yType === "categorical") {
    return {
      isValid: true,
      message:
        "This combination may require a later analysis type. You can still save the selection, but Chi-square support will be added later.",
      tone: "warning",
    };
  }

  if (
    (xType === "categorical" && (yType === "numeric" || yType === "likert")) ||
    (yType === "categorical" && (xType === "numeric" || xType === "likert"))
  ) {
    return {
      isValid: true,
      message:
        "This combination may require a later analysis type. You can still save the selection, but the first MVP focuses on numeric and Likert relationships.",
      tone: "warning",
    };
  }

  if (xType === "text" || yType === "text" || xType === "date" || yType === "date") {
    return {
      isValid: true,
      message:
        "This selection has limited MVP support. You can save it, but review whether these are the variables you want to analyze.",
      tone: "warning",
    };
  }

  return {
    isValid: true,
    message:
      "These variables can be reviewed in the next step. ScholarStat will suggest a starting analysis path based on their types.",
    tone: "neutral",
  };
}

export function toSelectedVariable(
  variable: SelectableVariable,
  role: SelectedVariable["role"],
): SelectedVariable {
  return {
    name: variable.name,
    role,
    type: variable.type,
  };
}
