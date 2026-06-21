"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Database } from "lucide-react";
import { AnalysisNextStepPlaceholder } from "@/components/analysis/analysis-next-step-placeholder";
import { DatasetContextCard } from "@/components/analysis/dataset-context-card";
import { ResearchGoalCard } from "@/components/analysis/research-goal-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { getResearchGoalById, researchGoals } from "@/constants/research-goals";
import { readAnalysisDraft, saveAnalysisDraft } from "@/lib/analysis/storage";
import { createColumnProfiles } from "@/lib/dataset/profile";
import { createSampleDataset, readDatasetState, saveDataset } from "@/lib/dataset/storage";
import type { AnalysisDraft, ResearchGoal } from "@/types/analysis";
import type { ColumnProfile, UploadedDataset } from "@/types/dataset";

type WizardState =
  | { status: "loading" }
  | {
      status: "ready";
      dataset: UploadedDataset;
      draft: AnalysisDraft | null;
      profiles: ColumnProfile[];
    }
  | { status: "missing" }
  | { status: "corrupt" };

const analysisWorkflowSteps = [
  "Upload",
  "Preview",
  "Profile",
  "Goal",
  "Variables",
  "Results",
];

function createProfiledDataset(dataset: UploadedDataset): UploadedDataset {
  const columnProfiles = dataset.columnProfiles?.length
    ? dataset.columnProfiles
    : createColumnProfiles(dataset);

  return {
    ...dataset,
    columnProfiles,
  };
}

export function AnalysisWizardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVariablesStep = searchParams.get("step") === "variables";
  const [wizardState, setWizardState] = useState<WizardState>({ status: "loading" });
  const [selectedGoal, setSelectedGoal] = useState<ResearchGoal | null>(null);

  useEffect(() => {
    const datasetState = readDatasetState();

    if (datasetState.status === "corrupt") {
      setWizardState({ status: "corrupt" });
      return;
    }

    if (datasetState.status === "missing") {
      setWizardState({ status: "missing" });
      return;
    }

    const dataset = createProfiledDataset(datasetState.dataset);
    saveDataset(dataset);

    const storedDraft = readAnalysisDraft();
    const draft = storedDraft?.datasetId === dataset.id ? storedDraft : null;
    const draftGoal = getResearchGoalById(draft?.goalId);

    setWizardState({
      status: "ready",
      dataset,
      draft,
      profiles: dataset.columnProfiles ?? [],
    });

    if (draftGoal?.status === "available") {
      setSelectedGoal(draftGoal);
    }
  }, []);

  const activeDraft = useMemo(() => {
    if (wizardState.status !== "ready") {
      return null;
    }

    return wizardState.draft;
  }, [wizardState]);

  function trySampleDataset() {
    const sampleDataset = createProfiledDataset(createSampleDataset());
    saveDataset(sampleDataset);
    router.push("/datasets/sample/profile");
  }

  function handleGoalSelect(goal: ResearchGoal) {
    if (goal.status !== "available") {
      return;
    }

    setSelectedGoal(goal);
  }

  function continueToVariables() {
    if (wizardState.status !== "ready" || !selectedGoal) {
      return;
    }

    const existingDraft = readAnalysisDraft();
    const now = new Date().toISOString();
    const draft: AnalysisDraft = {
      datasetId: wizardState.dataset.id,
      datasetName: wizardState.dataset.name,
      goalId: selectedGoal.id,
      goalTitle: selectedGoal.title,
      status: "goal_selected",
      createdAt: existingDraft?.datasetId === wizardState.dataset.id ? existingDraft.createdAt : now,
      updatedAt: now,
    };

    saveAnalysisDraft(draft);
    setWizardState({
      ...wizardState,
      draft,
    });
    router.push("/analysis?step=variables");
  }

  if (wizardState.status === "loading") {
    return (
      <div className="min-w-0 space-y-8">
        <PageHeader
          description="Choose your research goal in simple terms. ScholarStat will use this to guide the next steps."
          eyebrow="ANALYSIS WIZARD"
          title="What do you want to find out?"
        />
        <ProgressSteps activeIndex={3} steps={analysisWorkflowSteps} />
        <Card>
          <p className="text-sm font-semibold text-on-surface-variant">Loading analysis wizard...</p>
        </Card>
      </div>
    );
  }

  if (wizardState.status === "corrupt") {
    return (
      <div className="min-w-0 space-y-8">
        <PageHeader
          description="Choose your research goal in simple terms. ScholarStat will use this to guide the next steps."
          eyebrow="ANALYSIS WIZARD"
          title="What do you want to find out?"
        />
        <ProgressSteps activeIndex={3} steps={analysisWorkflowSteps} />
        <Card className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-error-soft text-error">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold text-primary">We could not load this dataset</h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-on-surface-variant">
            The saved dataset may be incomplete or expired. Please upload and profile the file again.
          </p>
          <ButtonLink className="mt-6" href="/upload">
            Upload Dataset
          </ButtonLink>
        </Card>
      </div>
    );
  }

  if (wizardState.status === "missing") {
    return (
      <div className="min-w-0 space-y-8">
        <PageHeader
          description="Choose your research goal in simple terms. ScholarStat will use this to guide the next steps."
          eyebrow="ANALYSIS WIZARD"
          title="What do you want to find out?"
        />
        <ProgressSteps activeIndex={3} steps={analysisWorkflowSteps} />
        <Card className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-helper text-secondary">
            <Database className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold text-primary">No dataset ready for analysis</h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-on-surface-variant">
            Upload and profile a dataset first so ScholarStat can guide your research analysis.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/upload">Upload Dataset</ButtonLink>
            <Button onClick={trySampleDataset} type="button" variant="secondary">
              Try Sample Dataset
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const draftGoal = getResearchGoalById(activeDraft?.goalId);
  const placeholderDraft =
    isVariablesStep && activeDraft && draftGoal?.status === "available" ? activeDraft : null;

  return (
    <div className="min-w-0 space-y-8">
      <PageHeader
        description="Choose your research goal in simple terms. ScholarStat will use this to guide the next steps."
        eyebrow="ANALYSIS WIZARD"
        title="What do you want to find out?"
      />

      <ProgressSteps
        activeIndex={isVariablesStep ? 4 : 3}
        steps={analysisWorkflowSteps}
      />

      <DatasetContextCard dataset={wizardState.dataset} profiles={wizardState.profiles} />

      {placeholderDraft ? (
        <AnalysisNextStepPlaceholder draft={placeholderDraft} />
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            {researchGoals.map((goal) => (
              <ResearchGoalCard
                goal={goal}
                key={goal.id}
                onSelect={handleGoalSelect}
                selected={selectedGoal?.id === goal.id}
              />
            ))}
          </div>

          <Card className="flex flex-col gap-4 border-secondary/20 bg-white lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">
                ScholarStat guides your analysis workflow, but your adviser or statistician should review final results before submission.
              </p>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Select an available research goal to prepare the next step. Variable selection will be added in Phase 6.
              </p>
            </div>
            <Button
              disabled={!selectedGoal}
              onClick={continueToVariables}
              type="button"
              variant={selectedGoal ? "primary" : "disabled"}
            >
              Continue to Variable Selection
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}
