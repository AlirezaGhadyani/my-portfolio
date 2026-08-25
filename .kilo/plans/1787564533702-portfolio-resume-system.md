# Full-Stack Portfolio & Resume System — Architecture & Execution Plan

---

## Part I: The Three Review Loops

### Loop 1 — Architecture & Product Challenge

#### 1. Challenges to Initial Assumptions

- **Is Astro actually best, or is it just the popular SSG choice?**
  - _Challenge:_ Astro islands can introduce mental overhead if UI state is complex.
  - _Finding:_ For a portfolio/resume, state is 95% static and 5% micro-interactions (theme toggle, active-nav spy, variant switcher, contact form). Astro renders 0kb client JS by default and supports islands (React or pure TS web components). Next.js would ship ~85kb of framework JS just to render static text. Astro is genuinely superior here for Core Web Vitals and clean SSG.
- **Is a Cloudflare Worker actually needed at runtime?**
  - _Challenge:_ If we pre-generate PDFs at build time, do we even need a serverless backend?
  - _Finding:_ A runtime worker is needed _only_ for the contact form (to prevent leaking email/API keys, rate-limit, and verify Turnstile tokens). If contact can use a static `mailto:` or static form service (Formspree/Resend webhook), runtime hosting drops to 100% static on Cloudflare Pages.
  - _Decision:_ Keep contact form as an Astro API endpoint / Cloudflare Pages Function (file-based in `/functions/api/contact.ts`), requiring zero separate worker repos or extra infrastructure.
- **Is Playwright PDF generation viable in CI without huge build slowdowns?**
  - _Challenge:_ Installing full Chromium in CI adds 1-2 minutes and ~400MB download per build.
  - _Finding:_ Running Playwright on every commit is wasteful.
  - _Decision:_ Split PDF generation into:
    1. Local/manual script `pnpm build:pdf` for authoring.
    2. CI step that runs _only_ on changes to `src/data/**` or manual dispatch, committing/caching the generated PDFs or generating them directly during production release builds.
- **UX & Creativity vs. Professionalism:**
  - _Challenge:_ "Creative" portfolios often fail recruiters because they bury key skills in canvas animations or scroll-jacked timelines.
  - _Decision:_ The primary layout must be a scannable, high-contrast, semantic document. "Creativity" will live in micro-interactions, layout precision, fluid typography, subtle canvas/SVG particle backgrounds (respecting `prefers-reduced-motion`), and live variant filtering.

---

### Loop 2 — Adversarial Review (Breaking the System Across 5 Years)

#### 1. Future Maintenance & Scale

- **What happens with 30+ projects?**
  - _Issue:_ A single page loading 30 rich project cards degrades LCP and overwhelms recruiters.
  - _Mitigation:_ Data model introduces `featured: boolean`, `priority: number`, and `tier: 1 | 2 | 3`. Homepage displays Tier 1 (top 4-6) with interactive filters; a dedicated `/projects` archive lists all with instant client-side tag filtering (using vanilla TS, ~2kb).
- **What happens when resume data changes frequently?**
  - _Issue:_ Editing TypeScript AST files can be syntax-error prone.
  - _Mitigation:_ Strong Zod schemas with instant build-time feedback and clear TS autocomplete. Data is organized into clean domain files (`experience.ts`, `skills.ts`, etc.) with strict typed helpers.
- **What happens when Astro or Tailwind upgrades?**
  - _Mitigation:_ Keep dependencies minimal: `@astrojs/check`, `tailwindcss` (v4 with standard CSS variables), `zod`, `playwright`. Zero heavy component libraries (no MUI, no heavy UI packages). The design system is built with native semantic HTML and Tailwind tokens.

#### 2. Data Integrity & Variant Consistency

- **Can website and PDF become inconsistent?**
  - _Issue:_ If the PDF uses separate styling/layout logic, it will drift from the website content.
  - _Mitigation:_ The PDF engine renders a dedicated Astro route (`/print/resume?variant=...`) directly via Playwright in print emulation mode (`media: 'print'`). Both website and PDF consume the exact same Zod-validated data queries and shared markup components.
