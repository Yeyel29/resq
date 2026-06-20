import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressSteps } from "@/components/ui/progress-steps";
import { AppShell } from "@/components/layout/app-shell";
import { ResearchGoalCard } from "@/components/analysis/research-goal-card";
import { researchGoals } from "@/constants/research-goals";
import { workflowSteps } from "@/constants/sample-data";

export default function AnalysisPage() {
  return (
    <AppShell>
      <PageHeader
        description="Choose the student-friendly research goal that best matches your Chapter 4 question."
        eyebrow="Analysis Wizard"
        title="What do you want to find out?"
      >
        <ButtonLink href="/results/sample">Continue to Results</ButtonLink>
      </PageHeader>

      <div className="mb-8">
        <ProgressSteps activeIndex={2} steps={workflowSteps} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {researchGoals.map((goal) => (
          <ResearchGoalCard
            goal={goal}
            key={goal.id}
            selected={goal.id === "relationship"}
          />
        ))}
      </div>
    </AppShell>
  );
}
