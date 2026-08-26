---
name: astro-patterns
description: Patterns for Astro components, pages, layouts, and content collections in this project.
---

# Astro Patterns Skill

## What patterns does this project use

- Astro 7 with static site generation (SSG)
- Scoped `<style>` blocks in every component
- `is:inline` scripts for theme bootstrap and interactive bindings
- Content collections with Zod schema (`content.config.ts`)
- `getStaticPaths()` for dynamic routes (`[...variant].astro`, `[slug].astro`)
- `defineCollection` with `glob` loader for case studies

## What is forbidden

- `Astro.throw` — does not exist in Astro 7
- Islands framework components (ADR-0003) — use `is:inline` or module scripts
- Merging print and web renderers (ADR-0001)
- Global CSS additions without updating the token layer
- Importing from `src/data/**` into content collection schemas

## What to inspect first

1. `src/layouts/Layout.astro` — root layout with theme bootstrap
2. `src/components/SectionHeader.astro` — shared section header (replaced 5 duplicates)
3. `src/pages/index.astro` — homepage
4. `src/pages/print/resume/[...variant].astro` — print page
5. `src/content.config.ts` — content collection schema

## What commonly goes wrong

- `is:inline` scripts are duplicated per component instance — hoist to Layout
- `PaletteSelector` and `ThemeToggle` render twice (desktop + mobile) — scripts already hoisted
- Scoped styles don't leak, but `:global()` overrides can cause specificity fights
- `getStaticPaths` must return all variant paths for the print page
- Content collection uses `astro/zod` (Zod 3) while data layer uses `zod` (Zod 4)

## Component patterns

```astro
---
// Frontmatter: data fetching, imports, logic
import { resumeData } from "../data/resume.ts";
const { experience } = resumeData;
---

<div class="my-component">
  <!-- Template: markup with expressions -->
  {experience.map((item) => <p>{item.company}</p>)}
</div>

<style>
  /* Scoped styles — automatically scoped by Astro */
  .my-component {
    color: var(--text);
  }
</style>
```

## Validation required

```bash
pnpm check          # Astro type-check
pnpm lint           # ESLint (includes .astro)
pnpm build          # 8 routes
```
