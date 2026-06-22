# ScholarStat Project Audit

## 1. Audit Summary

Status: Ready with minor fixes

ScholarStat is still aligned with the original MVP direction: a guided thesis-focused research statistics assistant for student researchers and thesis writers. The current app supports the planned flow through Phase 6: landing page, upload, preview, profile, research goal selection, variable selection, and a Phase 7 recommendation placeholder.

The project is ready to begin Phase 7, provided Phase 7 stays focused on statistical test recommendation only. There are no major blockers in the current frontend flow. Minor issues remain around generated build artifacts, lack of a lint script, browser-only persistence, basic type detection, and placeholder mock results/export pages.

Build status checked:

- `npm run build` initially failed because a stale generated `.next/dev/types/validator.ts` file was corrupted.
- After deleting the generated `.next` cache, `npm run build` passed successfully.
- No `npm run lint` check was run because `package.json` does not define a `lint` script.

## 2. Current Product Direction

The current implementation still matches the intended product direction:

> A thesis-focused research statistics assistant for student researchers and thesis writers.

The app currently emphasizes guided workflow, research goals, dataset inspection, privacy reminders, data quality warnings, adviser/statistician review reminders, and thesis-ready framing.

The app has not drifted into:

- A full Excel clone
- A generic SaaS dashboard
- A business analytics tool
- A full SPSS/JASP/jamovi replacement
- An AI thesis writer

The results and export pages are still mock placeholders, so the product has not yet crossed into unsupported claims about actual statistical output.

## 3. Phase Completion Status

| Phase | Goal | Status | Notes |
|---|---|---|---|
| Phase 0 | Project foundation | Complete | Next.js App Router structure, TypeScript types, Tailwind theme, app shell, reusable UI components, mock routes, and placeholder pages are present. |
| Phase 1 | Landing page | Partial | The landing page communicates ScholarStat's thesis analysis positioning and uses the academic visual system. It is still simpler than the full requested Phase 1 copy plan and footer text still references "Phase 0 demo". |
| Phase 2 | Dataset upload | Complete | CSV/XLSX upload, validation, parsing, sample dataset flow, sessionStorage persistence, privacy reminder, and row truncation are implemented client-side. |
| Phase 3 | Dataset preview | Complete | Preview page reads uploaded/sample datasets, shows metadata, missing value count, source badges, pagination, empty/corrupt states, and contained horizontal table scrolling. |
| Phase 4 | Data profiling | Complete | Basic column type detection, missing/unique counts, sample values, warnings, editable type overrides, and profile persistence are implemented. Detection is intentionally MVP-level. |
| Phase 5 | Analysis wizard | Complete | Research goal cards use beginner-friendly language. `Describe my data` and `Find a relationship between variables` are available. `Compare groups` and `Predict an outcome` are marked coming soon. |
| Phase 6 | Variable selection | Complete | Variable selection exists for descriptive and relationship goals, uses effective column types, validates choices, saves selected variables, and shows the Phase 7 recommendation placeholder. |

## 4. Implemented Routes

| Route | Purpose | Status | Data Source | Notes |
|---|---|---|---|---|
| `/` | Landing page and product positioning | Implemented | Static content and mock preview | Communicates thesis-focused analysis assistant positioning. Still contains "Phase 0 demo" footer text. |
| `/upload` | Dataset upload entry point | Implemented | Client-selected CSV/XLSX or sample dataset | Real client-side parsing, validation, sample flow, and sessionStorage save are implemented. |
| `/datasets/[id]/preview` | Dataset preview | Implemented | sessionStorage or sample fallback | Supports `/datasets/uploaded/preview` and `/datasets/sample/preview`. Shows empty/corrupt states. |
| `/datasets/[id]/profile` | Data profiling | Implemented | sessionStorage or sample fallback | Generates column profiles and persists user type overrides. |
| `/analysis` | Research goal selection | Implemented | sessionStorage dataset and analysis draft | Shows dataset context, goal cards, and creates `scholarstat.analysisDraft`. |
| `/analysis?step=variables` | Variable selection step | Implemented | sessionStorage dataset, column profiles, and draft | Supports descriptive and relationship variable selection. |
| `/analysis?step=recommendation` | Phase 7 placeholder | Implemented as placeholder | sessionStorage analysis draft | Summarizes selected goal and variables. Does not recommend a statistical test yet. |
| `/results/[id]` | Mock results page | Implemented as placeholder | Mock sample result | Still static/mock. No real statistical computation. |
| `/export/[id]` | Mock thesis-style export preview | Implemented as placeholder | Mock sample export content | No real PDF generation. |

