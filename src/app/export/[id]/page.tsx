import { ArrowLeft, Download, Pencil } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ThesisDocumentPreview } from "@/components/export/thesis-document-preview";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

export default function ExportPreviewPage() {
  return (
    <AppShell>
      <PageHeader
        description="A polished academic document preview for the sample correlation result. Real PDF generation is intentionally not implemented yet."
        eyebrow="Export"
        title="Thesis-Style Export Preview"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/export/sample">
            <Download className="h-4 w-4" />
            Export as PDF
          </ButtonLink>
          <ButtonLink href="/results/sample" variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </ButtonLink>
          <ButtonLink href="/export/sample" variant="ghost">
            <Pencil className="h-4 w-4" />
            Edit Title/Objectives
          </ButtonLink>
        </div>
      </PageHeader>

      <div className="rounded-card border border-outline-variant bg-surface-low p-4 md:p-8">
        <ThesisDocumentPreview />
      </div>
    </AppShell>
  );
}
