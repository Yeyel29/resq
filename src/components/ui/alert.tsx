import type { ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertProps = {
  title: string;
  children: ReactNode;
  tone?: "info" | "warning" | "error";
  className?: string;
};

export function Alert({ title, children, tone = "info", className }: AlertProps) {
  const Icon = tone === "info" ? Info : AlertTriangle;
  const toneClasses = {
    info: "border-sky-200 bg-sky-helper/70 text-primary",
    warning: "border-amber-200 bg-warning-soft text-amber-900",
    error: "border-red-200 bg-error-soft text-error",
  }[tone];

  return (
    <div className={cn("rounded-card border p-4", toneClasses, className)}>
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 flex-none" />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <div className="mt-1 text-sm leading-6 text-on-surface-variant">{children}</div>
        </div>
      </div>
    </div>
  );
}
