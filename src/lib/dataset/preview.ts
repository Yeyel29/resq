import type { DatasetCell, DatasetRow, UploadedDataset } from "@/types/dataset";

export type PreviewColumnType = "numeric" | "text" | "mixed" | "empty" | "unknown";

export function isMissingValue(value: unknown): boolean {
  return value === null || value === undefined || String(value).trim() === "";
}

export function countMissingValues(dataset: UploadedDataset): number {
  return dataset.rows.reduce((count, row) => {
    return (
      count +
      dataset.columns.filter((column) => isMissingValue(row[column])).length
    );
  }, 0);
}

export function formatCellValue(value: DatasetCell | undefined): string {
  if (isMissingValue(value)) {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

export function inferPreviewColumnType(
  rows: DatasetRow[],
  column: string,
): PreviewColumnType {
  const values = rows
    .map((row) => row[column])
    .filter((value) => !isMissingValue(value));

  if (values.length === 0) {
    return "empty";
  }

  const numericCount = values.filter((value) => {
    if (typeof value === "number") {
      return Number.isFinite(value);
    }

    if (typeof value === "string") {
      return value.trim() !== "" && Number.isFinite(Number(value));
    }

    return false;
  }).length;

  if (numericCount === values.length) {
    return "numeric";
  }

  if (numericCount > 0) {
    return "mixed";
  }

  if (values.every((value) => typeof value === "string" || typeof value === "boolean")) {
    return "text";
  }

  return "unknown";
}

export function getPreviewRows(rows: DatasetRow[], page: number, rowsPerPage: number) {
  const start = (page - 1) * rowsPerPage;
  return rows.slice(start, start + rowsPerPage);
}
