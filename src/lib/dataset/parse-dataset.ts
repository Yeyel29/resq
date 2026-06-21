import * as XLSX from "xlsx";
import { isDatasetMissingValue } from "@/lib/dataset/missing-values";
import type { DatasetCell, DatasetRow, UploadedDataset } from "@/types/dataset";

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_ROWS = 5000;

const allowedExtensions = ["csv", "xlsx"] as const;
type AllowedExtension = (typeof allowedExtensions)[number];

export class DatasetParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatasetParseError";
  }
}

function getFileExtension(fileName: string): AllowedExtension | null {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return allowedExtensions.includes(extension as AllowedExtension)
    ? (extension as AllowedExtension)
    : null;
}

function normalizeCell(value: unknown): DatasetCell {
  if (isDatasetMissingValue(value)) {
    return null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function normalizeHeader(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeParsedRows(headerRow: unknown[], rows: unknown[][]) {
  const normalizedHeaders = headerRow.map((header) => normalizeHeader(header));
  const maxColumnCount = Math.max(
    normalizedHeaders.length,
    ...rows.map((row) => row.length),
  );

  const keptColumns = Array.from({ length: maxColumnCount }, (_, index) => {
    const header = normalizedHeaders[index] ?? "";
    const hasNonMissingValue = rows.some((row) => !isDatasetMissingValue(row[index]));

    return {
      finalName: header || `Column ${index + 1}`,
      originalIndex: index,
      shouldKeep: header !== "" || hasNonMissingValue,
    };
  }).filter((column) => column.shouldKeep);

  const columns = keptColumns.map((column) => column.finalName);
  const normalizedRows = rows.map((row) => {
    return keptColumns.reduce<DatasetRow>((record, column) => {
      record[column.finalName] = normalizeCell(row[column.originalIndex]);
      return record;
    }, {});
  });

  return {
    columns,
    rows: normalizedRows,
  };
}

export async function parseDatasetFile(file: File): Promise<UploadedDataset> {
  const fileType = getFileExtension(file.name);

  if (!fileType) {
    throw new DatasetParseError(
      "This file type is not supported. Please upload a CSV or XLSX file.",
    );
  }

  if (file.size === 0) {
    throw new DatasetParseError("This file is empty. Please upload a dataset with columns and rows.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new DatasetParseError(
      "This file is larger than 10 MB. Please upload a smaller dataset for the MVP test version.",
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      throw new DatasetParseError("This dataset has no sheets to preview.");
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
      header: 1,
      blankrows: false,
      defval: null,
    });

    if (sheetRows.length === 0) {
      throw new DatasetParseError("This file is empty. Please upload a dataset with columns and rows.");
    }

    const [headerRow, ...bodyRows] = sheetRows;
    const nonEmptyRows = bodyRows.filter((row) =>
      row.some((cell) => !isDatasetMissingValue(cell)),
    );

    if (nonEmptyRows.length === 0) {
      throw new DatasetParseError("This dataset has no rows to preview.");
    }

    const truncated = nonEmptyRows.length > MAX_ROWS;
    const rowsToStore = nonEmptyRows.slice(0, MAX_ROWS);
    const normalizedDataset = normalizeParsedRows(headerRow, rowsToStore);

    if (normalizedDataset.columns.length === 0) {
      throw new DatasetParseError("This dataset has no columns to preview.");
    }

    return {
      id: "uploaded",
      name: file.name,
      fileType,
      rowCount: rowsToStore.length,
      columnCount: normalizedDataset.columns.length,
      columns: normalizedDataset.columns,
      rows: normalizedDataset.rows,
      uploadedAt: new Date().toISOString(),
      truncated,
      originalRowCount: truncated ? nonEmptyRows.length : undefined,
    };
  } catch (error) {
    if (error instanceof DatasetParseError) {
      throw error;
    }

    throw new DatasetParseError(
      "We could not read this file. Please check that it is a valid CSV or Excel file.",
    );
  }
}
