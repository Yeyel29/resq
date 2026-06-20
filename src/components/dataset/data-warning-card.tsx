import { AlertTriangle } from "lucide-react";

type DataWarningCardProps = {
  warning: string;
};

export function DataWarningCard({ warning }: DataWarningCardProps) {
  return (
    <div className="rounded-card border border-amber-200 bg-warning-soft p-4">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-700" />
        <p className="text-sm font-medium leading-6 text-amber-900">{warning}</p>
      </div>
    </div>
  );
}
