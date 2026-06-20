import { Download, FileDown, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { InterpretationCard } from "@/components/analysis/interpretation-card";
import { MockScatterPlot } from "@/components/analysis/mock-scatter-plot";
import { ResultSummaryCard } from "@/components/analysis/result-summary-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { sampleResult } from "@/constants/sample-data";

export default function ResultsPage() {
  return (
    <AppShell>
      <PageHeader
        description="Study Hours and Final Grade"
        eyebrow="Mock Result"
        title={sampleResult.analysisType}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/export/sample">
            <FileDown className="h-4 w-4" />
            Export PDF
          </ButtonLink>
          <ButtonLink href="/results/sample" variant="secondary">
            <Download className="h-4 w-4" />
            Download Chart
          </ButtonLink>
          <ButtonLink href="/analysis" variant="ghost">
            <RotateCcw className="h-4 w-4" />
            Run Another Analysis
          </ButtonLink>
        </div>
      </PageHeader>

      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <ResultSummaryCard label="Sample size" value={sampleResult.sampleSize} />
        <ResultSummaryCard label="r-value" value={sampleResult.rValue} />
        <ResultSummaryCard label="p-value" value={sampleResult.pValue} />
        <ResultSummaryCard label="Decision" value={sampleResult.decision} helper="p < 0.05" />
        <ResultSummaryCard label="Strength" value="Strong +" helper={sampleResult.strength} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <MockScatterPlot />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-primary">Results table</h2>
            </CardHeader>
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-on-surface-variant">
                <tr>
                  <th className="border-b border-outline-variant py-3">r-value</th>
                  <th className="border-b border-outline-variant py-3">p-value</th>
                  <th className="border-b border-outline-variant py-3">Strength</th>
                  <th className="border-b border-outline-variant py-3">Decision</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-outline-variant/60 py-4 tabular-nums">
                    {sampleResult.rValue}
                  </td>
                  <td className="border-b border-outline-variant/60 py-4 tabular-nums">
                    {sampleResult.pValue}
                  </td>
                  <td className="border-b border-outline-variant/60 py-4">
                    {sampleResult.strength}
                  </td>
                  <td className="border-b border-outline-variant/60 py-4 font-semibold text-secondary">
                    {sampleResult.decision}
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
          <InterpretationCard
            disclaimer={sampleResult.disclaimer}
            interpretation={sampleResult.interpretation}
          />
        </div>
      </div>
    </AppShell>
  );
}
