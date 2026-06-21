import { ArrowLeft, ClipboardList } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AnalysisDraft } from "@/types/analysis";

type AnalysisNextStepPlaceholderProps = {
  draft: AnalysisDraft;
};

export function AnalysisNextStepPlaceholder({ draft }: AnalysisNextStepPlaceholderProps) {
  return (
    <Card className="border-secondary/30 bg-sky-helper/45">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-secondary shadow-soft">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Next Step
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-primary">
              Variable Selection Comes Next
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-on-surface-variant">
              You selected “{draft.goalTitle}”. In the next step, ScholarStat will help
              you choose the correct variable or variables for this research goal.
            </p>
            <p className="mt-4 rounded-xl border border-white/80 bg-white/80 p-4 text-sm font-semibold leading-6 text-primary">
              {draft.goalId === "describe_data"
                ? "Next, you will choose one variable to summarize, such as Final Grade, Satisfaction Score, Gender, or Year Level."
                : "Next, you will choose two variables to check for a relationship, such as Study Hours and Final Grade."}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <ButtonLink href="/analysis" variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to Research Goal
          </ButtonLink>
          <ButtonLink href={`/datasets/${draft.datasetId}/preview`} variant="ghost">
            Go to Preview
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
