import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-outline-variant/70 bg-white p-6 shadow-academic",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("-mx-6 -mt-6 mb-6 rounded-t-card border-b border-outline-variant/60 bg-surface-low px-6 py-4", className)}
      {...props}
    />
  );
}
