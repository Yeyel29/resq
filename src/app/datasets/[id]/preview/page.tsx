import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { AppShell } from "@/components/layout/app-shell";
import { DatasetPreviewTable } from "@/components/dataset/dataset-preview-table";

export default function DatasetPreviewPage() {
  return (
    <AppShell>
      <PageHeader
        description="Inspect the sample dataset before profiling. The table is intentionally preview-focused, not a spreadsheet editor."
        eyebrow="Dataset Preview"
        title="student-research-sample.xlsx"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/datasets/sample/profile">Continue to Data Profile</ButtonLink>
          <ButtonLink href="/upload" variant="secondary">
            Upload Different File
          </ButtonLink>
        </div>
      </PageHeader>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Rows" value="120" />
        <StatCard label="Columns" value="7" />
        <StatCard label="Missing values" value="2" helper="Found in Final Grade" />
        <StatCard label="Numeric variables" value="4" />
      </div>

      <DatasetPreviewTable />
    </AppShell>
  );
}
