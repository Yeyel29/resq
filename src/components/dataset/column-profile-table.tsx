"use client";

import { ColumnTypeBadge } from "@/components/dataset/column-type-badge";
import { Badge } from "@/components/ui/badge";
import { formatCellValue } from "@/lib/dataset/preview";
import type { ColumnProfile, ColumnType } from "@/types/dataset";

type ColumnProfileTableProps = {
  profiles: ColumnProfile[];
  onTypeChange: (columnName: string, type: ColumnType) => void;
};

const columnTypes: Array<{ label: string; value: ColumnType }> = [
  { label: "Numeric", value: "numeric" },
  { label: "Categorical", value: "categorical" },
  { label: "Likert", value: "likert" },
  { label: "Date", value: "date" },
  { label: "Text", value: "text" },
  { label: "Unknown", value: "unknown" },
];

export function ColumnProfileTable({ profiles, onTypeChange }: ColumnProfileTableProps) {
  return (
    <div className="overflow-hidden rounded-card border border-outline-variant bg-white shadow-soft">
      <div className="border-b border-outline-variant bg-surface-low px-5 py-4">
        <h2 className="text-lg font-semibold text-primary">Column profile</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Review detected variable types. Overrides are saved for this browser session.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-low text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="whitespace-nowrap border-b border-outline-variant px-4 py-4">Column</th>
              <th className="whitespace-nowrap border-b border-outline-variant px-4 py-4">Detected Type</th>
              <th className="whitespace-nowrap border-b border-outline-variant px-4 py-4">Type Override</th>
              <th className="whitespace-nowrap border-b border-outline-variant px-4 py-4">Missing</th>
              <th className="whitespace-nowrap border-b border-outline-variant px-4 py-4">Unique</th>
              <th className="whitespace-nowrap border-b border-outline-variant px-4 py-4">Sample Values</th>
              <th className="whitespace-nowrap border-b border-outline-variant px-4 py-4">Warnings</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => {
              const effectiveType = profile.userConfirmedType ?? profile.detectedType;

              return (
                <tr className="align-top hover:bg-sky-helper/35" key={profile.name}>
                  <td className="border-b border-outline-variant/60 px-4 py-4 font-semibold text-primary">
                    {profile.name}
                  </td>
                  <td className="border-b border-outline-variant/60 px-4 py-4">
                    <ColumnTypeBadge type={profile.detectedType} />
                  </td>
                  <td className="border-b border-outline-variant/60 px-4 py-4">
                    <label className="sr-only" htmlFor={`type-${profile.name}`}>
                      Type override for {profile.name}
                    </label>
                    <select
                      className="min-w-36 rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm font-semibold text-primary focus:border-secondary focus:outline-none focus:ring-2 focus:ring-sky-helper"
                      id={`type-${profile.name}`}
                      onChange={(event) =>
                        onTypeChange(profile.name, event.target.value as ColumnType)
                      }
                      value={effectiveType}
                    >
                      {columnTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {profile.userConfirmedType ? (
                      <p className="mt-2 text-xs font-semibold text-secondary">Changed</p>
                    ) : null}
                  </td>
                  <td className="border-b border-outline-variant/60 px-4 py-4 tabular-nums text-on-surface-variant">
                    {profile.missingCount.toLocaleString()}
                    <span className="block text-xs text-outline">
                      {profile.missingPercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="border-b border-outline-variant/60 px-4 py-4 tabular-nums text-on-surface-variant">
                    {profile.uniqueCount.toLocaleString()}
                  </td>
                  <td className="max-w-xs border-b border-outline-variant/60 px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.sampleValues.length > 0 ? (
                        profile.sampleValues.map((value, index) => (
                          <span
                            className="rounded-full bg-surface-high px-3 py-1 text-xs font-semibold text-on-surface-variant"
                            key={`${profile.name}-${String(value)}-${index}`}
                          >
                            {formatCellValue(value)}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-outline">No non-empty samples</span>
                      )}
                    </div>
                  </td>
                  <td className="min-w-64 border-b border-outline-variant/60 px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.warnings.length > 0 ? (
                        profile.warnings.map((warning) => (
                          <Badge key={warning} variant="warning">
                            {warning}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-outline">No warnings</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
