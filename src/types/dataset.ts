export type ColumnType = "numeric" | "categorical" | "likert" | "date" | "text" | "unknown";
export type DatasetCell = string | number | boolean | null;

export type DatasetColumn = {
  name: string;
  type: ColumnType;
  missingCount: number;
  uniqueCount: number;
};

export type DatasetRow = Record<string, DatasetCell>;

export type ColumnProfile = {
  name: string;
  detectedType: ColumnType;
  userConfirmedType?: ColumnType;
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  sampleValues: DatasetCell[];
  warnings: string[];
};

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
  columnProfiles?: ColumnProfile[];
};
