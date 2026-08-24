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

## Phase 4 — Core Presentation Components (Next)

Tasks tracked here when Phase 3 lands.