- **Can an ATS variant hide vital info?**
  - _Mitigation:_ Zod schema ensures base required fields (company, title, dates, bullets) cannot be omitted by variants. Variants can only filter projects/skills or reorder sections, never mutate verified employment history.

#### 3. Security, Privacy & Compliance

- Contact form endpoint has:
  1. Honeypot field (hidden from screen readers via `aria-hidden="true"` and CSS `display:none`).
  2. Cloudflare Turnstile token validation.
  3. IP rate-limiting via Cloudflare KV/Memory cache (max 3 submissions per IP per 10 minutes).
  4. Strict Zod payload sanitization before emailing via Resend API.
- Zero tracking cookies. No cookie banner required. Optional privacy-respecting self-hosted analytics (e.g. Cloudflare Web Analytics or Plausible-compatible ~1kb snippet).

---

### Loop 3 — Final Architecture Review & Synthesis

#### Summary of Refinements from Loops 1 & 2

1. **Single Monorepo / Package:** No separated worker repos. Cloudflare Pages + Pages Functions (`/functions/api/contact.ts`) handles static hosting and the single dynamic endpoint in one place.
2. **Unified PDF Pipeline:** Playwright prints the live Astro `/print/[variant]` page to PDF. Single styling system (Tailwind Print utilities + `@page` CSS rules).
3. **Multi-tier Project Model:** Prevents portfolio bloat over years of career growth.
4. **Resilient ATS Export:** Provides both clean 1-page/2-page PDF and raw Markdown/plain-text (`/resume.txt`) for ATS parsing.

---

## Part II: Complete Architecture Specification

### 1. Final Technology Stack

| Layer                 | Technology                     | Purpose                                      | Justification                                                                         |
| --------------------- | ------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Framework**         | **Astro 5.x**                  | Static Site Generation & Island Architecture | Zero runtime JS baseline, instant page loads, built-in Content Collections & routing. |
| **Language**          | **TypeScript 5.x** (Strict)    | Type safety across data & UI                 | Catches schema mismatches at compile time; strict type guards.                        |
| **Styling**           | **Tailwind CSS v4**            | Design-token styling                         | CSS variable-first architecture, zero runtime overhead, instant dark/light theming.   |
| **Schema/Validation** | **Zod 3.x**                    | Data modeling & runtime validation           | Validates resume JSON/TS files during build; fails CI immediately on data error.      |
| **Export Engine**     | **Playwright + Chromium**      | Build-time PDF/PNG generation                | Uses real browser engine to render print stylesheets to pixel-perfect vector PDFs.    |
| **Backend/Edge**      | **Cloudflare Pages Functions** | Serverless contact API                       | Zero-config edge handler running in the same repo/deployment.                         |
| **Email Service**     | **Resend API**                 | Transactional contact emails                 | Clean REST API, high deliverability, generous free tier (3,000 emails/mo).            |
| **Spam Protection**   | **Cloudflare Turnstile**       | Bot protection                               | Privacy-preserving, frictionless CAPTCHA alternative.                                 |
| **Testing**           | **Vitest + Playwright**        | Unit, validation, and E2E testing            | Fast schema tests with Vitest; visual & export checks with Playwright.                |

---

### 2. Architecture & Data Flow Diagram

```
                       ┌──────────────────────────────┐
                       │   Canonical Resume Data      │
                       │   (src/data/*.ts + Zod)      │
                       └──────────────┬───────────────┘
                                      │
                         [Zod Validation & Filtering]
                                      │
              ┌───────────────────────┼────────────────────────┐
              │                       │                        │
              ▼                       ▼                        ▼
     ┌─────────────────┐     ┌──────────────────┐    ┌───────────────────┐
     │  Astro SSG Site │     │ Print Routes     │    │ Plain Text Engine │
     │  (HTML/CSS/0kb) │     │ (/print/[var])   │    │ (/resume.txt)     │
     └────────┬────────┘     └────────┬─────────┘    └─────────┬─────────┘
              │                       │                        │
              ▼                       ▼                        ▼
     ┌─────────────────┐     ┌──────────────────┐    ┌───────────────────┐
     │ Cloudflare Pages│     │ Playwright Build │    │ Downloadable      │
     │ Static Edge CDN │     │ PDF / PNG Engine │    │ ATS Text Files    │
     └────────▲────────┘     └────────┬─────────┘    └───────────────────┘
              │                       │
              │                       ▼
              │              ┌──────────────────┐
              └──────────────┤ dist/downloads/*.│
                             │ (Static Assets)  │
                             └──────────────────┘
```

