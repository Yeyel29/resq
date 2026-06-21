import { Database, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ColumnProfile, ColumnType, UploadedDataset } from "@/types/dataset";

type DatasetContextCardProps = {
  dataset: UploadedDataset;
  profiles: ColumnProfile[];
};

function effectiveType(profile: ColumnProfile): ColumnType {
  return profile.userConfirmedType ?? profile.detectedType;
}

function countType(profiles: ColumnProfile[], type: ColumnType) {
  return profiles.filter((profile) => effectiveType(profile) === type).length;
}

export function getDatasetContextSummary(dataset: UploadedDataset, profiles: ColumnProfile[]) {
  return {
    categoricalCount: countType(profiles, "categorical"),
    likertCount: countType(profiles, "likert"),
    missingCount: profiles.reduce((total, profile) => total + profile.missingCount, 0),
    numericCount: countType(profiles, "numeric"),
    rowCount: dataset.rowCount,
    columnCount: dataset.columnCount,
  };
}

export function DatasetContextCard({ dataset, profiles }: DatasetContextCardProps) {
  const summary = getDatasetContextSummary(dataset, profiles);

  return (
    <Card className="min-w-0">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-helper text-secondary">
            <Database className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-on-surface-variant">Dataset ready for analysis</p>
            <h2 className="mt-1 break-words text-2xl font-semibold text-primary">
              {dataset.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              {summary.rowCount.toLocaleString()} rows | {summary.columnCount.toLocaleString()} columns
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="numeric">{summary.numericCount} numeric</Badge>
              <Badge variant="categorical">{summary.categoricalCount} categorical</Badge>
              <Badge variant="likert">{summary.likertCount} Likert</Badge>
              <Badge variant={summary.missingCount > 0 ? "warning" : "significant"}>
                {summary.missingCount.toLocaleString()} missing values
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-surface-low px-3 py-2 text-xs font-semibold text-on-surface-variant">
          <ShieldCheck className="h-4 w-4 text-secondary" />
          Profile reviewed
        </div>
      </div>
    </Card>
  );
}
