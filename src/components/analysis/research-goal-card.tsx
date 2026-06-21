import { CheckCircle2, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ResearchGoal } from "@/types/analysis";

type ResearchGoalCardProps = {
  goal: ResearchGoal;
  onSelect?: (goal: ResearchGoal) => void;
  selected?: boolean;
};

export function ResearchGoalCard({ goal, onSelect, selected }: ResearchGoalCardProps) {
  const comingSoon = goal.status === "coming-soon";

  return (
    <button
      aria-pressed={selected}
      className={cn(
        "relative min-h-48 rounded-card border border-outline-variant/70 bg-white p-6 text-left shadow-academic transition",
        !comingSoon && "cursor-pointer hover:-translate-y-0.5 hover:border-secondary/70 hover:shadow-soft",
        selected && "border-secondary bg-sky-helper/45 ring-2 ring-secondary/20",
        comingSoon && "cursor-not-allowed bg-surface-low opacity-80",
      )}
      disabled={comingSoon}
      onClick={() => onSelect?.(goal)}
      type="button"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant={comingSoon ? "coming-soon" : "significant"}>
              {comingSoon ? "Coming Soon" : "Available"}
            </Badge>
            {goal.recommendedFor ? (
              <Badge variant="text">{goal.recommendedFor}</Badge>
            ) : null}
          </div>
          <h3 className="text-xl font-semibold text-primary">{goal.title}</h3>
          <p className="mt-3 leading-7 text-on-surface-variant">{goal.description}</p>
        </div>
        {selected ? <CheckCircle2 className="h-6 w-6 text-secondary" /> : null}
        {comingSoon ? <Clock3 className="h-5 w-5 shrink-0 text-outline" /> : null}
      </div>

      {selected ? (
        <div className="mt-5 rounded-xl border border-secondary/20 bg-white/80 p-4">
          <p className="text-sm font-semibold text-primary">Example research questions</p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-on-surface-variant">
            {goal.examples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-primary">Possible outputs later</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {goal.possibleOutputs.map((output) => (
              <Badge key={output} variant="text">
                {output}
              </Badge>
            ))}
          </div>
          {goal.warning ? (
            <p className="mt-4 rounded-lg bg-warning-soft px-3 py-2 text-sm font-semibold text-amber-900">
              {goal.warning}
            </p>
          ) : null}
        </div>
      ) : null}
    </button>
  );
}
