import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

type InterpretationCardProps = {
  title?: string;
  interpretation: string;
  disclaimer: string;
};

export function InterpretationCard({
  title = "Research Interpretation",
  interpretation,
  disclaimer,
}: InterpretationCardProps) {
  return (
    <Card className="border-l-4 border-l-secondary">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <FileText className="h-5 w-5 text-secondary" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <p className="leading-7 text-on-surface-variant">{interpretation}</p>
      <p className="mt-4 rounded-xl bg-sky-helper/70 p-4 text-sm font-medium leading-6 text-primary">
        {disclaimer}
      </p>
    </Card>
  );
}
