# alireza.dev — Portfolio & Résumé System

A static, zero-bundled-JS portfolio built with **Astro 7**. One canonical résumé data model is
rendered by three independent pipelines — web, print, and ATS text — sharing a single presentation
adapter (`src/domain/present.ts`). Contact form is a Cloudflare Pages Function with Turnstile
bot protection and Resend delivery.

See `.kilo/knowledge/` for the deep architecture, design system, document pipeline, and data model.
`AGENTS.md` is the routing table for AI agents.

## The six outputs

`pnpm build:all` produces exactly six deliverables from one data source:

1. The **static site** — 8 HTML routes (home, projects archive, case study, and 4 print previews)
2. `resume-fullstack.pdf`
3. `resume-frontend.pdf`
4. `resume-brief.pdf` — one-page executive summary
5. `resume-ats.pdf` — one-page ATS-optimized résumé
6. `resume-ats.txt` — plain ASCII ATS text

Each PDF is checked against its declared page count (`pdfPages`) and every output is cross-checked
for résumé-fact consistency by `scripts/verify-outputs.ts`. Supporting artifacts (`sitemap.xml`,
`robots.txt`, `og-image.png`) accompany them.

## Commands

All commands run from the repository root.

| Command              | Action                                                                  |
| -------------------- | ----------------------------------------------------------------------- |
| `pnpm install`       | Install dependencies                                                    |
| `pnpm dev`           | Start local dev server (use `astro dev --background` in agent sessions) |
| `pnpm build`         | Build only the static site to `./dist/`                                 |
| `pnpm build:all`     | Full pipeline: site + sitemap + ATS text + 4 PDFs + OG image            |
| `pnpm check`         | Astro type-check (`astro check`)                                        |
| `pnpm test`          | Vitest unit tests                                                       |
| `pnpm test:coverage` | Vitest with coverage report                                             |
| `pnpm test:e2e`      | `build:all` then Playwright + axe accessibility suite                   |
| `pnpm lint`          | ESLint across all files, including `.astro`                             |
| `pnpm format`        | Prettier write                                                          |
| `pnpm format:check`  | Prettier check                                                          |
| `pnpm preview`       | Preview the production build locally                                    |

The canonical verification gate (run in order, stop on first failure):

```bash
pnpm check && pnpm test && pnpm lint && pnpm format:check && pnpm build:all
find dist -name "*.js" | wc -l      # must print 0
tsx scripts/verify-outputs.ts       # cross-renderer consistency
```

## Environment variables

The project has a strict **build-time / runtime split** — see `.env.example` for the full contract.
Copy it to `.env` locally (gitignored); runtime secrets are set in Cloudflare.

| Variable                    | Scope      | Consumer                               |
| --------------------------- | ---------- | -------------------------------------- |
| `PUBLIC_TURNSTILE_SITE_KEY` | build-time | `ContactSection.astro` (widget render) |
| `TURNSTILE_SECRET_KEY`      | runtime    | `functions/api/contact.ts`             |
| `RESEND_API_KEY`            | runtime    | `functions/api/contact.ts`             |
| `CONTACT_TO_EMAIL`          | runtime    | `functions/api/contact.ts`             |
| `CONTACT_FROM_EMAIL`        | runtime    | `functions/api/contact.ts`             |

Both secrets are **required** — the contact endpoint fails closed (503) if either is missing rather
than silently discarding messages or disabling bot protection.

## Structure

```
src/data/        Canonical résumé facts + Zod schema + variant configs (domain layer)
src/domain/      present.ts — the presentation adapter shared by all three renderers
src/components/  Web renderer (.astro components)
src/pages/       Web routes + /print/resume/[...variant] (print renderer)
src/styles/      global.css (tokens) + print.css (fixed-palette A4)
scripts/         generate-{sitemap,txt,pdf,og-image}.ts + verify-outputs.ts
functions/       Cloudflare Pages Function for /api/contact (runtime edge code)
public/          Static assets
.kilo/           Architecture decisions, knowledge base, and AI agent definitions
```

## Documentation

- `.kilo/knowledge/architecture.md` — dependency graph, the three-renderer reality
- `.kilo/knowledge/design-system.md` — token inventory and contrast budget
- `.kilo/knowledge/document-pipeline.md` — build order, PDF page-count and margin contracts
- `.kilo/knowledge/data-model.md` — canonical chain and variant semantics
- `.kilo/knowledge/edge-and-secrets.md` — environment contract and edge rules
- `.kilo/knowledge/verification.md` — the full gate, what each command catches
- `.kilo/knowledge/decisions/` — ADR-0001 … ADR-0005
