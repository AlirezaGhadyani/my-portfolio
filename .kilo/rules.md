# Rules

Always / Never rules. Each cites the file:line that proves it.

## Always

- **Always** run the verification gate after any change: `pnpm check && pnpm test && pnpm lint && pnpm format:check && pnpm build:all && find dist -name "*.js" | wc -l` (`knowledge/verification.md`)
- **Always** use `present.ts` for date formatting, ordering, and display strings — never format dates inline (`src/domain/present.ts`)
- **Always** use design tokens (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`) for border-radius — never raw px values (`knowledge/design-system.md`)
- **Always** use `--on-accent` for text on accent backgrounds — never hardcode `#ffffff` or `#fff` (`src/styles/global.css:58,87`)
- **Always** use `--danger` for error states — never hardcode `#ef4444` (`src/styles/global.css:59,88`)
- **Always** keep `theme.ts` and `global.css` palette blocks byte-identical (`src/data/theme.ts:34-133` ↔ `src/styles/global.css:100-180`)
- **Always** use the en dash `–` (U+2013) for date ranges in display text (`src/domain/present.ts:18`)
- **Always** validate resume data through Zod at module load — never skip the parse (`src/data/resume.ts:7`)
- **Always** use `waitUntil: 'load'` + `document.fonts.ready` for PDF generation — never `networkidle` (`scripts/generate-pdf.ts:62-63`)
- **Always** use Playwright's bundled Chromium for PDFs — never system Chrome (`scripts/lib/chromium.ts`)

## Never

- **Never** import from `src/data/**` into `src/data/**` — it is the domain layer, no external deps (`src/data/schema.ts`)
- **Never** hardcode identity, dates, or tech lists in components — use `resume.ts` (`src/data/resume.ts`)
- **Never** emit `.js` files into `dist/` — verify with `find dist -name "*.js"` after any UI change (invariant §2.3)
- **Never** nest `@media` inside `@keyframes` — CSS parsers silently drop it (`src/styles/global.css:341-345`)
- **Never** use `Astro.throw` — it does not exist in Astro 7 (`AstroGlobal` has: `has, headers, render, response, self, slots`)
- **Never** merge the print and web renderers — share `present.ts`, not markup (ADR-0001)
- **Never** introduce new breakpoint values — use the 4 defined in `knowledge/design-system.md`
- **Never** use `#ffffff`/`#fff` on accent backgrounds — use `var(--on-accent)` (`src/styles/global.css:58,87`)
- **Never** claim a command passed without quoting its output
- **Never** mark a task done without real command output
- **Never** widen scope — add discoveries to `plans/*/md` §8 (Deferred)
- **Never** use `is:inline` scripts for logic that could be a module script — they are not type-checked, linted, or minified (ADR-0003)
- **Never** set `Cache-Control: immutable` on mutable, non-hashed URLs (`public/_headers:22-24`)
- **Never** allow the contact endpoint to fail open — missing secrets must return 503 (`functions/api/contact.ts:218-227`)
