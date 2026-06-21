export type ColumnType = "numeric" | "categorical" | "likert" | "date" | "text";
export type DatasetCell = string | number | boolean | null;

export type DatasetColumn = {
  name: string;
  type: ColumnType;
  missingCount: number;
  uniqueCount: number;
};

export type DatasetRow = Record<string, DatasetCell>;

export type UploadedDataset = {
  id: string;
  name: string;
  fileType: "csv" | "xlsx";
  rowCount: number;
  columnCount: number;
  columns: string[];
  rows: DatasetRow[];
  uploadedAt: string;
  truncated?: boolean;
  originalRowCount?: number;
};
