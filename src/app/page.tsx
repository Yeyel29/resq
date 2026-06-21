import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Download,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  UploadCloud,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { FeatureCard } from "@/components/marketing/feature-card";
import { HeroPreview } from "@/components/marketing/hero-preview";
import { WorkflowStep } from "@/components/marketing/workflow-step";

const features = [
  {
    title: "Upload Excel or CSV",
    description:
      "Bring in a student research dataset and review it before any analysis starts.",
    icon: FileSpreadsheet,
  },
  {
    title: "Get test recommendations",
    description:
      "Choose a research goal and see a plain-language explanation of the suggested test.",
    icon: Brain,
  },
  {
    title: "Generate research plots",
    description:
      "Preview clean statistical figures designed for Chapter 4 results writing.",
    icon: BarChart3,
  },
  {
    title: "Export thesis-style results",
    description:
      "Collect the test, table, figure, interpretation, and disclaimer into a thesis-like page.",
    icon: FileText,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="sticky top-0 z-40 border-b border-outline-variant/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-workspace items-center justify-between px-4 py-4 md:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="font-display text-3xl font-semibold text-primary">
              ScholarStat
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-on-surface-variant md:flex">
            <a className="hover:text-primary" href="#features">
              Features
            </a>
            <a className="hover:text-primary" href="#workflow">
              Workflow
            </a>
            <Link className="hover:text-primary" href="/results/sample">
              Sample Result
            </Link>
          </nav>
          <ButtonLink className="hidden md:inline-flex" href="/upload">
            Start Analyzing
          </ButtonLink>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-background px-4 py-16 md:px-8 md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 z-0 -mr-[20%] -mt-[10%] h-[80%] w-[60%] rounded-full bg-[#F2F4F6] opacity-60 blur-[100px]"
          />
          <div className="relative z-10 mx-auto grid max-w-workspace items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-high px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                <GraduationCap className="h-4 w-4" />
                Academic Precision
              </div>
              <h1 className="font-display text-5xl font-bold leading-tight text-primary md:text-6xl">
                Analyze your thesis data without getting lost in statistics.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant">
                Upload your CSV or Excel file, get the right statistical test, generate
                proper plots, and export thesis-ready results.
              </p>
              <p className="mt-5 max-w-2xl rounded-card border border-sky-200 bg-sky-helper/70 p-4 text-sm font-medium leading-6 text-primary">
                Upload your research data. Choose your research goal. Get the correct
                statistical analysis, proper plot, and thesis-ready interpretation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/upload">
                  Start Analyzing
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/results/sample" variant="secondary">
                  View Sample Result
                </ButtonLink>
              </div>
            </div>
            <HeroPreview />
          </div>
        </section>

        <section
          className="border-y border-outline-variant/70 bg-white px-4 py-16 md:px-8"
          id="features"
        >
          <div className="mx-auto max-w-workspace">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-semibold text-primary">
                Built for students writing research results.
              </h2>
              <p className="mt-3 leading-7 text-on-surface-variant">
                ScholarStat guides the analysis workflow without turning into an Excel
                clone or a full statistics suite.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8" id="workflow">
          <div className="mx-auto max-w-workspace">
            <div className="mb-12 text-center">
              <h2 className="font-display text-4xl font-semibold text-primary">
                From raw data to a Chapter 4 draft.
              </h2>
              <p className="mt-3 text-on-surface-variant">
                A focused path for descriptive statistics and correlation analysis.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-4">
              <WorkflowStep
                description="Start with CSV or Excel and review privacy reminders before analysis."
                step={1}
                title="Upload"
              />
              <WorkflowStep
                description="Choose whether to describe data or find a relationship."
                step={2}
                title="Choose Goal"
              />
              <WorkflowStep
                description="Review the recommended test, chart, values, and warnings."
                step={3}
                title="Review Results"
              />
              <WorkflowStep
                description="Preview a thesis-style page for adviser review."
                step={4}
                title="Export Draft"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary-container px-4 py-10 text-white md:px-8">
        <div className="mx-auto max-w-workspace">
          <div className="flex flex-col gap-6 border-b border-white/15 pb-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6" />
              <span className="font-display text-2xl font-semibold">ScholarStat</span>
            </div>
            <div className="flex gap-4 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <UploadCloud className="h-4 w-4" />
                Phase 0 demo
              </span>
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                Mock export only
              </span>
            </div>
          </div>
          <p className="mt-8 max-w-4xl text-sm leading-6 text-white/70">
            Academic Disclaimer: ScholarStat assists with preliminary analysis planning,
            mock result presentation, and research writing workflows. Statistical results
            and generated interpretations must be reviewed by a research adviser,
            statistician, or qualified academic reviewer before submission.
          </p>
        </div>
      </footer>
    </div>
  );
}
