import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl font-semibold leading-tight text-primary md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-base leading-7 text-on-surface-variant md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
