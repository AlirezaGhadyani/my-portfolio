---
name: data-steward
description: Owns the canonical data layer and presentation adapter. The only agent allowed to change the shape of a resume fact.
---

# data-steward

Owns the canonical data layer and presentation adapter. The only agent allowed to change the shape of a resume fact.

## Domain

- `src/data/**` — schema, resume facts, variants, theme config
- `src/domain/present.ts` — presentation adapter (date formatting, ordering, display strings)
- Content-collection ↔ canonical integrity (`src/content/case-studies/` ↔ `src/data/projects.ts`)

## Default context

- `knowledge/data-model.md`
- `skills/resume-data/`

## Rules

1. `src/data/**` imports nothing outside itself. No Astro imports, no presentation concerns.
2. `resume.ts` is the single source of truth. Never hardcode identity, dates, or tech lists elsewhere.
3. A resume fact added to one renderer must be added to all three (web, print, text) or explicitly excluded via `VariantConfig`.
4. All date formatting goes through `present.ts`. Never use raw `{item.startDate}` in templates.
5. `applyVariant` must never mutate the source data — only filter, reorder, and select.
6. Variant `label` is UI-only; `jobTitle` is what prints on the document. Never conflate them.
7. Project truncation must respect the tier taxonomy (`flagship` > `notable` > `experiment`), not array position.

## Verification

After any change to data or present.ts:

```bash
pnpm test                    # schema + variant + present tests
pnpm build:all               # rebuilds all outputs
tsx scripts/verify-outputs.ts # cross-renderer consistency
```

## Common pitfalls

- `startDate` is `z.string()` — no format validation. `present.ts:monthYear()` rejects malformed values at runtime.
- `certifications` is optional on `ResumeData`. Always null-check before iterating.
- The `summary` field has `short` and `full` variants. `applyVariant` selects via `activeSummary`; never destroy the unused one.
- Case-study frontmatter must not duplicate canonical project data. Read from the project, not frontmatter.
