import { ClipboardCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ColumnTypeBadge } from "@/components/dataset/column-type-badge";
import type { AnalysisDraft } from "@/types/analysis";

type RecommendationPlaceholderProps = {
  draft: AnalysisDraft;
};

function roleLabel(role: string) {
  if (role === "primary") {
    return "Selected variable";
  }

  if (role === "x") {
    return "Variable X";
  }

  if (role === "y") {
    return "Variable Y";
  }

  return role;
}

export function RecommendationPlaceholder({ draft }: RecommendationPlaceholderProps) {
  return (
    <Card className="border-secondary/30 bg-sky-helper/45">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-secondary shadow-soft">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Phase 7 Preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-primary">
              Test Recommendation Comes Next
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-on-surface-variant">
              ScholarStat has saved your research goal and selected variables. In the next phase,
              this page will suggest the most appropriate statistical test based on your variable
              types.
            </p>

            <div className="mt-5 rounded-xl border border-white/80 bg-white/85 p-4">
              <p className="text-sm font-semibold text-on-surface-variant">Dataset</p>
              <p className="mt-1 break-words text-lg font-semibold text-primary">
                {draft.datasetName}
              </p>
              <p className="mt-4 text-sm font-semibold text-on-surface-variant">Research goal</p>
              <p className="mt-1 text-lg font-semibold text-primary">{draft.goalTitle}</p>

              <div className="mt-5 grid gap-3">
                {draft.selectedVariables?.map((variable) => (
                  <div
                    className="rounded-xl border border-outline-variant/70 bg-surface-low p-4"
                    key={`${variable.role}-${variable.name}`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-outline">
                      {roleLabel(variable.role)}
                    </p>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="break-words text-base font-semibold text-primary">
                        {variable.name}
                      </p>
                      <ColumnTypeBadge type={variable.type} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 rounded-xl border border-amber-200 bg-warning-soft p-4 text-sm font-semibold leading-6 text-amber-900">
              ScholarStat will suggest a starting analysis path based on your selected variables.
              Final results should still be reviewed by your adviser or statistician.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <ButtonLink href="/analysis?step=variables" variant="secondary">
            Back to Variables
          </ButtonLink>
          <ButtonLink href={`/datasets/${draft.datasetId}/profile`} variant="ghost">
            Back to Data Profile
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
