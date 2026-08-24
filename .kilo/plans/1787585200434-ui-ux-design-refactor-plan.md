# UI/UX, Design Intelligence, Animation & Resume Modernization Plan

## 1. Context & Objectives
The portfolio project currently uses basic styling with minimal animations, raw borders, missing SVG icons in interactive buttons/links, basic mobile responsiveness, and unstyled/plain resume exports.

This plan defines an end-to-end UI/UX refactor across four pillars:
1. **Design Tokens & Atmosphere**: Fluid typography, ambient radial mesh lighting, refined color tokens, multi-layered depth shadows, and consistent border radii.
2. **Iconography & Micro-Interactions**: Inline SVG icon system (GitHub, LinkedIn, Mail, Download, ExternalLink, Calendar, MapPin, Check, Sparkles, Terminal, Code, Moon, Sun), smooth hover transitions, card lift effects, and pulsing live status badge.
3. **Responsive Mobile Excellence**: Re-engineered mobile navigation menu, touch-target optimization (minimum 44px), fluid spacing with `clamp()`, and zero horizontal scroll.
4. **Minimal & Polished Resume / Print Design**: Modernized typography grid, crisp visual hierarchy, refined contact/meta layout, and strict page-budget compliance.

---

## 2. Scope & Affected Files

- `src/styles/global.css`: Design token definitions, theme variables, glassmorphism utilities, fluid typography rules, and keyframe animations.
- `src/components/icons/Icon.astro` (New): Centralized, accessible SVG icon component supporting key icons (`github`, `linkedin`, `email`, `download`, `external`, `print`, `calendar`, `pin`, `sun`, `moon`, `sparkles`, `check`).
- `src/components/SiteHeader.astro`: Refined desktop navbar, backdrop blur, animated mobile hamburger/drawer with active states.
- `src/components/SiteFooter.astro`: Polished layout with social icons and subtle divider styling.
- `src/pages/index.astro`: Hero section overhaul with animated status dot, ambient backdrop glow, icon-adorned action pills, and refined spacing.
- `src/components/ProjectCard.astro`: Interactive card lift, tier badges (Flagship/Notable), technology tags, and external link icons.
- `src/components/SkillSection.astro`: Clean category cards with proficiency level badges and hover highlights.
- `src/components/ExperienceSection.astro`: Timeline accent rail, company/location badges, and bullet markers.
- `src/components/EducationSection.astro`: Polished credentials list with metadata icons.
- `src/components/ContactSection.astro`: Polished input fields, floating label aesthetics, smooth validation states, and submit button animation.
- `src/styles/print.css` & `src/pages/print/resume/[...variant].astro`: Clean 2-column header, subtle section dividers, compact data-dense layout, print optimization with `break-inside: avoid`.

---

## 3. Implementation Steps

### Step 1: Design Tokens, Typography & Animation System (`src/styles/global.css`)
- Configure CSS variables for `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow`.
- Add `--radius-sm` (6px), `--radius-md` (10px), `--radius-lg` (16px), `--radius-full` (9999px).
- Introduce keyframe animations:
  - `@keyframes fadeInUp` (subtle stagger-in for hero & sections).
  - `@keyframes pulseGlow` (soft pulsing beacon for availability indicator).
- Add ambient background radial mesh gradient on root body.
- Respect `prefers-reduced-motion` to disable all transforms and keyframes when requested.

### Step 2: SVG Iconography Component (`src/components/icons/Icon.astro`)
- Create a lightweight zero-dependency `<Icon name="..." size={...} class="..." />` component.
- Support essential icons:
  - `github`, `linkedin`, `email`, `download`, `external`, `calendar`, `pin`, `document`, `arrow-right`, `check`.
- Replace missing/unrendered SVG icons in hero buttons, project cards, resume toolbar, and footer.

### Step 3: Header & Mobile Responsive Navigation (`src/components/SiteHeader.astro`)
- Add glassmorphism (`backdrop-filter: blur(16px)`).
- Upgrade mobile drawer: slide-down transition, full touch-friendly hit areas (minimum 44x44px), clear focus outlines, and automatic close on ESC / link click.
- Polish theme toggle button with smooth icon rotation/fade.

### Step 4: Hero & Main Sections Visual Polish
- **Hero** (`src/pages/index.astro`):
  - Eyebrow pill with pulsing green "Available for hire / contract" status dot.
  - Display title with high-contrast gradient text or crisp balance typography.
  - Action pills with integrated vector icons for resume download, GitHub, LinkedIn, and contact.
- **Project Cards** (`src/components/ProjectCard.astro`):
  - Subtle top border highlight on hover.
  - Hover translation `translateY(-3px)` and dynamic shadow.
  - Tech stack tag pills with subtle borders.
- **Experience & Education** (`src/components/ExperienceSection.astro`, `src/components/EducationSection.astro`):
  - Subtle vertical timeline accent or refined card grid.
  - Monospace date tags and location pins.
- **Contact Form** (`src/components/ContactSection.astro`):
  - Focus glow rings on inputs (`box-shadow: 0 0 0 3px var(--accent-muted)`).
  - Clean error states and interactive loading spinner on submission.

### Step 5: Resume & Print Document Redesign (`src/styles/print.css` & `[...variant].astro`)
- **Screen View**: Modern dark toolbar with active variant pill switchers and quick-download actions.
- **Document View**:
  - High-density modern typographical layout.
  - Top header with bold name, primary accent title, and two-column contact grid.
  - Clean uppercase section headers with refined border rules.
  - Compact bullets with 1.4 line-height and crisp monospace dates.
- Strict `@page` margin control and `break-inside: avoid` on all articles to ensure 1-page target for `brief` / `ats` and 2-page target for `fullstack`.

---

## 4. Verification & Validation Plan
1. **Automated Checks**:
   - Run `pnpm test` (verify schema & variant tests pass).
   - Run `pnpm check` (Astro diagnostic typechecking).
   - Run `pnpm lint` & `pnpm format:check`.
2. **Build & Asset Verification**:
   - Run `pnpm build:all` to compile Astro HTML, sitemap, ATS txt, and Playwright-compiled PDF files.
3. **Visual & Responsive Verification**:
   - Inspect mobile viewport (320px - 480px), tablet (768px), and desktop (1024px+).
   - Verify dark and light themes for contrast ratios (WCAG AA compliance).
   - Verify `prefers-reduced-motion` compliance.
