import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DatasetUploadCard } from "@/components/upload/dataset-upload-card";
import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function UploadPage() {
  return (
    <AppShell>
      <PageHeader
        description="Upload a CSV or Excel file to begin inspecting your research data."
        eyebrow="Step 1"
        title="Upload Your Research Dataset"
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <DatasetUploadCard />

        <div className="grid gap-6">
          <Alert title="Privacy reminder" tone="warning">
            Before uploading, remove names, student numbers, contact details, and other
            personally identifiable information from your dataset.
            <br />
            <span className="mt-2 inline-block">
              For this MVP, uploaded files are processed temporarily in your browser and
              are not permanently saved.
            </span>
          </Alert>
          <Card>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 text-secondary" />
              <div>
                <h2 className="text-lg font-semibold text-primary">Browser-only MVP upload</h2>
                <p className="mt-2 leading-7 text-on-surface-variant">
                  Files are parsed on your device for preview. ScholarStat stores the
                  temporary dataset in this browser session only so the next page can show
                  the first rows and basic metadata.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
