import { GraduationCap, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 overflow-x-hidden border-b border-outline-variant/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full min-w-0 max-w-workspace items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-2xl font-semibold leading-none text-primary">
              ScholarStat
            </p>
            <p className="truncate text-xs font-medium text-on-surface-variant">
              Research analysis workspace
            </p>
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-2 rounded-full border border-outline-variant bg-surface-low px-4 py-2 text-sm text-on-surface-variant md:flex">
          <Search className="h-4 w-4" />
          Phase 0 demo workspace
        </div>
      </div>
    </header>
  );
}
