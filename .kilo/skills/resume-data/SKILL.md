---
name: resume-data
description: Patterns for working with canonical resume data, schema changes, variant transformations, and the presentation adapter.
---

# Resume Data Skill

## What patterns does this project use

- Canonical data lives in `src/data/*.ts`, parsed at module load via Zod
- `resume.ts` is the single source of truth — never hardcode facts elsewhere
- `variants.ts` defines 4 resume variants with `applyVariant()` for filtering/reordering
- `present.ts` is the sole presentation adapter for dates, ordering, and display strings
- All three renderers (web, print, text) consume `present.ts` — never format inline

## What is forbidden

- Importing from outside `src/data/**` in the data layer (`src/data/schema.ts`)
- Hardcoding identity, dates, or tech lists in components (use `resume.ts`)
- Formatting dates inline in templates (use `present.ts:dateRange()` / `monthYear()`)
- Mutating source data in `applyVariant` — only filter, reorder, select
- Conflating `label` (UI) with `jobTitle` (printed title) in `variants.ts`
- Truncating projects by array position instead of tier ranking

## What to inspect first

1. `src/data/schema.ts` — the Zod schemas define all types
2. `src/data/resume.ts` — the canonical data (parsed at load)
3. `src/data/variants.ts` — variant configs and `applyVariant()`
4. `src/domain/present.ts` — the presentation adapter

## What commonly goes wrong

- `startDate` is `z.string()` with no format validation — `monthYear()` throws on malformed input
- `certifications` is optional — always null-check before iterating
- `summary` has `short` and `full` — `applyVariant` selects via `activeSummary`, never destroys the unused one
- Case-study frontmatter must not duplicate canonical project data
- Project ordering must respect tier taxonomy, not array position

## Validation required

```bash
pnpm test                    # schema, variant, present tests
pnpm build:all               # rebuilds all outputs
tsx scripts/verify-outputs.ts # cross-renderer consistency
```
