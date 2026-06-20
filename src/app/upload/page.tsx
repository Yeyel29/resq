import { ShieldCheck, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function UploadPage() {
  return (
    <AppShell>
      <PageHeader
        description="Upload a CSV or Excel file to begin a guided thesis analysis workflow. This Phase 0 screen uses mock navigation only."
        eyebrow="Step 1"
        title="Upload Your Research Dataset"
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="flex min-h-[420px] flex-col items-center justify-center border-dashed text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-helper text-secondary">
            <UploadCloud className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-semibold text-primary">Drag and drop your dataset</h2>
          <p className="mt-3 max-w-lg leading-7 text-on-surface-variant">
            ScholarStat will eventually preview your file, detect column types, and show
            warnings before analysis. For now, continue to the mock sample preview.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-semibold text-on-surface-variant">
            <span className="rounded-full bg-surface-high px-4 py-2">CSV</span>
            <span className="rounded-full bg-surface-high px-4 py-2">XLSX</span>
            <span className="rounded-full bg-surface-high px-4 py-2">Maximum file size: 10 MB</span>
          </div>
          <ButtonLink className="mt-8" href="/datasets/sample/preview">
            Continue to Preview
          </ButtonLink>
        </Card>

        <div className="grid gap-6">
          <Alert title="Privacy reminder" tone="warning">
            Before uploading, remove names, student numbers, contact details, and other
            personally identifiable information from your dataset.
          </Alert>
          <Card>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 text-secondary" />
              <div>
                <h2 className="text-lg font-semibold text-primary">Phase 0 boundary</h2>
                <p className="mt-2 leading-7 text-on-surface-variant">
                  No real file parsing, storage, backend upload, or statistical analysis is
                  implemented yet. This page establishes the frontend experience only.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
