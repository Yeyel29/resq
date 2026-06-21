import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "numeric"
  | "categorical"
  | "likert"
  | "text"
  | "date"
  | "unknown"
  | "coming-soon"
  | "significant"
  | "warning";

const variants: Record<BadgeVariant, string> = {
  numeric: "bg-sky-helper text-primary",
  categorical: "bg-secondary-container/70 text-secondary",
  likert: "bg-primary-soft text-primary-container",
  text: "bg-surface-high text-on-surface-variant",
  date: "bg-surface-container text-on-surface-variant",
  unknown: "bg-surface-container text-on-surface-variant",
  "coming-soon": "bg-surface-high text-outline",
  significant: "bg-secondary-container text-secondary",
  warning: "bg-warning-soft text-amber-800",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "text", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
