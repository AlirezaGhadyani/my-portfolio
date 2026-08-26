# Conventions

Naming, file layout, scoped style approach, tabs vs spaces, and when `is:inline` is acceptable.

## File layout

```
src/
├── components/         # Astro components (scoped styles)
├── content/            # Astro content collections (case studies)
├── content.config.ts   # Content collection schema
├── data/               # Canonical resume data (domain layer)
├── domain/             # Presentation adapter (present.ts)
├── layouts/            # Root Layout.astro
├── lib/                # Shared utilities (validation.ts)
├── pages/              # Routes (index, projects, print)
└── styles/             # global.css, print.css, test files

scripts/                # Build scripts (PDF, TXT, sitemap, OG image)
functions/api/          # Cloudflare Pages Functions (contact)
public/                 # Static assets (copied to dist/)
```

## Tabs vs spaces

**Tabs for indentation.** This is the majority convention in the codebase:

- All `.astro` files use tabs
- `src/data/theme.ts` uses tabs
- `global.css` uses tabs

Prettier config: `useTabs: true`, `trailingComma: "all"` (set in T0.2).

## Scoped styles

Every `.astro` component uses a scoped `<style>` block. Styles are automatically scoped by Astro.
No BEM naming required, but class names should be descriptive and kebab-case.

Global styles live in `src/styles/global.css` only. Do not add `:global()` overrides in components
unless absolutely necessary (and document why).

## Naming conventions

- **Files:** kebab-case (`SectionHeader.astro`, `present.ts`, `generate-pdf.ts`)
- **Components:** PascalCase in filename and usage (`<SectionHeader />`)
- **CSS classes:** kebab-case (`.section-header`, `.resume-sheet`)
- **TypeScript:** camelCase for functions/variables, PascalCase for types/interfaces
- **Zod schemas:** PascalCase with `Schema` suffix (`ResumeDataSchema`, `ExperienceItemSchema`)

## `is:inline` scripts

Use `is:inline` only when the script must:

1. Run before any paint (theme bootstrap in `Layout.astro`)
2. Bind to dynamically rendered markup without a framework component

`is:inline` scripts are:

- Not type-checked by TypeScript
- Not linted by ESLint
- Not minified by the bundler
- Duplicated once per component instance (ADR-0003)

For logic that can wait for DOMContentLoaded, use a module `<script>` instead.

## Import conventions

- Data layer: `import { resumeData } from "../data/resume.ts"` (with `.ts` extension)
- Present adapter: `import { dateRange } from "../domain/present.ts"`
- Schema types: `import type { ExperienceItem } from "../data/schema.ts"`
- Astro content: `import { getCollection } from "astro:content"`

Always use `.ts` extensions in imports (Astro/ESM requirement).

## Zod usage

- `src/data/**` uses `zod` v4 (`import { z } from "zod"`)
- `src/content.config.ts` uses `astro/zod` (Astro's re-export) — this is a known inconsistency
- Parse at module load: `export const resumeData = ResumeDataSchema.parse({...})`
- Use `.safeParse()` in request handlers (contact endpoint)

## Test conventions

- Unit tests: Vitest, colocated with source (`schema.test.ts`, `present.test.ts`)
- E2E tests: Playwright (`tests/`)
- Style tests: `contrast.test.ts`, `tokens.test.ts` in `src/styles/`
- Test files use `.test.ts` suffix

## Commit conventions

- Task IDs in commit messages: `fix(ci): install pnpm and target main branch (T0.1)`
- One task = one commit
- Formatting-only commits are isolated (no logic changes)
