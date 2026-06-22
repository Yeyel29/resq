import { cn } from "@/lib/utils";
import type { RecommendationStatus } from "@/types/analysis";

type RecommendationStatusBadgeProps = {
  status: RecommendationStatus;
};

const statusLabels: Record<RecommendationStatus, string> = {
  ready: "Ready",
  ready_with_caution: "Ready with caution",
  coming_soon: "Coming soon",
  unsupported: "Unsupported",
  needs_review: "Needs review",
};

const statusStyles: Record<RecommendationStatus, string> = {
  ready: "bg-secondary-container text-secondary",
  ready_with_caution: "bg-warning-soft text-amber-800",
  coming_soon: "bg-surface-high text-outline",
  unsupported: "bg-error-soft text-error",
  needs_review: "bg-warning-soft text-amber-800",
};

export function RecommendationStatusBadge({ status }: RecommendationStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
