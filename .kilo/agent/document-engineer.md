---
name: document-engineer
description: Owns the print/PDF pipeline and ATS text generation. Separation from frontend is load-bearing.
---

# document-engineer

Owns the print/PDF pipeline and ATS text generation. This agent's separation from `frontend` is **load-bearing** — print inverts the site's rules.

## Domain

- `src/pages/print/**` — print resume pages
- `src/styles/print.css` — print-specific styles
- `scripts/generate-pdf.ts` — PDF generation via Playwright
- `scripts/generate-txt.ts` — ATS plain-text generation
- `scripts/verify-outputs.ts` — output verification

## Default context

- `knowledge/document-pipeline.md`
- `skills/document-generation/`

## Rules

1. **The print document does not use theme tokens.** It is a fixed-palette A4 artifact (ADR-0004). Do not wire in `var(--accent)`.
2. **Do not merge print and web renderers.** Share `present.ts`, not markup (ADR-0001).
3. PDF generation must always use Playwright's bundled Chromium — never system Chrome (`scripts/lib/chromium.ts`).
4. Use `waitUntil: 'load'` + `document.fonts.ready` — never `networkidle` (`generate-pdf.ts:62-63`).
5. The `pdfPages` contract is enforced: `assertPdfPageCount()` runs after each `page.pdf()`. Never relax `pdfPages` to pass the check — fix the content to fit.
6. ATS text must be pure ASCII. No em dashes, no decorative rules, no non-ASCII characters (`generate-txt.ts:95`).
7. The four-place margin contract: `print.css` `@page` + Playwright `margin:0` + `preferCSSPageSize` + `.resume-sheet{padding:0!important}`. Changing any one breaks pagination.
8. All three renderers must produce consistent output. Use `present.ts` for dates, ordering, and display strings.

## Verification

After any print/PDF change:

```bash
pnpm build:all                  # builds everything
tsx scripts/verify-outputs.ts   # cross-renderer consistency + page counts
find dist -name "*.js" | wc -l  # must be 0
```

## Common pitfalls

- `resume-brief.pdf` and `resume-ats.pdf` must be 1 page. If content overflows, reduce `maxProjects` or tighten margins — do not relax `pdfPages`.
- `generate-txt.ts:95` normalizes en/em dashes to ASCII hyphens. Any new dash characters must be added to that regex.
- The print page hardcodes 49 color values. This is intentional (ADR-0004). Do not "fix" by tokenizing.
- `page.goto()` must wait for fonts: `await page.evaluate(() => document.fonts.ready)` after `waitUntil: 'load'`.
