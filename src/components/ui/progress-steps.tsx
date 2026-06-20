import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ProgressStepsProps = {
  steps: string[];
  activeIndex: number;
};

export function ProgressSteps({ steps, activeIndex }: ProgressStepsProps) {
  return (
    <ol className="grid gap-3 rounded-card border border-outline-variant/70 bg-white p-4 shadow-soft md:grid-cols-5">
      {steps.map((step, index) => {
        const isComplete = index < activeIndex;
        const isActive = index === activeIndex;

        return (
          <li key={step} className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                isComplete && "border-secondary bg-secondary text-white",
                isActive && "border-primary bg-white text-primary",
                !isComplete && !isActive && "border-outline-variant bg-surface-low text-outline",
              )}
            >
              {isComplete ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                isActive ? "text-primary" : "text-on-surface-variant",
              )}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
