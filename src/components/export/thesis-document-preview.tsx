import { thesisExportSections } from "@/constants/sample-data";

export function ThesisDocumentPreview() {
  return (
    <article className="mx-auto max-w-3xl rounded-sm border border-outline-variant bg-white px-8 py-10 shadow-academic md:px-14 md:py-16">
      <h2 className="font-display text-3xl font-semibold leading-tight text-primary">
        Relationship Between Study Hours and Final Grade
      </h2>
      <p className="mt-2 text-sm text-on-surface-variant">Thesis Results Page Preview</p>
      <div className="mt-8 space-y-6">
        {thesisExportSections.map((section) => (
          <section key={section.label}>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
              {section.label}
            </h3>
            <p className="mt-2 whitespace-pre-line leading-7 text-on-surface-variant">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
