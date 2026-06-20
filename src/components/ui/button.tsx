import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "disabled";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white shadow-soft hover:bg-primary-container",
  secondary:
    "border border-secondary bg-white text-secondary shadow-soft hover:bg-sky-helper/60",
  ghost: "text-on-surface-variant hover:bg-surface-high hover:text-secondary",
  disabled:
    "cursor-not-allowed border border-outline-variant bg-surface-high text-outline",
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
};

export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}

export function ButtonLink({
  className,
  variant = "primary",
  href,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, className)} href={href} {...props}>
      {children}
    </Link>
  );
}
