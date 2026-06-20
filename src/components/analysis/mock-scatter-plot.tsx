import { cn } from "@/lib/utils";

const points = [
  [14, 72],
  [22, 62],
  [28, 68],
  [33, 55],
  [38, 51],
  [45, 44],
  [52, 38],
  [58, 35],
  [64, 30],
  [71, 26],
  [77, 20],
  [84, 17],
];

type MockScatterPlotProps = {
  compact?: boolean;
};

export function MockScatterPlot({ compact }: MockScatterPlotProps) {
  return (
    <div className={cn("rounded-card border border-outline-variant bg-white p-5 shadow-soft", compact && "p-4")}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-primary">Study Hours x Final Grade</p>
          {!compact ? (
            <p className="text-sm text-on-surface-variant">
              Figure 1. Scatter Plot of Study Hours and Final Grade
            </p>
          ) : null}
        </div>
        <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-secondary">
          r = 0.72
        </span>
      </div>
      <div className={cn("relative h-72 overflow-hidden rounded-xl bg-surface-low", compact && "h-44")}>
        <div className="absolute inset-x-8 bottom-8 top-6 border-l border-b border-outline-variant" />
        {[25, 50, 75].map((line) => (
          <div
            className="absolute left-8 right-6 border-t border-dashed border-outline-variant/70"
            key={line}
            style={{ top: `${line}%` }}
          />
        ))}
        <div className="absolute left-[12%] top-[72%] h-0.5 w-[76%] -rotate-[28deg] bg-secondary/70" />
        {points.map(([left, top], index) => (
          <span
            className="absolute h-3 w-3 rounded-full border-2 border-white bg-primary shadow-soft"
            key={`${left}-${top}-${index}`}
            style={{ left: `${left}%`, top: `${top}%` }}
          />
        ))}
        {!compact ? (
          <>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold text-on-surface-variant">
              Study Hours
            </span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold text-on-surface-variant">
              Final Grade
            </span>
          </>
        ) : null}
      </div>
      {!compact ? (
        <p className="mt-3 text-center text-sm font-medium text-on-surface-variant">
          Figure 1. Scatter Plot of Study Hours and Final Grade
        </p>
      ) : null}
    </div>
  );
}
