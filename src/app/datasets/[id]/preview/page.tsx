import { AppShell } from "@/components/layout/app-shell";
import { DatasetPreviewClient } from "@/components/dataset/dataset-preview-client";

export default function DatasetPreviewPage() {
  return (
    <AppShell>
      <DatasetPreviewClient />
    </AppShell>
  );
}