## 5. Current User Flow

Current expected flow:

```txt
Landing page
-> Upload dataset
-> Preview dataset
-> Data profile
-> Choose research goal
-> Select variables
-> Recommendation placeholder
```

Flow status:

- Uploaded dataset flow: implemented through upload, preview, profile, goal selection, variable selection, and recommendation placeholder.
- Sample dataset flow: implemented through upload sample action and direct sample preview/profile routes.
- Direct route access: handled with missing/corrupt/no-goal/no-variable empty states.
- Empty `sessionStorage`: handled on preview, profile, and analysis pages with friendly empty states.

The current flow intentionally stops before Phase 7 statistical test recommendation.

## 6. Data Flow and Storage

Current storage is browser-only via `sessionStorage`.

### `scholarstat.currentDataset`

Stores the current uploaded or sample dataset.

Structure is typed by `UploadedDataset`:

- `id`
- `name`
- `fileType`
- `rowCount`
- `columnCount`
- `columns`
- `rows`
- `uploadedAt`
- optional `truncated`
- optional `originalRowCount`
- optional `columnProfiles`

Created by:

- Upload parsing in `DatasetUploadCard`
- Sample dataset creation in upload/preview/profile/analysis flows

Read by:

- Dataset preview
- Data profile
- Analysis wizard
- Variable selection

Risks:

- Data is temporary and browser/session-specific.
- Clearing the browser session loses the dataset.
- Large datasets are truncated to 5,000 stored rows.
- There is no backend validation or permanent storage yet.

### `scholarstat.analysisDraft`

Stores the analysis workflow state.

Structure is typed by `AnalysisDraft`:

- `datasetId`
- `datasetName`
- `goalId`
- `goalTitle`
- `status`
- optional `selectedVariables`
- `createdAt`
- `updatedAt`

Created by:

- Research goal selection on `/analysis`

Updated by:

- Variable selection on `/analysis?step=variables`

Read by:

- Analysis wizard
- Variable selection
- Recommendation placeholder

Risks:

- Draft can become stale if the dataset changes but the browser storage is not cleared.
- Validation checks basic shape only; selected variable object validation is lightweight.

## 7. Dataset Upload Status

Implemented:

- CSV upload
- XLSX upload
- File extension validation for `.csv` and `.xlsx`
- File size validation at 10 MB
- Empty file handling
- Empty sheet handling
- Empty row handling
- Friendly parse errors
- Sample dataset flow
- Client-side parsing with `xlsx`
- First-sheet-only Excel parsing
- Row truncation at 5,000 rows
- `originalRowCount` when truncation occurs
- Privacy reminder before upload
- Browser-only temporary processing notice

The parser normalizes headers and removes meaningless empty trailing columns. A blank-header column is only dropped when all values in that column are missing. Blank-header columns with actual data are preserved with fallback names like `Column 2`.

Uploaded files are processed temporarily in the browser and are not permanently saved by the current implementation.

Known limits:

- No backend upload or server-side validation.
- No permanent storage.
- No multi-sheet Excel selection.
- No advanced messy-header detection beyond the current normalization.

## 8. Dataset Preview Status

Implemented:

- Dataset name display
- Row count
- Column count
- Basic missing value count
- Source badge for uploaded/sample/fallback modes
- Table preview
- Row pagination with 10, 25, and 50 rows per page
- Empty/null cell display as an em dash
- Basic preview type hints
- Truncated dataset warning
- Privacy reminder
- Empty dataset state
- Corrupted dataset state
- Long filename handling with wrapping
- Horizontal scroll containment inside the table card

The previous fake trailing-column issue is addressed in parsing. The previous table overflow issue is addressed with `min-w-0`, `overflow-hidden`, and an internal `overflow-x-auto` table wrapper.

Known limits:

- Preview type hints are intentionally basic and not the full profiling system.
- Very wide real datasets still require horizontal table scrolling, but this should be contained inside the card.
- Manual mobile testing is still recommended for very wide files.

## 9. Data Profiling Status

Implemented:

