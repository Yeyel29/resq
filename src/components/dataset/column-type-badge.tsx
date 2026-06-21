import { Badge } from "@/components/ui/badge";
import type { ColumnType } from "@/types/dataset";

type ColumnTypeBadgeProps = {
  type: ColumnType;
};

const labels: Record<ColumnType, string> = {
  numeric: "Numeric",
  categorical: "Categorical",
  likert: "Likert",
  date: "Date",
  text: "Text",
  unknown: "Unknown",
};

export function ColumnTypeBadge({ type }: ColumnTypeBadgeProps) {
  return <Badge variant={type}>{labels[type]}</Badge>;
}