---

### 3. Canonical Data Model

Located in `src/data/schema.ts`:

```typescript
import { z } from "zod";

export const LinkSchema = z.object({
	label: z.string(),
	url: z.string().url(),
	icon: z.string().optional(),
	printHidden: z.boolean().default(false),
});

export const ExperienceItemSchema = z.object({
	id: z.string(),
	company: z.string(),
	location: z.string(),
	role: z.string(),
	startDate: z.string(), // YYYY-MM
	endDate: z.string().optional(), // undefined = "Present"
	summary: z.string(),
	highlights: z.array(z.string()),
	technologies: z.array(z.string()),
	featured: z.boolean().default(true),
	tier: z.enum(["primary", "secondary"]).default("primary"),
});

export const ProjectSchema = z.object({
	slug: z.string(),
	title: z.string(),
	subtitle: z.string(),
	description: z.string(),
	role: z.string(),
	impactMetrics: z.array(z.string()).optional(), // e.g. ["+45% LCP", "10k DAU"]
	technologies: z.array(z.string()),
	githubUrl: z.string().url().optional(),
	liveUrl: z.string().url().optional(),
	featured: z.boolean().default(false),
	tier: z.enum(["flagship", "notable", "experiment"]).default("notable"),
	hasCaseStudy: z.boolean().default(false),
});

export const SkillCategorySchema = z.object({
	name: z.string(), // e.g. "Languages", "Frontend & UI", "Backend & Cloud"
	skills: z.array(
		z.object({
			name: z.string(),
			level: z.enum(["expert", "proficient", "familiar"]).optional(),
			highlighted: z.boolean().default(false),
		}),
	),
});

export const ResumeDataSchema = z.object({
	identity: z.object({
		name: z.string(),
		title: z.string(),
		tagline: z.string(),
		email: z.string().email(),
		phone: z.string().optional(),
		location: z.string(),
		website: z.string().url(),
		links: z.array(LinkSchema),
	}),
	summary: z.object({
		short: z.string(), // for 1-page PDF / ATS
		full: z.string(), // for Web & 2-page PDF
	}),
	skills: z.array(SkillCategorySchema),
	experience: z.array(ExperienceItemSchema),
	projects: z.array(ProjectSchema),
	education: z.array(
		z.object({
			institution: z.string(),
			degree: z.string(),
			field: z.string(),
			startDate: z.string(),
			endDate: z.string(),
			honors: z.string().optional(),
		}),
	),
	certifications: z
		.array(
			z.object({
				name: z.string(),
				issuer: z.string(),
				date: z.string(),
				url: z.string().url().optional(),
			}),
		)
		.optional(),
});
```

---

### 4. Resume Variant Strategy

Variants are declared in `src/data/variants.ts` as pure transformation filters over the canonical data:

```typescript
export type ResumeVariant = "fullstack" | "frontend" | "ats" | "brief";

export interface VariantConfig {
	id: ResumeVariant;
	label: string;
	pdfPages: 1 | 2;
	titleOverride?: string;
	summaryOverride?: "short" | "full";
	featuredSkillsFirst: string[];
	maxProjects: number;
	excludedSections?: ("certifications" | "achievements")[];
}

export const VARIANTS: Record<ResumeVariant, VariantConfig> = {
	fullstack: {
		id: "fullstack",
		label: "Full-Stack Software Engineer",
		pdfPages: 2,
		summaryOverride: "full",
		featuredSkillsFirst: ["TypeScript", "React", "Node.js", "PostgreSQL", "Astro", "Tailwind CSS"],
		maxProjects: 6,
	},
	frontend: {
		id: "frontend",
		label: "Senior Frontend / UI Engineer",
		pdfPages: 2,
		summaryOverride: "full",
		featuredSkillsFirst: ["React", "Next.js", "Astro", "TypeScript", "Tailwind CSS", "Web Performance"],
		maxProjects: 6,
	},
	brief: {
		id: "brief",
		label: "One-Page Executive Summary",
		pdfPages: 1,
		summaryOverride: "short",
		featuredSkillsFirst: ["Architecture", "TypeScript", "Full-Stack", "Performance"],
		maxProjects: 3,
		excludedSections: ["certifications"],
	},
	ats: {
		id: "ats",
		label: "Standard ATS Format",
		pdfPages: 1,
		summaryOverride: "short",
		featuredSkillsFirst: ["Full-Stack Development", "System Architecture"],
		maxProjects: 4,
	},
};
```

