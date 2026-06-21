"use client";

import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { DatasetContextCard } from "@/components/analysis/dataset-context-card";
import { VariableCard } from "@/components/analysis/variable-card";
import { VariableCompatibilityPanel } from "@/components/analysis/variable-compatibility-panel";
import { VariableSelect } from "@/components/analysis/variable-select";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { updateDraftSelectedVariables } from "@/lib/analysis/storage";
import {
  getSelectableColumns,
  toSelectedVariable,
  validateDescriptiveSelection,
  validateRelationshipSelection,
  type SelectableVariable,
} from "@/lib/analysis/variables";
import type { AnalysisDraft, ResearchGoal } from "@/types/analysis";
import type { ColumnProfile, UploadedDataset } from "@/types/dataset";

type VariableSelectionClientProps = {
  dataset: UploadedDataset;
  draft: AnalysisDraft;
  goal: ResearchGoal;
  onDraftUpdate: (draft: AnalysisDraft) => void;
  profiles: ColumnProfile[];
  profilesWereGenerated?: boolean;
  steps: string[];
};

function findVariable(variables: SelectableVariable[], name: string) {
  return variables.find((variable) => variable.name === name) ?? null;
}

export function VariableSelectionClient({
  dataset,
  draft,
  goal,
  onDraftUpdate,
  profiles,
  profilesWereGenerated,
  steps,
}: VariableSelectionClientProps) {
  const variables = useMemo(
    () => getSelectableColumns(dataset, profiles),
    [dataset, profiles],
  );
  const existingPrimary = draft.selectedVariables?.find((variable) => variable.role === "primary");
  const existingX = draft.selectedVariables?.find((variable) => variable.role === "x");
  const existingY = draft.selectedVariables?.find((variable) => variable.role === "y");
  const [primaryName, setPrimaryName] = useState(existingPrimary?.name ?? "");
  const [xName, setXName] = useState(existingX?.name ?? "");
  const [yName, setYName] = useState(existingY?.name ?? "");

  const selectedPrimary = findVariable(variables, primaryName);
  const selectedX = findVariable(variables, xName);
  const selectedY = findVariable(variables, yName);
  const isDescriptive = goal.id === "describe_data";
  const validation = isDescriptive
    ? validateDescriptiveSelection(selectedPrimary)
    : validateRelationshipSelection(selectedX, selectedY);

  function continueToRecommendation() {
    if (!validation.isValid) {
      return;
    }

    const selectedVariables = isDescriptive
      ? selectedPrimary
        ? [toSelectedVariable(selectedPrimary, "primary")]
        : []
      : selectedX && selectedY
        ? [toSelectedVariable(selectedX, "x"), toSelectedVariable(selectedY, "y")]
        : [];

    if (selectedVariables.length === 0) {
      return;
    }

    onDraftUpdate(updateDraftSelectedVariables(draft, selectedVariables));
  }

  return (
    <div className="min-w-0 space-y-8">
      <ProgressSteps activeIndex={4} steps={steps} />
      <DatasetContextCard dataset={dataset} profiles={profiles} />

      <Card className="border-secondary/20 bg-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
          Research goal selected
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-primary">{goal.title}</h2>
        <p className="mt-3 leading-7 text-on-surface-variant">
          {isDescriptive
            ? "Next step: Choose one variable you want to summarize."
            : "Next step: Choose two variables you want to examine together."}
        </p>
      </Card>

      {profilesWereGenerated ? (
        <Card className="border-amber-200 bg-warning-soft">
          <p className="text-sm font-semibold leading-6 text-amber-900">
            Column profiles were not found. ScholarStat is using basic column information. For
            better guidance, review the Data Profile first.
          </p>
          <ButtonLink className="mt-4" href={`/datasets/${dataset.id}/profile`} variant="secondary">
            Review Data Profile
          </ButtonLink>
        </Card>
      ) : null}

      <section className="space-y-5">
        <div>
          <h2 className="font-display text-3xl font-semibold text-primary">
            {isDescriptive
              ? "Choose a variable to describe"
              : "Choose two variables to check for a relationship"}
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-on-surface-variant">
            {isDescriptive
              ? "Select one column you want to summarize using counts, percentages, averages, or distribution summaries."
              : "Select the two columns you want to examine together. ScholarStat will use their variable types to suggest a suitable relationship analysis in the next step."}
          </p>
        </div>

        {isDescriptive ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {variables.map((variable) => (
              <VariableCard
                key={variable.name}
                onSelect={(nextVariable) => setPrimaryName(nextVariable.name)}
                selected={primaryName === variable.name}
                variable={variable}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <VariableSelect
              id="variable-x"
              label="Variable X"
              onChange={setXName}
              options={variables}
              selectedVariable={selectedX}
              value={xName}
            />
            <VariableSelect
              id="variable-y"
              label="Variable Y"
              onChange={setYName}
              options={variables}
              selectedVariable={selectedY}
              value={yName}
            />
          </div>
        )}
      </section>

      <VariableCompatibilityPanel result={validation} />

      <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm font-semibold leading-6 text-on-surface-variant">
          ScholarStat will suggest a starting analysis path based on your selected variables. Final
          results should still be reviewed by your adviser or statistician.
        </p>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <ButtonLink href="/analysis" variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to Research Goal
          </ButtonLink>
          <Button
            disabled={!validation.isValid}
            onClick={continueToRecommendation}
            type="button"
            variant={validation.isValid ? "primary" : "disabled"}
          >
            Continue to Test Recommendation
          </Button>
        </div>
      </Card>
    </div>
  );
}
