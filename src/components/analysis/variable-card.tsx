import { CheckCircle2 } from "lucide-react";
import { ColumnTypeBadge } from "@/components/dataset/column-type-badge";
import { Badge } from "@/components/ui/badge";
import { formatCellValue } from "@/lib/dataset/preview";
import { cn } from "@/lib/utils";
import {
  getVariableSupportMessage,
  type SelectableVariable,
} from "@/lib/analysis/variables";

type VariableCardProps = {
  onSelect: (variable: SelectableVariable) => void;
  selected?: boolean;
  variable: SelectableVariable;
};

export function VariableCard({ onSelect, selected, variable }: VariableCardProps) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "rounded-card border border-outline-variant/70 bg-white p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-secondary/70",
        selected && "border-secondary bg-sky-helper/45 ring-2 ring-secondary/20",
      )}
      onClick={() => onSelect(variable)}
      type="button"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-semibold text-primary">{variable.name}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <ColumnTypeBadge type={variable.type} />
            {variable.limitedSupport ? <Badge variant="warning">Limited support</Badge> : null}
          </div>
        </div>
        {selected ? <CheckCircle2 className="h-6 w-6 shrink-0 text-secondary" /> : null}
      </div>

      <p className="mt-4 text-sm leading-6 text-on-surface-variant">
        {getVariableSupportMessage(variable.type)}
      </p>

      <div className="mt-4 grid gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
        <p>
          <span className="font-semibold text-primary">{variable.missingCount.toLocaleString()}</span>{" "}
          missing
        </p>
        <p>
          <span className="font-semibold text-primary">{variable.uniqueCount.toLocaleString()}</span>{" "}
          unique
        </p>
      </div>

      {variable.sampleValues.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-outline">
            Sample values
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {variable.sampleValues.slice(0, 4).map((value, index) => (
              <span
                className="max-w-full truncate rounded-full bg-surface-low px-3 py-1 text-xs font-semibold text-on-surface-variant"
                key={`${variable.name}-${String(value)}-${index}`}
                title={formatCellValue(value)}
              >
                {formatCellValue(value)}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {variable.warnings.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {variable.warnings.slice(0, 3).map((warning) => (
            <Badge key={warning} variant="warning">
              {warning}
            </Badge>
          ))}
        </div>
      ) : null}
    </button>
  );
}
