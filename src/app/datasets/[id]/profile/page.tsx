import { AppShell } from "@/components/layout/app-shell";
import { DatasetProfileClient } from "@/components/dataset/dataset-profile-client";

export default function DataProfilePage() {
  return (
    <AppShell>
      <DatasetProfileClient />
    </AppShell>
  );
}
