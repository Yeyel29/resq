"use client";

import { useEffect, useMemo } from "react";
import { AlertTriangle, ArrowLeft, BarChart3, CheckCircle2, ClipboardCheck } from "lucide-react";
import { DatasetContextCard } from "@/components/analysis/dataset-context-card";
import { RecommendationStatusBadge } from "@/components/analysis/recommendation-status-badge";
import { ColumnTypeBadge } from "@/components/dataset/column-type-badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { getTestRecommendation } from "@/lib/analysis/recommendation";
import { updateDraftRecommendation } from "@/lib/analysis/storage";
import type { AnalysisDraft, SelectedVariable, TestRecommendation } from "@/types/analysis";
import type { ColumnProfile, UploadedDataset } from "@/types/dataset";

type TestRecommendationClientProps = {
  dataset: UploadedDataset;
  draft: AnalysisDraft;
  onDraftUpdate: (draft: AnalysisDraft, nextPath?: string) => void;
  profiles: ColumnProfile[];
};

const recommendationWorkflowSteps = [
  "Upload",
  "Preview",
  "Profile",
  "Goal",
  "Variables",
  "Recommendation",
  "Results",
];

function roleLabel(variable: SelectedVariable) {
  if (variable.role === "primary") {
    return "Variable to describe";
  }

  if (variable.role === "x") {
    return "Variable X";
  }

  if (variable.role === "y") {
    return "Variable Y";
  }

  return variable.role;
}

function shouldPersistRecommendation(draft: AnalysisDraft, recommendation: TestRecommendation) {
  if (draft.status !== "recommendation_ready" || !draft.recommendation) {
    return true;
  }

  return JSON.stringify(draft.recommendation) !== JSON.stringify(recommendation);
}

export function TestRecommendationClient({
  dataset,
  draft,
  onDraftUpdate,
  profiles,
}: TestRecommendationClientProps) {
  const recommendation = useMemo(
    () => getTestRecommendation(draft, dataset),
    [dataset, draft],
  );
  const canContinue =
    recommendation.status === "ready" || recommendation.status === "ready_with_caution";

  useEffect(() => {
    if (shouldPersistRecommendation(draft, recommendation)) {
      onDraftUpdate(updateDraftRecommendation(draft, recommendation));
    }
  }, [draft, onDraftUpdate, recommendation]);

  return (
    <div className="min-w-0 space-y-8">
      <PageHeader
        description="ScholarStat suggests a starting statistical test based on your research goal and selected variable types."
        eyebrow="ANALYSIS WIZARD"
        title="Recommended Analysis Path"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/analysis?step=variables" variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to Variables
          </ButtonLink>
          <ButtonLink href={`/datasets/${draft.datasetId}/profile`} variant="ghost">
            Back to Data Profile
          </ButtonLink>
        </div>
      </PageHeader>

      <ProgressSteps activeIndex={5} steps={recommendationWorkflowSteps} />
      <DatasetContextCard dataset={dataset} profiles={profiles} />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
            Research goal
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-primary">{draft.goalTitle}</h2>
          <div className="mt-5 grid gap-3">
            {recommendation.selectedVariables.map((variable) => (
              <div
                className="rounded-xl border border-outline-variant/70 bg-surface-low p-4"
                key={`${variable.role}-${variable.name}`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-outline">
                  {roleLabel(variable)}
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
        </Card>

        <Card className="min-w-0 border-secondary/25 bg-sky-helper/45">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-secondary shadow-soft">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                  Recommended analysis
                </p>
                <h2 className="mt-2 break-words font-display text-3xl font-semibold text-primary">
                  {recommendation.label}
                </h2>
                <div className="mt-3">
                  <RecommendationStatusBadge status={recommendation.status} />
                </div>
                <p className="mt-5 max-w-3xl leading-7 text-on-surface-variant">
                  {recommendation.plainLanguageSummary}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-lg font-semibold text-primary">Why this is recommended</h2>
          <p className="mt-3 leading-7 text-on-surface-variant">{recommendation.reason}</p>
          <div className="mt-6 rounded-xl border border-outline-variant/70 bg-surface-low p-4">
            <p className="text-sm font-semibold text-primary">What ScholarStat can do next</p>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
              {recommendation.nextStepLabel}
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-helper text-secondary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">Recommended chart</h2>
              <p className="mt-2 text-2xl font-semibold text-primary">
                {recommendation.recommendedChart.label}
              </p>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                Chart generation is not implemented in this phase. This is a planning
                recommendation only.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <h2 className="text-lg font-semibold text-primary">Warnings</h2>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-on-surface-variant">
                {recommendation.warnings.map((warning) => (
                  <li key={warning}>- {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-secondary" />
            <div>
              <h2 className="text-lg font-semibold text-primary">Assumptions to review</h2>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-on-surface-variant">
                {recommendation.assumptions.map((assumption) => (
                  <li key={assumption}>- {assumption}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <Card className="flex flex-col gap-4 border-secondary/20 bg-white lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            ScholarStat suggests this as a starting analysis path based on your selected goal and variable types.
          </p>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Final analysis should be reviewed by your research adviser, statistician, or
            qualified academic reviewer before submission.
          </p>
          {canContinue ? (
            <p className="mt-2 text-sm font-semibold text-amber-800">
              Real analysis computation will be implemented in the next phase.
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          {canContinue ? (
            <ButtonLink href="/analysis?step=recommendation">
              Continue to Analysis
            </ButtonLink>
          ) : (
            <Button disabled type="button" variant="disabled">
              Continue to Analysis
            </Button>
          )}
          <ButtonLink href="/analysis?step=variables" variant="secondary">
            Back to Variables
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
