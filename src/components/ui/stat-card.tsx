import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: ReactNode;
  helper?: string;
};

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-on-surface-variant">{label}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-primary">{value}</p>
      {helper ? <p className="mt-2 text-sm text-on-surface-variant">{helper}</p> : null}
    </Card>
  );
}
