type WorkflowStepProps = {
  step: number;
  title: string;
  description: string;
};

export function WorkflowStep({ step, title, description }: WorkflowStepProps) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-white shadow-soft">
        <span className="font-display text-3xl font-semibold text-primary">{step}</span>
      </div>
      <h3 className="text-base font-bold text-primary">{title}</h3>
      <p className="mt-2 max-w-56 text-sm leading-6 text-on-surface-variant">{description}</p>
    </div>
  );
}
