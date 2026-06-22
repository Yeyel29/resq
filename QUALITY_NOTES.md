# ScholarStat Quality Notes

## Linting

No lint script was added because the current project does not have a confirmed ESLint setup. The project currently has TypeScript, Next.js, Tailwind, and build tooling, but no ESLint dependency or configuration in `package.json`.

Build verification remains the required quality check for now:

```txt
npm run build
```

## Current Guardrail

Real analysis computation, chart generation, PDF export, backend logic, database storage, authentication, and payment are intentionally not implemented yet.
