import { ChevronDown } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ColumnTypeBadge } from "@/components/dataset/column-type-badge";
import { DataWarningCard } from "@/components/dataset/data-warning-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { profileWarnings, sampleColumns } from "@/constants/sample-data";

export default function DataProfilePage() {
  return (
    <AppShell>
      <PageHeader
        description="Review detected column types, missing values, and analysis warnings before choosing a research goal."
        eyebrow="Step 2"
        title="Data Profile"
      >
        <ButtonLink href="/analysis">Choose Research Goal</ButtonLink>
      </PageHeader>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Dataset" value="Sample" helper="student-research-sample.xlsx" />
        <StatCard label="Valid rows" value="118" helper="After missing values" />
        <StatCard label="Likert columns" value="1" />
        <StatCard label="Warnings" value="3" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-primary">Column profile</h2>
            <p className="text-sm text-on-surface-variant">
              Type selectors are visual placeholders for Phase 0.
            </p>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="border-b border-outline-variant py-3">Column name</th>
                  <th className="border-b border-outline-variant py-3">Detected type</th>
                  <th className="border-b border-outline-variant py-3">Missing</th>
                  <th className="border-b border-outline-variant py-3">Unique</th>
                  <th className="border-b border-outline-variant py-3">Type selector</th>
                </tr>
              </thead>
              <tbody>
                {sampleColumns.map((column) => (
                  <tr className="hover:bg-sky-helper/40" key={column.name}>
                    <td className="border-b border-outline-variant/60 py-4 font-semibold text-primary">
                      {column.name}
                    </td>
                    <td className="border-b border-outline-variant/60 py-4">
                      <ColumnTypeBadge type={column.type} />
                    </td>
                    <td className="border-b border-outline-variant/60 py-4 tabular-nums text-on-surface-variant">
                      {column.missingCount}
                    </td>
                    <td className="border-b border-outline-variant/60 py-4 tabular-nums text-on-surface-variant">
                      {column.uniqueCount}
                    </td>
                    <td className="border-b border-outline-variant/60 py-4">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm font-medium text-on-surface-variant">
                        Edit type
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-4">
          {profileWarnings.map((warning) => (
            <DataWarningCard key={warning} warning={warning} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
