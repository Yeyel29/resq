import { AlertTriangle, ShieldCheck } from "lucide-react";

type DataQualityWarningPanelProps = {
  warnings: string[];
};

export function DataQualityWarningPanel({ warnings }: DataQualityWarningPanelProps) {
  return (
    <div className="grid gap-4">
      <div className="rounded-card border border-sky-200 bg-sky-helper/70 p-4">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-secondary" />
          <p className="text-sm font-semibold leading-6 text-primary">
            Before continuing, make sure your dataset does not contain names, student
            numbers, contact details, or other personally identifiable information.
          </p>
        </div>
      </div>
      {warnings.map((warning) => (
        <div className="rounded-card border border-amber-200 bg-warning-soft p-4" key={warning}>
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-700" />
            <p className="text-sm font-medium leading-6 text-amber-900">{warning}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
