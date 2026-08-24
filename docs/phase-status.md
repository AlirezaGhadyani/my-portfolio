# Phase Status — Portfolio & Resume System

> Progress tracker for the approved architecture plan
> (`../.kilo/plans/1787564533702-portfolio-resume-system.md`).

## Legend

- `[x]` done
- `[ ]` pending
- `[~]` in progress

---

## Phase 1 — Project Scaffolding, Tooling & Design Tokens

**Objective:** Isolated workspace with strict TS, Astro, Tailwind v4, Vitest, ESLint/Prettier.

### Tasks

- [x] Initialize Astro project in standalone folder (`/home/alireza/projects/portfolio`)
- [x] Configure Tailwind CSS v4 (`@tailwindcss/vite` `^4.3.3`)
- [x] Setup ESLint (`eslint.config.js`) and Prettier (`.prettierrc.cjs`)
- [x] Strict TypeScript via `astro/tsconfigs/strict`
- [x] Setup Vitest (`vitest.config.ts`, `pnpm test`)

### Acceptance

- [x] `pnpm build` executes cleanly
- [x] `pnpm check` executes cleanly
- [x] `pnpm test` executes cleanly

### Notes / Deviations

- Scaffolded with **Astro 7.2.4** (latest stable) and **Zod 4.4.3**, superseding the plan's
  Astro 5.x / Zod 3.x versions. Plan rationale (SSG, zero-JS baseline, islands) is unchanged.
- Project lives in a **standalone folder** (`/home/alireza/projects/portfolio`) per user decision,
  not inside the `telewebion` turborepo workspace.
- Tailwind v4.3.3 confirmed.

---

## Phase 2 — Canonical Resume Schema & Zod Data Layer

**Objective:** Single source-of-truth data model with strong runtime validation.

### Tasks

- [x] Create `src/data/schema.ts` with all Zod schemas (identity, summary, skills, experience, projects, education, certifications)
- [x] Create modular data files: `skills.ts`, `experience.ts`, `projects.ts`
- [x] Create `src/data/resume.ts` canonical assembler + realistic sample data
- [x] Create `src/data/variants.ts` transformation helpers (`applyVariant`, `VARIANTS`)
- [x] Vitest suites in `schema.test.ts` and `variants.test.ts`

### Acceptance

- [x] `pnpm test` executes cleanly (19 tests passing)
- [x] `pnpm check` executes cleanly (0 errors, 0 project warnings)
- [x] 100% coverage on schema validation, data loader, and variant transformations

### Notes / Deviations

- Used Zod 4 top-level validators (`z.email()`, `z.url()`) instead of the deprecated
  chained `z.string().email()` / `z.string().url()` to clear `ts(6385)` deprecation warnings.
- `applyVariant(data, variantId)` returns a full `ResumeData` clone stamped with the variant
  targeting per-plan document semantics: skills reordered by `featuredSkillsFirst`, projects
  truncated to `maxProjects`, summary short/full override, and excluded sections removed.
- Sample persona (`Jordan Avery`) is placeholder content; swap in `resume.ts`/modular files before launch.

---

## Phase 3 — Design System, Shared Layout Shell & Theme Toggle

**Objective:** Layout, design navigation, footer, theme switcher, and typography tokens.

### Tasks

- [x] Design tokens in `src/styles/global.css` (semantic color/white spacing/radius `@theme` + `[data-theme]` cascade)
- [x] Zero-FOUC theme init script in `<head>` (`localStorage` + `prefers-color-scheme`)
- [x] `prefers-reduced-motion` reduced-motion killswitch (`data-motion="reduced"`)
- [x] Root layout (`src/layouts/Layout.astro`) with meta, skip-link, ARIA landmarks
- [x] Responsive header (`SiteHeader.astro`) with desktop + mobile nav, Escape close
- [x] Theme toggle button (`ThemeToggle.astro`, ARIA toggle)
- [x] Footer (`SiteFooter.astro`) consuming `identity.links`
- [x] Semantic home shell (`index.astro`) hero consuming `resumeData`

### Acceptance

- [x] `pnpm build` executes cleanly (1 page, 288ms)
- [x] `pnpm check` executes cleanly (0 errors, 0 project warnings)
- [x] `pnpm test` executes cleanly (19 tests passing)
- [x] Zero theme flicker — init script runs in `<head>` before body paint
- [x] Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) with ARIA labels

### Notes / Deviations

