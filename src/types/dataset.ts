export type ColumnType = "numeric" | "categorical" | "likert" | "date" | "text";

export type DatasetColumn = {
  name: string;
  type: ColumnType;
  missingCount: number;
  uniqueCount: number;
};

export type DatasetRow = Record<string, string | number | null>;