- Basic column type detection
- Numeric detection
- Categorical detection
- Likert detection
- Date detection
- Text detection
- Unknown fallback
- Missing value count
- Missing percentage
- Unique value count
- Sample values
- Column-level warning badges
- Dataset-level warning panel
- Editable type override dropdown
- Type override persistence in `sessionStorage`
- Effective type support through `userConfirmedType ?? detectedType`

Warnings include:

- Missing values
- High missing percentage
- Mostly empty column
- Mixed numeric and text values
- Possible Likert-scale data
- Too many unique values for categorical data
- Only one unique value
- Date-like values detected

Dataset-level warnings include:

- Review column types before analysis.
- Correlation does not imply causation.
- Privacy reminder.
- Missing values may affect analysis.
- Likert-scale responses may make Spearman more appropriate.

This profiling is basic and MVP-appropriate. It is not a substitute for adviser/statistician review.

Known limits:

- Type inference can misclassify edge cases.
- Missing tokens include common values such as `N/A`, `NA`, `None`, `null`, `No response`, `-`, and em dash, but do not cover every possible student-entered placeholder.
- No outlier detection, normality testing, imputation, or advanced cleaning.

## 10. Analysis Wizard Status

Implemented:

- Beginner-friendly research goal selection
- Dataset context panel
- Workflow stepper
- Empty dataset state
- Corrupted dataset state
- Analysis draft creation
- Coming soon handling for future goals

Available goals:

- Describe my data
- Find a relationship between variables

Coming soon goals:

- Compare groups
- Predict an outcome

The wizard does not force users to choose technical tests. Technical terms appear only as possible outputs or future context, not as the main decision labels.

Known limits:

- The old `analysis-next-step-placeholder.tsx` component still exists but is no longer the primary Phase 6 path.
- The wizard relies on `sessionStorage` and does not persist drafts across browsers/devices.

## 11. Variable Selection Status

Implemented for `Describe my data`:

- User selects exactly one variable.
- Variable cards show column name, effective type, missing count, unique count, sample values, warnings, and support guidance.
- Continue button is disabled until a variable is selected.
- Selected variable is saved with role `primary`.

Implemented for `Find a relationship between variables`:

- User selects `Variable X`.
- User selects `Variable Y`.
- Variable X and Variable Y cannot be the same column.
- Text + text is blocked.
- Numeric + numeric, Likert + Likert, and numeric + Likert are allowed.
- Categorical combinations and limited-support types are allowed with warnings where appropriate.
- Selected variables are saved with roles `x` and `y`.

Effective type usage:

```ts
userConfirmedType ?? detectedType
```

The recommendation placeholder summarizes:

- Dataset name
- Research goal
- Selected variable(s)
- Variable role
- Variable type

No real statistical recommendation is implemented yet.

## 12. UI/UX and Design System Status

The UI follows the intended Academic Precision direction:

- Off-white/light blue-gray background
- White cards
- Subtle borders
- Soft shadows
- Deep navy primary actions
- Muted teal accents
- Soft sky-blue helper panels
- Amber warning states
- Inter UI font
- Playfair Display for display/academic headings
- Lucide icons
- Card-based guided workflow
- Beginner-friendly research copy

Implemented UI areas:

- Landing page with academic positioning and hero mockup
- Sticky marketing header
- App shell with topbar and sidebar
- Dataset upload card
- Dataset preview table
- Data profile table
- Research goal cards
- Variable cards/selects
- Recommendation placeholder
- Mock result and export screens

Glow implementation:

- Landing page has a large neutral hero glow.
- Hero preview has a small teal glow/pulse implementation.
- Reduced-motion handling exists for the glow animation.

Known UI/UX issues or polish items:

- Landing footer still references "Phase 0 demo" and "Mock export only"; this is honest but may feel outdated after Phase 6.
- Some copy still describes results/export as mock, which is accurate until real analysis/export phases are implemented.
- Mobile table and profile-table UX should be manually tested with very wide real datasets.
- There is no formal automated accessibility test setup.

## 13. TypeScript and Code Quality Status

Code organization is feature-oriented and mostly modular:

- `src/components/ui`
- `src/components/layout`
- `src/components/upload`
- `src/components/dataset`
- `src/components/analysis`
- `src/components/export`
- `src/components/marketing`
- `src/lib/dataset`
- `src/lib/analysis`
- `src/types`
- `src/constants`

Positive code quality notes:

