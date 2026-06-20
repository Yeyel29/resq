import { ColumnTypeBadge } from "@/components/dataset/column-type-badge";
import { sampleColumns, sampleRows } from "@/constants/sample-data";

const columns = sampleColumns.map((column) => column.name);

export function DatasetPreviewTable() {
  return (
    <div className="overflow-hidden rounded-card border border-outline-variant bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-surface-low text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              {columns.map((column) => {
                const profile = sampleColumns.find((item) => item.name === column);
                return (
                  <th className="whitespace-nowrap border-b border-outline-variant px-4 py-4" key={column}>
                    <div className="flex flex-col gap-2">
                      <span>{column}</span>
                      {profile ? <ColumnTypeBadge type={profile.type} /> : null}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sampleRows.map((row, index) => (
              <tr className="hover:bg-sky-helper/40" key={String(row["Respondent ID"] ?? index)}>
                {columns.map((column) => (
                  <td
                    className="whitespace-nowrap border-b border-outline-variant/60 px-4 py-4 tabular-nums text-on-surface-variant"
                    key={column}
                  >
                    {row[column] ?? <span className="text-error">Missing</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
