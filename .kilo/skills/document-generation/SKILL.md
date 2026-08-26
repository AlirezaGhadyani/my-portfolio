---
name: document-generation
description: Patterns for PDF generation, ATS text output, and the print resume page.
---

# Document Generation Skill

## What patterns does this project use

- Playwright's bundled Chromium for PDF generation (never system Chrome)
- `waitUntil: 'load'` + `document.fonts.ready` (not `networkidle`)
- Four-place margin contract: `@page` + Playwright margin + `preferCSSPageSize` + print override
- `assertPdfPageCount()` validates page counts immediately after each PDF
- ATS text is pure ASCII with en/em dashes normalized to hyphens
- Print page uses fixed palette (49 hardcoded colors) — not theme tokens

## What is forbidden

- Using system Chrome for PDFs (`scripts/lib/chromium.ts` always uses bundled)
- Using `networkidle` wait strategy (doesn't await fonts)
- Relaxing `pdfPages` to pass the check — fix content to fit
- Adding theme tokens to the print page (ADR-0004)
- Merging print and web renderers (ADR-0001)
- Non-ASCII characters in ATS text output

## What to inspect first

1. `scripts/generate-pdf.ts` — PDF generation pipeline
2. `scripts/generate-txt.ts` — ATS text generation
3. `src/pages/print/resume/[...variant].astro` — print page template
4. `src/styles/print.css` — print stylesheet
5. `scripts/verify-outputs.ts` — output verification

## What commonly goes wrong

- `resume-brief.pdf` and `resume-ats.pdf` must be 1 page — reduce `maxProjects` or tighten margins if overflow
- `generate-txt.ts:95` normalizes dashes — add new dash characters to that regex
- The four-place margin contract: changing any one of the four breaks pagination
- Font loading: `page.goto()` must wait for `document.fonts.ready`
- `data-variant` attribute on `<html>` drives variant-specific CSS tightening

## Validation required

```bash
pnpm build:all                  # full build pipeline
tsx scripts/verify-outputs.ts   # cross-renderer consistency + page counts
find dist -name "*.js" | wc -l  # must be 0
```
