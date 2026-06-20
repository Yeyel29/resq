import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Card className="group min-h-56 overflow-hidden transition hover:-translate-y-0.5 hover:shadow-academic">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-helper text-secondary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
      <p className="mt-3 leading-7 text-on-surface-variant">{description}</p>
    </Card>
  );
}
