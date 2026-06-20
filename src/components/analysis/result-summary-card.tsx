import { Card } from "@/components/ui/card";

type ResultSummaryCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

export function ResultSummaryCard({ label, value, helper }: ResultSummaryCardProps) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-on-surface-variant">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-primary">{value}</p>
      {helper ? <p className="mt-2 text-xs font-medium text-secondary">{helper}</p> : null}
    </Card>
  );
}
