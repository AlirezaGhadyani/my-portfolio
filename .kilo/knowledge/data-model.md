# Data Model

Canonical chain, variant semantics, and the presentation adapter.

## Canonical data chain

```
src/data/schema.ts      ← Zod schemas define the types (inferred, not hand-written)
src/data/experience.ts  ← ExperienceItem[] parsed at load
src/data/projects.ts    ← Project[] parsed at load
src/data/skills.ts      ← SkillCategory[] parsed at load
src/data/resume.ts      ← ResumeDataSchema.parse({...}) — single source of truth
src/data/variants.ts    ← VariantConfig + applyVariant()
src/data/theme.ts       ← PaletteDefinition + ThemeConfig
```

**Rule:** `src/data/**` imports nothing outside itself. No Astro, no presentation, no `astro:content`.

## Key types (from `schema.ts`)

- `ResumeData` — the full resume: identity, summary, skills, experience, projects, education, certifications
- `ExperienceItem` — company, role, dates, highlights, technologies, tier (`primary`|`secondary`)
- `Project` — slug, title, technologies, tier (`flagship`|`notable`|`experiment`), `hasCaseStudy`
- `SkillCategory` — name + skills array
- `EducationItem` — institution, degree, field, dates, honors
- `Certification` — name, issuer, date, url

## Variant system (`variants.ts`)

Four variants: `fullstack`, `frontend`, `brief`, `ats`.

Each `VariantConfig` has:

- `id` — the variant key
- `label` — human label for the variant itself (UI only, never printed as job title)
- `shortLabel` — compact switcher text (e.g. "ATS", "1-Page")
- `jobTitle` — the professional title printed on the document
- `pdfPages` — target page count (1 or 2)
- `summaryOverride` — `"short"` or `"full"`
- `featuredSkillsFirst` — skills to promote to the top
- `maxProjects` — how many projects to include
- `excludedSections` — sections to omit (e.g. `["certifications"]`)

`applyVariant(data, variantId)` returns a `VariantResume` with:

- `variant` — the variant key
- `documentTitle` — set to `variant.jobTitle` (never `label`)
- `activeSummary` — selected from `summary.short` or `summary.full`

**Rule:** `applyVariant` must never mutate the source data. It filters, reorders, and selects.

## The `label` vs `jobTitle` split

`label` is UI-only (toolbar badge, switcher). `jobTitle` is what prints on the document.
These were split in T1.4 because `label` values like "Standard ATS Format" and "One-Page Executive
Summary" were being printed as professional titles.

## Project ordering

`present.ts:orderedProjects()` sorts by tier rank (`flagship` > `notable` > `experiment`), then title.
`applyVariant` uses this ordering before slicing to `maxProjects`. Never truncate by raw array position.

## Experience ordering

`present.ts:orderedExperience()` sorts primary tier first, then by `startDate` descending.
All three renderers use this function. Never sort independently.

## Date handling

All dates are `YYYY-MM` strings (e.g. `"2024-01"`). No format validation in the schema.
`present.ts:monthYear()` validates with `/^(\d{4})-(0[1-9]|1[0-2])$/` and throws on malformed input.
`present.ts:dateRange()` formats as `"Jan 2024 – Present"` using en dash (U+2013).

**Rule:** Never format dates inline in templates. Always go through `present.ts`.

## Certifications and education

`certifications` is optional on `ResumeData`. Always null-check before iterating.
Education dates use the same `dateRange()` as experience. Certification dates use `monthYear()`.
