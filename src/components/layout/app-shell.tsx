import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <div className="mx-auto grid max-w-workspace gap-6 px-4 py-8 md:px-8 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
