import { Badge } from "@/components/ui/badge";
import { InterpretationCard } from "@/components/analysis/interpretation-card";
import { MockScatterPlot } from "@/components/analysis/mock-scatter-plot";
import { sampleResult } from "@/constants/sample-data";

export function HeroPreview() {
  return (
    <div className="relative rounded-[1.5rem] border border-outline-variant bg-white p-4 shadow-academic md:p-6">
      <div className="mb-5 flex items-center justify-between rounded-xl border border-outline-variant bg-surface-low px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-primary">student-research-sample.xlsx</p>
          <p className="text-xs text-on-surface-variant">Preview, profile, analyze</p>
        </div>
        <Badge variant="significant">Guided</Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.3fr]">
        <div className="rounded-card border border-outline-variant bg-surface-lowest p-4">
          <p className="mb-3 text-sm font-bold text-primary">Variables</p>
          {[
            ["Study Hours", "Numeric"],
            ["Final Grade", "Numeric"],
            ["Satisfaction Score", "Likert"],
            ["Gender", "Categorical"],
          ].map(([name, type]) => (
            <div
              className="flex items-center justify-between border-b border-dashed border-outline-variant py-3 last:border-0"
              key={name}
            >
              <span className="text-sm text-on-surface-variant">{name}</span>
              <Badge variant={type === "Likert" ? "likert" : type === "Numeric" ? "numeric" : "categorical"}>
                {type}
              </Badge>
            </div>
          ))}
        </div>
        <div className="grid gap-4">
          <MockScatterPlot compact />
          <InterpretationCard
            disclaimer="Adviser review required before submission."
            interpretation={sampleResult.interpretation}
            title="Thesis-ready interpretation"
          />
        </div>
      </div>
    </div>
  );
}