- Kept name `src/layouts/Layout.astro` for the root layout (plan's `RootLayout`) to preserve
  the existing page import.
- `pnpm lint` only flags Astro-generated `.astro/types.d.ts` (needs a `.astro`/`dist` ignore in
  `eslint.config.js`) — pre-existing Phase 1 residual, not Phase 3 source. Flagged, not fixed here.
- Fonts reference Geist Sans/Mono; WOFF2 subsetting + preload deferred until fonts are vendored.

---

## Phase 4 — Core Presentation Components

**Objective:** Build the interactive resume and portfolio home experience.

### Tasks

- [x] Hero section with title, value proposition, and quick links (existing Phase 3 hero retained)
- [x] Experience timeline component (`ExperienceSection.astro`) rendering role, company, location, dates, summary, highlights; ordered by tier (primary first), then recency
- [x] Interactive Skill Grid (`SkillSection.astro`) grouped by `SkillCategory`; highlights `highlighted:true`, renders `level` where present
- [x] Education & Certifications section (`EducationSection.astro`) consuming `resumeData.education` + `resumeData.certifications`
- [x] Wire Experience / Skills / Education sections into `src/pages/index.astro` with semantic `<section>` landmarks and ids (`#experience`, `#skills`, `#education`) matching header nav anchors that exist now

### Acceptance

- [x] `pnpm build` executes cleanly (1 page, 294ms)
- [x] `pnpm check` executes cleanly (0 errors, 0 project warnings)
- [x] `pnpm test` executes cleanly (19 tests passing)
- [x] Home page renders Experience, Skills, and Education/Certifications sections driven by `resumeData`

### Notes / Deviations

- Scope limited to Experience, Skills, and Education/Certifications. `#projects` and `#contact` header anchors remain unwired (Phase 5/7), out of scope here.
- Kept `#education` as the section id (not in header nav) for future cross-linking; `#experience` and `#skills`
  match existing nav anchors exactly.
- Components use plain `<style>` blocks (no Tailwind `@layer`/`@theme`) and consume the design tokens
  (`--bg`, `--surface`, `--border`, `--text`, `--accent`, `--font-sans`/`--font-mono`) per Phase 3 convention.
- Data consumed directly via `../data/resume.ts` from `index.astro` — single source of truth preserved;
  `src/data/` untouched, no schema changes, no projects archive / case studies (Phase 5).

---

## Phase 5 — Projects & Case Studies

**Objective:** Showcase technical engineering depth with flagship cards and searchable case studies.

### Tasks

- [x] `ProjectCard.astro` — reusable card (title links to case study/live/code, role, description, impact metrics, tech badges, tier)
- [x] `ProjectsSection.astro` — home `#projects` Featured subset (featured projects, ≤6, tier-ordered), wired into `index.astro` + `View all` link
- [x] `/projects` archive page (`src/pages/projects/index.astro`) — full list with instant client-side technology tag filtering (~1kb vanilla TS, keyboard-accessible chips)
- [x] Case studies via Astro 7 content collection (`src/content.config.ts`, glob loader) rendered as MDX
- [x] `/projects/[slug]` case-study detail page (`getStaticPaths` + `render()`) with semantic header, metrics, and prose
- [x] `src/content/case-studies/async-threat-platform.md` — flagship case study matching an existing `hasCaseStudy` project

### Acceptance

- [x] `pnpm build` executes cleanly (3 pages: `/`, `/projects`, `/projects/async-threat-platform`)
- [x] `pnpm check` executes cleanly (0 errors, 0 project warnings)
- [x] `pnpm test` executes cleanly (19 tests passing)
- [x] Project links keyboard-navigable; case study pages render with fast LCP (0-runtime-JS shell)

### Notes / Deviations

- Astro 7 content collections: used `glob` loader from `astro/loaders` with a custom `generateId`
  (basename slug, since the default id includes the full `src/content/...` path).
- `type: 'content'` is legacy in Astro 7 and was omitted; the presence of a `loader` infers a content collection.
- Dynamic route requires `getStaticPaths()`; schema uses `import { z } from 'astro/zod'` per Astro 7 docs.
- Inline filter script uses `querySelectorAll<HTMLElement>` (no `as` assertions) to clear Astro's inline-script typecheck.
- Only one case study exists (nominal). Add additional `src/content/case-studies/*.md` files; each
  must match an existing project `slug` via `projectSlug` frontmatter.

---

## Phase 6 — Print & PDF Export Engine

**Objective:** Build the automated document generation pipeline with Playwright vector PDFs and plain-text ATS export.

### Tasks

- [x] Dedicated print layout and print stylesheet (`src/styles/print.css`, `@page` A4 rules, clean page break controls)
- [x] Static print routes supporting all variants (`src/pages/print/resume/[...variant].astro` for `/print/resume`, `/print/resume/fullstack`, `/print/resume/frontend`, `/print/resume/brief`, `/print/resume/ats`)
- [x] Screen toolbar for switching between variant previews and triggering browser print / downloads
- [x] Plain-text ATS generator (`scripts/generate-txt.ts` -> `public/downloads/resume-ats.txt`)
- [x] Automated Playwright vector PDF generator (`scripts/generate-pdf.ts` -> `public/downloads/resume-*.pdf`)
- [x] NPM build scripts in `package.json` (`build:txt`, `build:pdf`, `build:all`)
- [x] Resume download and view links wired into main site navigation and hero CTA

### Acceptance

- [x] `pnpm build` generates all static print routes (8 total pages)
- [x] `pnpm build:all` executes cleanly, producing vector PDFs and formatted ATS text
- [x] `pnpm check` executes cleanly (0 errors, 0 project warnings)
- [x] `pnpm test` executes cleanly (19 tests passing)
- [x] Generated PDFs and TXT files are selectable text and accurately reflect variant parameters

### Notes / Deviations

- Added fallback in `scripts/generate-pdf.ts` to locate local system Chrome/Chromium binaries (`/usr/bin/google-chrome`, `/usr/bin/chromium`) when Playwright precompiled download is restricted.
- Static print route uses rest parameter `src/pages/print/resume/[...variant].astro` to cleanly prerender `/print/resume` as default fullstack, alongside `/print/resume/fullstack`, `/print/resume/frontend`, `/print/resume/brief`, and `/print/resume/ats`.

---

## Phase 7 — Cloudflare Edge Contact Form API

**Objective:** Serverless contact form handling with spam protection, rate-limiting, and accessible UI.

### Tasks

- [x] Create `functions/api/contact.ts` Cloudflare Pages Function endpoint with POST handler
- [x] Schema validation for payload (`name`, `email`, `message`, `honeypot`, `turnstileToken`)
- [x] Rate limiting implementation supporting in-memory and Cloudflare KV storage (3 reqs / 10 mins)
- [x] Cloudflare Turnstile token verification with remote IP support
- [x] Resend API transactional email dispatch integration
- [x] Honeypot silent success handling for bot spam
- [x] Accessible `ContactSection.astro` component with client validation, live error messages, character counter, status banner/toast, and Turnstile widget support
- [x] Mounted `ContactSection` to `src/pages/index.astro` under `#contact` landmark
- [x] Vitest suite `functions/api/contact.test.ts` covering schemas, HTTP methods, rate limits, Turnstile, and Resend API forwarding

### Acceptance

- [x] `pnpm build` executes cleanly (8 pages built)
- [x] `pnpm check` executes cleanly (0 errors, 0 warnings)
- [x] `pnpm test` executes cleanly (32 tests passing across 3 test files)
- [x] Valid submissions send email via Resend; invalid/bot submissions are handled properly with HTTP 400/429

---

## Phase 8 — Production Verification & Hardening

**Objective:** Final quality gates before release.

### Tasks

- [x] JSON-LD `Person` + `ProfilePage` structured data (`src/pages/index.astro`, rendered via `@graph`, using `resumeData.identity`)
- [x] Dynamic Open Graph / Twitter preview meta tags + canonical URL in `src/layouts/Layout.astro` (per-page `og:title`/`og:description`/`og:url`, shared `og:image`)
- [x] Shared social card `/og-image.svg` (1200x630) in `public/`
- [x] `scripts/generate-sitemap.ts` -> `public/sitemap.xml` + `public/robots.txt`, wired into `pnpm build:all` (and `build:sitemap`)
- [x] `public/_headers` Cloudflare security + caching directives (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, cache control)
- [x] GitHub Actions CI workflow (`.github/workflows/ci.yml`) — check, test, lint, `build:all`, artifact verification
- [x] ESLint ignores for generated `.astro/`, `.kilo/`, `dist/`, `.prettierrc.*` so `pnpm lint` passes

### Acceptance

- [x] `pnpm build:all` executes cleanly (8 pages + sitemap/robots/txt/PDFs)
- [x] `pnpm check` executes cleanly (0 errors, 0 project warnings)
- [x] `pnpm test` executes cleanly (32 tests passing)
- [x] `pnpm lint` executes cleanly (0 errors)
- [x] dist/ ships `_headers`, `sitemap.xml`, `robots.txt`, `og-image.svg`, and downloadable resumes

### Notes / Deviations

- **CI / build hardening:** `pnpm build:all` now runs the sitemap generator before the PDF/txt generators. `pnpm lint` was
  previously failing on Astro-generated `.astro/*` types and unrelated `.kilo/*` worktree sessions; an `ignores` entry in
  `eslint.config.js` now excludes generated/config dirs. A real source fix (`scripts/generate-pdf.ts` regex escape) was
  applied so the source tree lints clean.
- **Hosting:** Officially targets Cloudflare Pages. `public/_headers` contains the security + caching directives; PDFs are
  served with `Content-Disposition: attachment`. The `deploy` job is a placeholder that documents pushing `dist/` to
  Cloudflare Pages (Git integration or API token) — no service-specific secrets are committed.
- **Domain is placeholder:** Sitemap/OG/canonical URLs currently resolve to `https://example.com` (from
  `resumeData.identity.website`). Swap the real domain as the last push before go-live.
- **OG image is SVG:** `og-image.svg` is vendor-agnostic (fine for Lighthouse/SEO), but some crawlers prefer PNG. Convert
  `public/og-image.svg` to a raster `og-image.png` before production if image preview support in all apps is required.

---

## Implementation complete — all 8 phases done.