---

### 5. Design System & Visual Strategy

#### Color Palette (Tailwind v4 CSS Variables)

- **Light Mode:**
  - Background: `hsl(210 20% 98%)` (Crisp, warm slate-white)
  - Surface: `hsl(0 0% 100%)`
  - Border: `hsl(215 15% 90%)`
  - Text Primary: `hsl(220 25% 10%)` (Deep charcoal, not harsh `#000`)
  - Text Muted: `hsl(215 15% 40%)`
  - Accent Primary: `hsl(220 85% 55%)` (Precision cobalt / electric azure)
  - Accent Muted: `hsl(220 90% 96%)`
- **Dark Mode:**
  - Background: `hsl(220 20% 7%)` (Deep midnight slate)
  - Surface: `hsl(220 18% 11%)` (Subtle elevated card background)
  - Border: `hsl(220 15% 18%)`
  - Text Primary: `hsl(210 20% 95%)`
  - Text Muted: `hsl(215 15% 65%)`
  - Accent Primary: `hsl(215 90% 60%)`

#### Typography System

- **Display / Headings:** `Geist Sans` or `Plus Jakarta Sans` (variable font, self-hosted in `public/fonts/`).
- **Body / Content:** `Inter` or `Geist Sans` (high x-height, clear readability at 14-16px).
- **Code / Metrics / Technical badges:** `Geist Mono` or `JetBrains Mono`.

#### Spacing, Elevation & Motion

- **Grid:** 8pt spatial rhythm (8px, 16px, 24px, 32px, 48px, 64px, 96px).
- **Borders & Radii:** Subtle 8px / 12px radii with ultra-fine `1px solid var(--border)` borders.
- **Motion:** Spring micro-interactions (under 200ms) for buttons and active nav. Zero scroll-jacking. Strict `@media (prefers-reduced-motion: reduce)` killswitch disabling all CSS transitions.

---

### 6. Export Architecture (Playwright + Print CSS)

#### The Generation Flow:

1. Astro renders dedicated print pages: `/print/resume?variant=fullstack` and `/print/resume?variant=brief`.
2. A build script (`scripts/generate-pdf.ts`) spins up local Chromium via Playwright:
   ```typescript
   const page = await browser.newPage();
   await page.goto("http://localhost:4321/print/resume?variant=fullstack", { waitUntil: "networkidle" });
   await page.emulateMedia({ media: "print" });
   await page.pdf({
   	path: "public/downloads/resume-fullstack.pdf",
   	format: "A4",
   	printBackground: true,
   	margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
   });
   ```
3. CSS Paged Media rules inside `print.css`:
   ```css
   @page {
   	size: A4 portrait;
   	margin: 12mm 14mm 12mm 14mm;
   }
   .page-break-inside-avoid {
   	break-inside: avoid;
   	page-break-inside: avoid;
   }
   ```
4. Plain-text generator writes `public/downloads/resume-ats.txt` with formatted markdown/ascii layout directly from the validated Zod data.

---

### 7. Performance & Quality Standards

- **Core Web Vitals Targets:**
  - LCP < 0.8s
  - CLS = 0.00
  - INP < 50ms
  - Lighthouse: 100 across Performance, Accessibility, Best Practices, and SEO.