- Types exist for datasets, profiles, research goals, analysis drafts, selected variables, charts, and exports.
- Dataset parsing, preview helpers, profile helpers, storage helpers, and variable-selection helpers are separated.
- Client-only storage access is guarded by `typeof window !== "undefined"`.
- Pages that read `sessionStorage` use client components.
- User-facing parse errors avoid raw stack traces.
- No real backend/API/statistics/payment/auth code was added.

Build and lint:

- `npm run build`: passed after clearing stale generated `.next` cache.
- Initial `npm run build`: failed due corrupted generated `.next/dev/types/validator.ts`, not source code.
- `npm run lint`: not available because no `lint` script exists in `package.json`.

Known code quality risks:

- `sessionStorage` validation is basic.
- There are no automated tests.
- There is no lint script.
- Some legacy placeholder components remain after newer flows were added.
- Build artifacts can temporarily change `next-env.d.ts` between `.next/dev/types` and `.next/types`; this should not be committed accidentally.

## 14. Known Issues or Risks

- `sessionStorage` can expire or be cleared.
- Uploaded datasets are not persisted.
- Uploaded datasets are capped at 5,000 stored rows.
- Client-side file parsing may struggle with unusual or very messy spreadsheets.
- No backend validation exists yet.
- No real statistical engine exists yet.
- Type detection is basic and can misclassify data.
- Variable selection allows some later-feature combinations with warning instead of blocking them.
- No real statistical test recommendation exists yet.
- Results page is mock/static.
- Export page is mock/static.
- No real PDF generation exists.
- No authentication or saved work exists.
- No database exists.
- No automated test suite exists.
- No lint script exists.
- Direct route access depends on friendly empty states rather than server-backed recovery.

## 15. Missing Pieces Before Phase 7

Already in place for Phase 7:

- Dataset loaded from `scholarstat.currentDataset`
- Column profiles available or generated
- Effective variable types available
- Research goal stored in `scholarstat.analysisDraft`
- Selected variables stored in `scholarstat.analysisDraft`
- Validation before reaching recommendation placeholder
- Route state for `/analysis?step=recommendation`
- Recommendation placeholder summary

Missing or recommended before Phase 7:

- Decide the exact recommendation output shape.
- Add a typed recommendation model.
- Add recommendation rules without running real analysis.
- Add assumption/warning messages for recommendation results.
- Add a clear no-data/no-goal/no-variable recovery path on the recommendation view.
- Add or defer a lint/test setup decision.

No blocking missing pieces were found for starting Phase 7.

## 16. Phase 7 Readiness Assessment

Is the project ready for Phase 7?

Ready with minor fixes.

Reason:

Phase 7 needs selected research goal, selected variable(s), effective column types, dataset context, and analysis draft persistence. These are now implemented. The app can route to `/analysis?step=recommendation` and display a saved summary without performing real statistics.

Minor fixes to consider first:

- Add a lint script or decide to defer linting.
- Remove or archive unused legacy placeholder components.
- Consider improving the `AnalysisDraft` validation for selected variable object shape.
- Update outdated "Phase 0 demo" copy when the owner is ready.

## 17. Recommended Next Steps

### Must fix before Phase 7

- None identified as blocking.

### Should fix before or during Phase 7

- Define a `TestRecommendation` type and storage/update strategy.
- Keep Phase 7 limited to recommendation logic only, not statistical computation.
- Add recommendation rules for:
  - Descriptive numeric
  - Descriptive categorical
  - Descriptive Likert
  - Numeric + numeric relationship
  - Likert + Likert relationship
  - Numeric + Likert relationship
  - Later-feature warnings for unsupported combinations
- Make recommendation copy cautious and adviser-review oriented.
- Preserve "correlation does not imply causation" warnings.
- Avoid routing directly to mock results until recommendation and real analysis phases are ready.

### Can fix later

- Add automated tests.
- Add lint script and formatting policy.
- Improve mobile table UX for very wide datasets.
- Add stronger runtime validation for sessionStorage data.
- Improve messy spreadsheet/header detection.
- Add backend parsing/analysis later.
- Replace mock results/export pages once real analysis is implemented.

### Phase 7 implementation should start with

- Create a small recommendation utility in `src/lib/analysis`.
- Add typed recommendation output in `src/types/analysis.ts`.
- Read the existing `AnalysisDraft` and selected variables.
- Use effective variable types from the saved selected variables.
- Render a recommendation card on `/analysis?step=recommendation`.
- Save recommendation status without running real statistical tests.
