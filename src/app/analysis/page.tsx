import { Suspense } from "react";
import { AnalysisWizardClient } from "@/components/analysis/analysis-wizard-client";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

function AnalysisLoadingState() {
  return (
    <Card>
      <p className="text-sm font-semibold text-on-surface-variant">Loading analysis wizard...</p>
    </Card>
  );
}

export default function AnalysisPage() {
  return (
    <AppShell>
      <Suspense fallback={<AnalysisLoadingState />}>
        <AnalysisWizardClient />
      </Suspense>
    </AppShell>
  );
}