- **Zero Hydration Default:** Standard pages output clean HTML+CSS. Micro-interactions use lightweight vanilla TypeScript (`<script>` tag in Astro layout, bundled without framework bloat).
- **Images:** WebP/AVIF generated via Astro's built-in `<Image />` component with explicit dimensions to guarantee 0 CLS.
- **Font Subsetting:** Self-hosted WOFF2 variable fonts preloaded in `<head>` with `font-display: swap`.

---

### 8. Security & Edge Backend

- **Cloudflare Pages Function** (`functions/api/contact.ts`):
  1. Method restriction: `POST` only.
  2. Rate limit: 3 requests per IP per 10 minutes.
  3. Cloudflare Turnstile token validation via `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`.
  4. Payload validation using Zod: `z.object({ name: z.string().min(2), email: z.string().email(), message: z.string().min(10).max(2000) })`.
  5. Forward to Resend API using environment variable `RESEND_API_KEY`.
- **Security Headers (via `public/_headers`):**
  ```
  /*
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
    Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com;
  ```

---

## Part III: Phased Implementation Roadmap

```
Phase 0: Architecture & Specs (Completed in Plan)
    │
    ▼
Phase 1: Project Scaffolding, Tooling & Design Tokens
    │
    ▼
Phase 2: Canonical Resume Schema & Zod Data Layer
    │
    ▼
Phase 3: Design System, Layout Primitives & Theme Toggle
    │
    ▼
Phase 4: Core Website Pages (Home, Experience, Interactive Skills)
    │
    ▼
Phase 5: Projects & Case Study System
    │
    ▼
Phase 6: Print & PDF Export Engine (Playwright + ATS text)
    │
    ▼
Phase 7: Cloudflare Edge Contact Form API (Turnstile + Resend)
    │
    ▼
Phase 8: Production Verification (Audits, SEO, A11y, Security, CI/CD)
```

### Detailed Phase Breakdown

#### Phase 1: Project Scaffolding & Tooling

- **Objective:** Establish isolated workspace with strict TypeScript, Astro 5, Tailwind v4, Vitest, and ESLint/Prettier.
- **Inputs:** Plan specifications.
- **Tasks:**
  - Initialize project with Astro (`pnpm create astro@latest`).
  - Configure Tailwind CSS v4 and typography plugins.
  - Setup ESLint, Prettier, and TypeScript strict mode (`tsconfig.json`).
  - Setup Vitest testing environment.
- **Acceptance Criteria:** `pnpm build`, `pnpm check`, and `pnpm test` execute cleanly with 0 warnings.

#### Phase 2: Canonical Data Model & Sample Data

- **Objective:** Create the single source of truth data architecture.
- **Tasks:**
  - Create `src/data/schema.ts` with all Zod schemas.
  - Create `src/data/resume.ts` and modular data files (`experience.ts`, `projects.ts`, `skills.ts`).
  - Create `src/data/variants.ts` transformation helpers.
  - Write Vitest tests verifying schema validation and variant filtering.
- **Acceptance Criteria:** 100% test coverage on resume data loader and variant transformations.

#### Phase 3: Design System & Shared Layout Shell

- **Objective:** Build layout, responsive navigation, footer, theme switcher, and typography tokens.
- **Tasks:**
  - Create `src/layouts/RootLayout.astro` with metadata, font preloads, and theme script.
  - Implement zero-FOUC dark/light mode toggle with `localStorage` + `prefers-color-scheme`.
  - Implement accessible responsive header with mobile navigation.
  - Implement skip-to-content link and ARIA landmarks.
- **Acceptance Criteria:** Accessible keyboard navigation, zero theme flicker on page refresh, 100% semantic HTML.

#### Phase 4: Core Presentation Components

- **Objective:** Build the interactive resume and portfolio home experience.
- **Tasks:**
  - Hero section with title, value proposition, and quick links.
  - Experience timeline component with collapsible details and metrics highlights.
  - Interactive Skill Grid grouped by category with visual tags.
  - Education & Certifications sections.
- **Acceptance Criteria:** Fully responsive across mobile, tablet, and desktop viewports.

