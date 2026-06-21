"use client";

import { useMemo, useState } from "react";
import { sampleColumns, sampleRows } from "@/constants/sample-data";
import {
  formatCellValue,
  getPreviewRows,
  inferPreviewColumnType,
  isMissingValue,
  type PreviewColumnType,
} from "@/lib/dataset/preview";
import type { DatasetRow } from "@/types/dataset";

type DatasetPreviewTableProps = {
  columns?: string[];
  rows?: DatasetRow[];
};

const rowsPerPageOptions = [10, 25, 50];

const typeBadgeStyles: Record<PreviewColumnType, string> = {
  numeric: "bg-sky-helper text-primary",
  text: "bg-surface-high text-on-surface-variant",
  mixed: "bg-warning-soft text-amber-800",
  empty: "bg-error-soft text-error",
  unknown: "bg-surface-container text-on-surface-variant",
};

const typeLabels: Record<PreviewColumnType, string> = {
  numeric: "Numeric",
  text: "Text",
  mixed: "Mixed",
  empty: "Empty",
  unknown: "Unknown",
};

function PreviewTypeBadge({ type }: { type: PreviewColumnType }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold normal-case ${typeBadgeStyles[type]}`}
    >
      {typeLabels[type]}
    </span>
  );
}

export function DatasetPreviewTable({
  columns = sampleColumns.map((column) => column.name),
  rows = sampleRows,
}: DatasetPreviewTableProps) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const previewRows = getPreviewRows(rows, safePage, rowsPerPage);
  const firstRowNumber = rows.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1;
  const lastRowNumber = Math.min(safePage * rowsPerPage, rows.length);
  const previewTypes = useMemo(() => {
    return Object.fromEntries(
      columns.map((column) => [column, inferPreviewColumnType(rows, column)]),
    ) as Record<string, PreviewColumnType>;
  }, [columns, rows]);

  function updateRowsPerPage(value: number) {
    setRowsPerPage(value);
    setPage(1);
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-card border border-outline-variant bg-white shadow-soft">
      <div className="flex flex-col gap-4 border-b border-outline-variant bg-surface-low px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Table preview</p>
          <p className="text-sm text-on-surface-variant">
            {rows.length === 0
              ? "No rows available"
              : `Showing rows ${firstRowNumber.toLocaleString()}-${lastRowNumber.toLocaleString()} of ${rows.length.toLocaleString()}`}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-on-surface-variant" htmlFor="rows-per-page">
            Rows per page
          </label>
          <select
            className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm font-semibold text-primary"
            id="rows-per-page"
            onChange={(event) => updateRowsPerPage(Number(event.target.value))}
            value={rowsPerPage}
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-max min-w-full table-auto border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-surface-low text-xs uppercase tracking-wide text-on-surface-variant">
            <tr>
              <th className="min-w-16 whitespace-nowrap border-b border-outline-variant px-4 py-4">
                #
              </th>
              {columns.map((column) => (
                <th className="max-w-[220px] whitespace-nowrap border-b border-outline-variant px-4 py-4" key={column}>
                  <div className="flex flex-col gap-2">
                    <span className="block max-w-[220px] truncate" title={column}>
                      {column}
                    </span>
                    <span className="text-[10px] font-semibold normal-case tracking-normal text-outline">
                      Preview type
                    </span>
                    <PreviewTypeBadge type={previewTypes[column] ?? "unknown"} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, index) => (
              <tr className="hover:bg-sky-helper/40" key={String(row["Respondent ID"] ?? `${safePage}-${index}`)}>
                <td className="whitespace-nowrap border-b border-outline-variant/60 px-4 py-4 text-sm font-semibold tabular-nums text-outline">
                  {(firstRowNumber + index).toLocaleString()}
                </td>
                {columns.map((column) => (
                  <td
                    className="max-w-[260px] whitespace-nowrap border-b border-outline-variant/60 px-4 py-4 tabular-nums text-on-surface-variant"
                    key={column}
                  >
                    <span
                      className={`block max-w-[260px] truncate ${isMissingValue(row[column]) ? "text-outline" : ""}`}
                      title={formatCellValue(row[column])}
                    >
                      {formatCellValue(row[column])}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
            {previewRows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-sm text-on-surface-variant"
                  colSpan={columns.length + 1}
                >
                  No rows were found in this dataset preview.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-outline-variant bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-on-surface-variant">
          Wide datasets can be reviewed with horizontal scrolling.
        </p>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-outline-variant px-3 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40"
            disabled={safePage <= 1}
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            type="button"
          >
            Previous
          </button>
          <span className="px-2 text-sm font-semibold text-on-surface-variant">
            Page {safePage} of {totalPages}
          </span>
          <button
            className="rounded-lg border border-outline-variant px-3 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40"
            disabled={safePage >= totalPages}
            onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
