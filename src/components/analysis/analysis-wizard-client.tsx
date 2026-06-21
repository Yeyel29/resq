"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Database } from "lucide-react";
import { DatasetContextCard } from "@/components/analysis/dataset-context-card";
import { RecommendationPlaceholder } from "@/components/analysis/recommendation-placeholder";
import { ResearchGoalCard } from "@/components/analysis/research-goal-card";
import { VariableSelectionClient } from "@/components/analysis/variable-selection-client";
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
      profilesWereGenerated: boolean;
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

function createProfiledDataset(dataset: UploadedDataset) {
  const profilesWereGenerated = !dataset.columnProfiles?.length;
  const columnProfiles = profilesWereGenerated
    ? createColumnProfiles(dataset)
    : dataset.columnProfiles;

  const profiledDataset = {
    ...dataset,
    columnProfiles,
  };

  return {
    dataset: profiledDataset,
    profilesWereGenerated,
  };
}

export function AnalysisWizardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step");
  const isVariablesStep = currentStep === "variables";
  const isRecommendationStep = currentStep === "recommendation";
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

    const { dataset, profilesWereGenerated } = createProfiledDataset(datasetState.dataset);
    saveDataset(dataset);

    const storedDraft = readAnalysisDraft();
    const draft = storedDraft?.datasetId === dataset.id ? storedDraft : null;
    const draftGoal = getResearchGoalById(draft?.goalId);

    setWizardState({
      status: "ready",
      dataset,
      draft,
      profiles: dataset.columnProfiles ?? [],
      profilesWereGenerated,
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
    const { dataset: sampleDataset } = createProfiledDataset(createSampleDataset());
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

  function handleDraftUpdate(draft: AnalysisDraft) {
    if (wizardState.status !== "ready") {
      return;
    }

    saveAnalysisDraft(draft);
    setWizardState({
      ...wizardState,
      draft,
    });
    router.push("/analysis?step=recommendation");
  }

  function renderNoGoalState() {
    return (
      <div className="min-w-0 space-y-8">
        <PageHeader
          description="Choose your research goal before selecting variables."
          eyebrow="ANALYSIS WIZARD"
          title="No research goal selected"
        />
        <ProgressSteps activeIndex={3} steps={analysisWorkflowSteps} />
        <Card className="text-center">
          <h1 className="text-2xl font-semibold text-primary">No research goal selected</h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-on-surface-variant">
            Choose a research goal first before selecting variables.
          </p>
          <ButtonLink className="mt-6" href="/analysis">
            Choose Research Goal
          </ButtonLink>
        </Card>
      </div>
    );
  }

  function renderNoVariablesState() {
    return (
      <div className="min-w-0 space-y-8">
        <PageHeader
          description="Select the columns needed for your research goal before the recommendation step."
          eyebrow="ANALYSIS WIZARD"
          title="No variables selected"
        />
        <ProgressSteps activeIndex={4} steps={analysisWorkflowSteps} />
        <Card className="text-center">
          <h1 className="text-2xl font-semibold text-primary">No variables selected</h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-on-surface-variant">
            Choose the variable or variables for your research goal before viewing the test
            recommendation placeholder.
          </p>
          <ButtonLink className="mt-6" href="/analysis?step=variables">
            Back to Variables
          </ButtonLink>
        </Card>
      </div>
    );
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
    const missingTitle =
      isVariablesStep || isRecommendationStep
        ? "No dataset ready for variable selection"
        : "No dataset ready for analysis";
    const missingMessage =
      isVariablesStep || isRecommendationStep
        ? "Upload and profile a dataset first so ScholarStat can show the columns available for analysis."
        : "Upload and profile a dataset first so ScholarStat can guide your research analysis.";

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
          <h1 className="text-2xl font-semibold text-primary">{missingTitle}</h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-on-surface-variant">
            {missingMessage}
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
  const hasAvailableDraft = activeDraft && draftGoal?.status === "available";

  if ((isVariablesStep || isRecommendationStep) && !hasAvailableDraft) {
    return renderNoGoalState();
  }

  if (isVariablesStep && activeDraft && draftGoal?.status === "available") {
    return (
      <VariableSelectionClient
        dataset={wizardState.dataset}
        draft={activeDraft}
        goal={draftGoal}
        onDraftUpdate={handleDraftUpdate}
        profiles={wizardState.profiles}
        profilesWereGenerated={wizardState.profilesWereGenerated}
        steps={analysisWorkflowSteps}
      />
    );
  }

  if (isRecommendationStep && activeDraft && draftGoal?.status === "available") {
    if (activeDraft.status !== "variables_selected" || !activeDraft.selectedVariables?.length) {
      return renderNoVariablesState();
    }

    return (
      <div className="min-w-0 space-y-8">
        <ProgressSteps activeIndex={4} steps={analysisWorkflowSteps} />
        <DatasetContextCard dataset={wizardState.dataset} profiles={wizardState.profiles} />
        <RecommendationPlaceholder draft={activeDraft} />
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-8">
      <PageHeader
        description="Choose your research goal in simple terms. ScholarStat will use this to guide the next steps."
        eyebrow="ANALYSIS WIZARD"
        title="What do you want to find out?"
      />

      <ProgressSteps activeIndex={3} steps={analysisWorkflowSteps} />

      <DatasetContextCard dataset={wizardState.dataset} profiles={wizardState.profiles} />

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
            Select an available research goal to prepare variable selection.
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
    </div>
  );
}
