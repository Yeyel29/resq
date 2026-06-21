import { sampleRows } from "@/constants/sample-data";
import type { UploadedDataset } from "@/types/dataset";

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
  if (!hasBrowserStorage()) {
    return null;
  }

  const stored = window.sessionStorage.getItem(DATASET_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as UploadedDataset;
  } catch {
    window.sessionStorage.removeItem(DATASET_STORAGE_KEY);
    return null;
  }
}

function isDatasetRecord(value: unknown): value is UploadedDataset {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<UploadedDataset>;

  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    (record.fileType === "csv" || record.fileType === "xlsx") &&
    typeof record.rowCount === "number" &&
    typeof record.columnCount === "number" &&
    Array.isArray(record.columns) &&
    Array.isArray(record.rows) &&
    typeof record.uploadedAt === "string"
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