#### Phase 5: Projects & Case Studies

- **Objective:** Showcase technical engineering depth with flagship case studies.
- **Tasks:**
  - Flagship project cards with architectural highlights, tech badges, and metrics.
  - Markdown/MDX case study template for in-depth technical breakdowns.
  - Filterable project grid (by technology, domain, or tier).
- **Acceptance Criteria:** Case study pages render with fast LCP; project links are keyboard navigable.

#### Phase 6: Print & PDF Export Engine

- **Objective:** Build the automated document generation pipeline.
- **Tasks:**
  - Create dedicated `/print/resume` route with `@media print` CSS.
  - Add variant switcher on the print route (`?variant=fullstack|brief|ats`).
  - Write `scripts/generate-pdf.ts` using Playwright to render pixel-perfect A4 PDFs.
  - Write `scripts/generate-txt.ts` for clean plain-text ATS export.
  - Add download buttons on the web UI linked to static PDF assets.
- **Acceptance Criteria:** Generated PDFs are selectable text, exactly 1 or 2 pages without awkward element splits, and pass ATS text extraction checks.

#### Phase 7: Edge Contact API & Security

- **Objective:** Serverless contact form handling with spam protection.
- **Tasks:**
  - Create `functions/api/contact.ts` Cloudflare Pages function.
  - Integrate Cloudflare Turnstile CAPTCHA widget in the UI.
  - Implement honeypot, Zod validation, and Resend API dispatch.
  - Add accessible success/error toast notifications.
- **Acceptance Criteria:** Valid messages send an email via Resend; invalid/bot submissions are rejected with HTTP 400/429.

#### Phase 8: Production Verification & Hardening

- **Objective:** Final quality gates before release.
- **Tasks:**
  - Run Lighthouse CI audit (Target: 100 on Performance, A11y, Best Practices, SEO).
  - Add JSON-LD `Person` and `ProfilePage` structured data.
  - Add Open Graph / Twitter dynamic preview images.
  - Add `_headers` security and caching directives.
  - Configure GitHub Actions workflow for CI testing and Cloudflare Pages deployment.
- **Acceptance Criteria:** All quality gates pass; site is production-ready.

---

## Part IV: Explicit Exclusions ("What NOT to Build")

1. **No Runtime Database / ORM (PostgreSQL, SQLite, Prisma, Supabase):** Resume content changes via git commits, not database mutations.
2. **No User Authentication or Admin Login:** Content-as-code in Git is safer, free, version-controlled, and leaves 0 attack surface.
3. **No Heavy UI Component Libraries (shadcn/radix bloat, MUI, AntD):** Tailored, semantic HTML + Tailwind components deliver better performance and smaller bundles.
4. **No Heavy Client-Side State Management (Redux, Zustand):** The website is 95% static content with localized vanilla JS micro-interactions.
5. **No Scroll-Jacking or Excessive 3D/Canvas Animations:** Keeps the site professional, performant, and accessible.

---

## Part V: Context-Efficient AI Session Protocol

To maintain low token costs during AI-driven implementation, each session adheres to this protocol:

```text
1. Read current status from docs/phase-status.md.
2. Read only the specific files relevant to the active Phase (e.g. Phase 2 reads only src/data/* and schema tests).
3. Execute Phase tasks strictly within scope.
4. Run validation checks (pnpm check && pnpm test).
5. Update docs/phase-status.md to reflect completed tasks.
6. Commit changes with conventional commit message (e.g. "feat(data): implement canonical resume schema and Zod validation").
```

---

## Part VI: Final Architectural Recommendation

- **Stack:** Astro 5 (SSG) + TypeScript (Strict) + Tailwind CSS v4 + Zod + Playwright (PDF build).
- **Hosting:** Cloudflare Pages (Static Edge CDN + Pages Functions).
- **Data Model:** Single Source of Truth in `src/data/*.ts` with Zod validation.
- **Export Strategy:** Playwright renders `/print/resume` to vector PDF at build time; plain-text ATS generator produces `.txt`.
- **First Implementation Action:** Execute **Phase 1 (Repository & Tooling Foundation)** once approved.
