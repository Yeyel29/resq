import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationResult } from "@/lib/analysis/variables";

type VariableCompatibilityPanelProps = {
  result: ValidationResult;
};

export function VariableCompatibilityPanel({ result }: VariableCompatibilityPanelProps) {
  const Icon =
    result.tone === "error" ? AlertTriangle : result.tone === "warning" ? AlertTriangle : Info;

  return (
    <div
      className={cn(
        "rounded-card border p-4 text-sm font-semibold leading-6",
        result.tone === "error" && "border-red-200 bg-error-soft text-error",
        result.tone === "warning" && "border-amber-200 bg-warning-soft text-amber-900",
        result.tone === "neutral" && "border-sky-200 bg-sky-helper/70 text-primary",
      )}
      role={result.tone === "error" ? "alert" : "status"}
    >
      <div className="flex gap-3">
        {result.isValid && result.tone === "neutral" ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        ) : (
          <Icon className="mt-0.5 h-5 w-5 shrink-0" />
        )}
        <p>{result.message}</p>
      </div>
    </div>
  );
}
