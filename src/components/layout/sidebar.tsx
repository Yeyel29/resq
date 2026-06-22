"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Database,
  FileDown,
  LineChart,
  ListChecks,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Upload", href: "/upload", icon: UploadCloud },
  { label: "Dataset Preview", href: "/datasets/sample/preview", icon: Database },
  { label: "Data Profile", href: "/datasets/sample/profile", icon: ListChecks },
  { label: "Analysis", href: "/analysis", icon: BarChart3 },
  { label: "Sample Result", href: "/results/sample", icon: LineChart },
  { label: "Export Preview", href: "/export/sample", icon: FileDown },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit min-w-0 shrink-0 rounded-card border border-outline-variant/70 bg-white p-3 shadow-academic lg:sticky lg:top-24">
      <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-outline">
        Workflow
      </p>
      <nav className="grid gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href.includes("/datasets") && pathname.startsWith(item.href.replace("sample", "")));

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-on-surface-variant transition hover:bg-sky-helper/70 hover:text-primary",
                active && "bg-sky-helper text-primary",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
