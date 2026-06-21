import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Topbar />
      <div className="mx-auto grid w-full min-w-0 max-w-workspace gap-6 px-4 py-8 md:px-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
