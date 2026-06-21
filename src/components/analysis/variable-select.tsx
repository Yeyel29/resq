import { ColumnTypeBadge } from "@/components/dataset/column-type-badge";
import { Badge } from "@/components/ui/badge";
import { formatCellValue } from "@/lib/dataset/preview";
import {
  getVariableSupportMessage,
  type SelectableVariable,
} from "@/lib/analysis/variables";

type VariableSelectProps = {
  id: string;
  label: string;
  onChange: (variableName: string) => void;
  options: SelectableVariable[];
  selectedVariable: SelectableVariable | null;
  value: string;
};

export function VariableSelect({
  id,
  label,
  onChange,
  options,
  selectedVariable,
  value,
}: VariableSelectProps) {
  return (
    <div className="rounded-card border border-outline-variant/70 bg-white p-5 shadow-soft">
      <label className="text-sm font-semibold text-primary" htmlFor={id}>
        {label}
      </label>
      <select
        className="mt-3 min-h-11 w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm font-semibold text-primary"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">Choose a column</option>
        {options.map((variable) => (
          <option key={variable.name} value={variable.name}>
            {variable.name} ({variable.type})
          </option>
        ))}
      </select>

      {selectedVariable ? (
        <div className="mt-4 rounded-xl bg-surface-low p-4">
          <div className="flex flex-wrap items-center gap-2">
            <ColumnTypeBadge type={selectedVariable.type} />
            {selectedVariable.limitedSupport ? (
              <Badge variant="warning">Limited support</Badge>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            {getVariableSupportMessage(selectedVariable.type)}
          </p>
          <div className="mt-3 grid gap-2 text-sm text-on-surface-variant sm:grid-cols-2">
            <p>
              <span className="font-semibold text-primary">
                {selectedVariable.missingCount.toLocaleString()}
              </span>{" "}
              missing
            </p>
            <p>
              <span className="font-semibold text-primary">
                {selectedVariable.uniqueCount.toLocaleString()}
              </span>{" "}
              unique
            </p>
          </div>
          {selectedVariable.sampleValues.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedVariable.sampleValues.slice(0, 4).map((value, index) => (
                <span
                  className="max-w-full truncate rounded-full bg-white px-3 py-1 text-xs font-semibold text-on-surface-variant"
                  key={`${selectedVariable.name}-${String(value)}-${index}`}
                  title={formatCellValue(value)}
                >
                  {formatCellValue(value)}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
