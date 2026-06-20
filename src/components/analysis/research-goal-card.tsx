import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ResearchGoal } from "@/types/analysis";

type ResearchGoalCardProps = {
  goal: ResearchGoal;
  selected?: boolean;
};

export function ResearchGoalCard({ goal, selected }: ResearchGoalCardProps) {
  const comingSoon = goal.status === "coming-soon";

  return (
    <Card
      className={cn(
        "relative min-h-48 transition",
        selected && "border-secondary bg-sky-helper/45 ring-2 ring-secondary/20",
        comingSoon && "opacity-70",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-primary">{goal.title}</h3>
          <p className="mt-3 leading-7 text-on-surface-variant">{goal.description}</p>
        </div>
        {selected ? <CheckCircle2 className="h-6 w-6 text-secondary" /> : null}
      </div>
      {comingSoon ? <Badge className="mt-5" variant="coming-soon">Coming Soon</Badge> : null}
    </Card>
  );
}
