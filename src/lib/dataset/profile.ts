import type {
  ColumnProfile,
  ColumnType,
  DatasetCell,
  DatasetRow,
  UploadedDataset,
} from "@/types/dataset";
import { isDatasetMissingValue } from "@/lib/dataset/missing-values";

const likertTextValues = new Set([
  "strongly disagree",
  "disagree",
  "neutral",
  "agree",
  "strongly agree",
  "very dissatisfied",
  "dissatisfied",
  "satisfied",
  "very satisfied",
]);

export function isProfileMissingValue(value: unknown): boolean {
  return isDatasetMissingValue(value);
}

export function getColumnValues(rows: DatasetRow[], columnName: string): DatasetCell[] {
  return rows.map((row) => row[columnName] ?? null);
}

function getNonMissingValues(values: DatasetCell[]) {
  return values.filter((value) => !isProfileMissingValue(value));
}

function uniqueDisplayValues(values: DatasetCell[]) {
  return Array.from(new Set(values.map((value) => String(value).trim()))).filter(Boolean);
}

function isNumericLike(value: DatasetCell): boolean {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  return trimmed !== "" && Number.isFinite(Number(trimmed));
}

function isDateLike(value: DatasetCell): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return false;
  }

  if (!/[/-]|[a-zA-Z]/.test(trimmed)) {
    return false;
  }

  const time = Date.parse(trimmed);
  return Number.isFinite(time);
}

function detectLikert(values: DatasetCell[]): boolean {
  const uniqueValues = uniqueDisplayValues(values);

  if (uniqueValues.length < 2 || uniqueValues.length > 7) {
    return false;
  }

  const numericValues = uniqueValues.map((value) => Number(value));
  const allNumeric = numericValues.every((value) => Number.isInteger(value));

  if (allNumeric) {
    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    return min >= 1 && max <= 7;
  }

  return uniqueValues.every((value) => likertTextValues.has(value.toLowerCase()));
}

export function inferColumnType(values: DatasetCell[], columnName = ""): ColumnType {
  const nonMissing = getNonMissingValues(values);
  const normalizedColumnName = columnName.toLowerCase();

  if (nonMissing.length === 0) {
    return "unknown";
  }

  const likelyLikertColumn =
    /likert|satisfaction|agree|agreement|rating|scale|score|response/.test(
      normalizedColumnName,
    );

  if (likelyLikertColumn && detectLikert(nonMissing)) {
    return "likert";
  }

  const numericRatio =
    nonMissing.filter((value) => isNumericLike(value)).length / nonMissing.length;

  if (numericRatio >= 0.8) {
    return "numeric";
  }

  const dateRatio = nonMissing.filter((value) => isDateLike(value)).length / nonMissing.length;

  if (dateRatio >= 0.8) {
    return "date";
  }

  const uniqueCount = uniqueDisplayValues(nonMissing).length;
  const uniqueRatio = uniqueCount / nonMissing.length;

  if (uniqueCount <= 20 || uniqueRatio <= 0.3) {
    return "categorical";
  }

  const longTextCount = nonMissing.filter(
    (value) => typeof value === "string" && value.trim().length >= 40,
  ).length;

  if (longTextCount > nonMissing.length * 0.3 || uniqueRatio > 0.7) {
    return "text";
  }

  return "unknown";
}

export function countColumnMissingValues(values: DatasetCell[]): number {
  return values.filter((value) => isProfileMissingValue(value)).length;
}

export function countUniqueValues(values: DatasetCell[]): number {
  return uniqueDisplayValues(getNonMissingValues(values)).length;
}

export function getSampleValues(values: DatasetCell[], limit = 5): DatasetCell[] {
  const samples: DatasetCell[] = [];
  const seen = new Set<string>();

  for (const value of getNonMissingValues(values)) {
    const key = String(value).trim();

    if (!seen.has(key)) {
      seen.add(key);
      samples.push(value);
    }

    if (samples.length >= limit) {
      break;
    }
  }

  return samples;
}

export function generateColumnWarnings(values: DatasetCell[], inferredType: ColumnType): string[] {
  const warnings: string[] = [];
  const nonMissing = getNonMissingValues(values);
  const missingCount = countColumnMissingValues(values);
  const missingPercentage = values.length === 0 ? 0 : (missingCount / values.length) * 100;
  const uniqueCount = countUniqueValues(values);
  const numericCount = nonMissing.filter((value) => isNumericLike(value)).length;
  const numericRatio = nonMissing.length === 0 ? 0 : numericCount / nonMissing.length;

  if (missingCount > 0) {
    warnings.push("Has missing values");
  }

  if (missingPercentage >= 20) {
    warnings.push("High missing percentage");
  }

  if (missingPercentage >= 80) {
    warnings.push("Mostly empty column");
  }

  if (numericRatio >= 0.2 && numericRatio <= 0.8 && nonMissing.length > 0) {
    warnings.push("Mixed numeric and text values");
  }

  if (inferredType === "likert") {
    warnings.push("Possible Likert-scale data");
  }

  if (inferredType === "categorical" && uniqueCount > 20) {
    warnings.push("Too many unique values for categorical data");
  }

  if (uniqueCount === 1) {
    warnings.push("Only one unique value");
  }

  if (inferredType === "date") {
    warnings.push("Date-like values detected");
  }

  return warnings;
}

export function createColumnProfiles(dataset: UploadedDataset): ColumnProfile[] {
  return dataset.columns.map((column) => {
    const values = getColumnValues(dataset.rows, column);
    const detectedType = inferColumnType(values, column);
    const missingCount = countColumnMissingValues(values);
    const missingPercentage =
      values.length === 0 ? 0 : Number(((missingCount / values.length) * 100).toFixed(1));

    const existingProfile = dataset.columnProfiles?.find((profile) => profile.name === column);

    return {
      name: column,
      detectedType,
      userConfirmedType: existingProfile?.userConfirmedType,
      missingCount,
      missingPercentage,
      uniqueCount: countUniqueValues(values),
      sampleValues: getSampleValues(values),
      warnings: generateColumnWarnings(values, detectedType),
    };
  });
}

export function generateDatasetWarnings(profiles: ColumnProfile[]): string[] {
  const warnings = [
    "Review column types before analysis.",
    "Correlation does not imply causation.",
    "Make sure your dataset does not contain names, student numbers, contact details, or other personally identifiable information.",
  ];

  if (profiles.some((profile) => profile.missingCount > 0)) {
    warnings.push("This dataset contains missing values. Some analyses may exclude incomplete rows.");
    warnings.push("Columns with missing values may affect analysis results.");
  }

  if (profiles.some((profile) => (profile.userConfirmedType ?? profile.detectedType) === "likert")) {
    warnings.push(
      "Some columns appear to contain Likert-scale responses. Spearman correlation may be more appropriate for ordinal variables.",
    );
  }

  return warnings;
}
