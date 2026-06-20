import { Badge } from "@/components/ui/badge";
import { MockScatterPlot } from "@/components/analysis/mock-scatter-plot";
import { sampleResult } from "@/constants/sample-data";

export function HeroPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -bottom-10 -right-8 h-64 w-64 rounded-full bg-teal/25 blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-8 right-8 h-44 w-44 rounded-full bg-sky-helper/55 blur-[70px]"
      />
      <div className="relative overflow-hidden rounded-[1.35rem] border border-outline-variant bg-white p-4 shadow-academic md:p-5">
        <div className="mb-4 flex items-center justify-between rounded-xl border border-outline-variant bg-surface-low px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-primary">student-research-sample.xlsx</p>
            <p className="text-xs text-on-surface-variant">Preview, profile, analyze</p>
          </div>
          <Badge variant="significant">Guided</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-[210px_1fr]">
          <div className="rounded-card border border-outline-variant bg-surface-lowest p-4">
            <p className="mb-3 text-sm font-bold text-primary">Variables</p>
            {[
              ["Study Hours", "Numeric"],
              ["Final Grade", "Numeric"],
              ["Satisfaction Score", "Likert"],
              ["Gender", "Categorical"],
            ].map(([name, type]) => (
              <div
                className="flex items-center justify-between gap-3 border-b border-dashed border-outline-variant py-2.5 last:border-0"
                key={name}
              >
                <span className="truncate text-sm text-on-surface-variant">{name}</span>
                <Badge
                  variant={
                    type === "Likert"
                      ? "likert"
                      : type === "Numeric"
                        ? "numeric"
                        : "categorical"
                  }
                >
                  {type}
                </Badge>
              </div>
            ))}
          </div>
          <div className="grid gap-4">
            <MockScatterPlot compact />
            <div className="rounded-card border border-outline-variant bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-secondary" />
                <p className="text-sm font-bold text-primary">Thesis-ready interpretation</p>
              </div>
              <p className="line-clamp-4 text-sm leading-6 text-on-surface-variant">
                {sampleResult.interpretation}
              </p>
              <p className="mt-3 rounded-lg bg-sky-helper/70 p-3 text-xs font-semibold leading-5 text-primary">
                Adviser review required before submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
