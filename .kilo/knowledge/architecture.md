# Architecture

The real dependency graph and structural invariants for this portfolio.

## Dependency graph

```
src/data/schema.ts          ← Zod schemas, inferred types (the domain model)
src/data/resume.ts          ← canonical resume facts, parsed at load
src/data/experience.ts      ← experience entries
src/data/projects.ts        ← project entries
src/data/skills.ts          ← skill categories
src/data/variants.ts        ← variant configs + applyVariant()
src/data/theme.ts           ← palette definitions
        ↓
src/domain/present.ts       ← presentation adapter (dates, ordering, display)
        ↓
┌───────────────────────────────────────────────────────────┐
│  Web renderer              │  Print renderer              │  Text renderer  │
│  src/components/*.astro    │  src/pages/print/resume/     │  scripts/       │
│  src/pages/index.astro     │  [...variant].astro          │  generate-txt.ts│
│  src/pages/projects/       │  src/styles/print.css        │                 │
│  src/layouts/Layout.astro  │  scripts/generate-pdf.ts     │                 │
└───────────────────────────────────────────────────────────┘
        ↓                        ↓                            ↓
   dist/index.html           dist/downloads/*.pdf        dist/downloads/*.txt
   dist/projects/*.html      (via Playwright)
```

## The three renderers

One resume fact is rendered by three independent code paths. This is the defining architectural
decision (ADR-0001). Share the data adapter (`present.ts`), not markup.

| Renderer | Files | Sorts experience? | Formats dates? |
| --- | --- | --- | --- |
| Web | `src/components/*.astro` + `src/pages/index.astro` | yes (via `present.ts`) | via `present.ts` |
| Print | `src/pages/print/resume/[...variant].astro` | yes (via `present.ts`) | via `present.ts` |
| Text | `scripts/generate-txt.ts` | yes (via `present.ts`) | via `present.ts` |

## Layer rules

1. **`src/data/**`** — domain layer. Imports nothing outside itself. No Astro, no presentation.
2. **`src/domain/present.ts`** — presentation adapter. Pure functions, no I/O, no Astro.
3. **`src/components/**`** + **`src/pages/**`** — web renderer. Reads from data + present.
4. **`src/pages/print/**`** — print renderer. Fixed palette, no theme tokens.
5. **`scripts/generate-*.ts`** — build scripts. Run after `astro build`.
6. **`functions/api/**`** — runtime edge code. Independent of the static build.

## Build order

```
astro build                     → dist/ (HTML, CSS, assets, copies public/)
tsx scripts/generate-sitemap.ts → dist/sitemap.xml, dist/robots.txt
tsx scripts/generate-txt.ts     → dist/downloads/resume-ats.txt
tsx scripts/generate-pdf.ts     → dist/downloads/resume-{variant}.pdf (×4)
tsx scripts/generate-og-image.ts→ dist/og-image.png
```

This order cannot be reordered: PDF generation needs `dist/` to exist (serves it via static server).
Sitemap generation reads `resumeData` for the site URL. OG image generation needs the built site.

## Content collections

`src/content/case-studies/` uses Astro's content collection API (`content.config.ts`).
Frontmatter schema: `title`, `projectSlug`, `duration`, `summary` only.
Canonical project data (tech, role, impact) lives in `src/data/projects.ts` — never duplicate in frontmatter.

## What does NOT exist

- No `wrangler.toml` (Cloudflare Pages auto-detects)
- No `.env.example` (created in T0.4)
- No CMS or JSON data source (ADR-0005)
- No islands framework components (ADR-0003)
- No Tailwind utility classes in src/ (ADR-0002)
