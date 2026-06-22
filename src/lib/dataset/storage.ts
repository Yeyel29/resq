import { sampleRows } from "@/constants/sample-data";
import type { ColumnProfile, ColumnType, DatasetCell, DatasetRow, UploadedDataset } from "@/types/dataset";

export const DATASET_STORAGE_KEY = "scholarstat.currentDataset";

function hasBrowserStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function saveDataset(dataset: UploadedDataset) {
  if (!hasBrowserStorage()) {
    return;
  }

  window.sessionStorage.setItem(DATASET_STORAGE_KEY, JSON.stringify(dataset));
}

export function readDataset(): UploadedDataset | null {
  const state = readDatasetState();
  return state.status === "ready" ? state.dataset : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDatasetCell(value: unknown): value is DatasetCell {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function isDatasetRow(value: unknown): value is DatasetRow {
  return isRecord(value) && Object.values(value).every(isDatasetCell);
}

function isColumnType(value: unknown): value is ColumnType {
  return (
    value === "numeric" ||
    value === "categorical" ||
    value === "likert" ||
    value === "date" ||
    value === "text" ||
    value === "unknown"
  );
}

function isColumnProfile(value: unknown): value is ColumnProfile {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === "string" &&
    isColumnType(value.detectedType) &&
    (value.userConfirmedType === undefined || isColumnType(value.userConfirmedType)) &&
    typeof value.missingCount === "number" &&
    typeof value.missingPercentage === "number" &&
    typeof value.uniqueCount === "number" &&
    Array.isArray(value.sampleValues) &&
    value.sampleValues.every(isDatasetCell) &&
    Array.isArray(value.warnings) &&
    value.warnings.every((warning) => typeof warning === "string")
  );
}

function isDatasetRecord(value: unknown): value is UploadedDataset {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    (value.fileType === "csv" || value.fileType === "xlsx") &&
    typeof value.rowCount === "number" &&
    Number.isFinite(value.rowCount) &&
    value.rowCount > 0 &&
    typeof value.columnCount === "number" &&
    Number.isFinite(value.columnCount) &&
    value.columnCount > 0 &&
    Array.isArray(value.columns) &&
    value.columns.length > 0 &&
    value.columns.every((column) => typeof column === "string" && column.trim() !== "") &&
    Array.isArray(value.rows) &&
    value.rows.length > 0 &&
    value.rows.every(isDatasetRow) &&
    typeof value.uploadedAt === "string" &&
    (value.truncated === undefined || typeof value.truncated === "boolean") &&
    (value.originalRowCount === undefined || typeof value.originalRowCount === "number") &&
    (value.columnProfiles === undefined ||
      (Array.isArray(value.columnProfiles) && value.columnProfiles.every(isColumnProfile)))
  );
}

export function readDatasetState():
  | { status: "ready"; dataset: UploadedDataset }
  | { status: "missing" }
  | { status: "corrupt" } {
  if (!hasBrowserStorage()) {
    return { status: "missing" };
  }

  const stored = window.sessionStorage.getItem(DATASET_STORAGE_KEY);

  if (!stored) {
    return { status: "missing" };
  }

  try {
    const parsed = JSON.parse(stored) as unknown;

    if (!isDatasetRecord(parsed)) {
      window.sessionStorage.removeItem(DATASET_STORAGE_KEY);
      return { status: "corrupt" };
    }

    return { status: "ready", dataset: parsed };
  } catch {
    window.sessionStorage.removeItem(DATASET_STORAGE_KEY);
    return { status: "corrupt" };
  }
}

export function clearDataset() {
  if (!hasBrowserStorage()) {
    return;
  }

  window.sessionStorage.removeItem(DATASET_STORAGE_KEY);
}

export function createSampleDataset(): UploadedDataset {
  const rows = sampleRows.map((row, index) => ({
    ...row,
    "Respondent ID": index + 1,
  }));
  const columns = Object.keys(rows[0] ?? {});

  return {
    id: "sample",
    name: "student-research-sample.xlsx",
    fileType: "xlsx",
    rowCount: rows.length,
    columnCount: columns.length,
    columns,
    rows,
    uploadedAt: new Date().toISOString(),
  };
}
