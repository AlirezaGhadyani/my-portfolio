# Document Pipeline

Build order, the four-place margin contract, the pdfPages contract, and ATS rules.

## Build order

```bash
pnpm build:all
# 1. astro build                     → dist/ (HTML, CSS, assets, copies public/)
# 2. tsx scripts/generate-sitemap.ts → dist/sitemap.xml, dist/robots.txt
# 3. tsx scripts/generate-txt.ts     → dist/downloads/resume-ats.txt
# 4. tsx scripts/generate-pdf.ts     → dist/downloads/resume-{variant}.pdf (×4)
# 5. tsx scripts/generate-og-image.ts→ dist/og-image.png
```

This order is load-bearing:
- PDF generation starts a static server on `dist/` — it must exist first
- Sitemap reads `resumeData.identity.website` for the base URL
- TXT generation reads `resumeData` directly (no build dependency)
- OG image generation may reference built assets

## The four-place margin contract

PDF pagination depends on four things agreeing:

1. `print.css` `@page` — sets `margin: 10mm 12mm 10mm 12mm`
2. Playwright `page.pdf()` — sets `margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }`
3. `preferCSSPageSize: true` — tells Playwright to use the CSS `@page` size
4. `.resume-sheet` print rule — `padding: 0 !important; margin: 0 !important`

Changing any one of these breaks pagination. The screen view uses `padding: 14mm 16mm` on
`.resume-sheet` but the print media query overrides it to `0`.

## The pdfPages contract

`VariantConfig.pdfPages` declares the expected page count (1 or 2).
`scripts/verify-outputs.ts:assertPdfPageCount()` checks the actual PDF against this.
`generate-pdf.ts` calls `assertPdfPageCount()` immediately after each `page.pdf()`.

**Never relax `pdfPages` to make the check pass.** Fix the content to fit:
- Reduce `maxProjects`
- Tighten section margins under `data-variant` attribute
- Remove sections via `excludedSections`

Current counts: fullstack=2, frontend=2, brief=1, ats=1.

## PDF generation details

- Uses Playwright's bundled Chromium (never system Chrome — `scripts/lib/chromium.ts`)
- `waitUntil: 'load'` + `await page.evaluate(() => document.fonts.ready)` (not `networkidle`)
- `emulateMedia({ media: 'print' })` before `page.pdf()`
- Viewport: 1280×960, deviceScaleFactor: 2

## ATS text rules

`scripts/generate-txt.ts` generates `resume-ats.txt`:
- Pure ASCII enforced by `verify-outputs.ts` (`/^[\x09\x0a\x20-\x7e]*$/`)
- En/em dashes normalized to ASCII hyphens at `generate-txt.ts:95`: `.replace(/[–—]/g, "-")`
- No decorative rule lines (was `===` / `---` — removed in T4.7)
- Name in normal case (was UPPER — removed in T4.7)
- Uses `present.ts` for all date formatting and ordering

## Print page architecture

`src/pages/print/resume/[...variant].astro`:
- Static routes: `/print/resume` (fullstack), `/print/resume/frontend`, `/print/resume/brief`, `/print/resume/ats`
- Screen-only toolbar with variant switcher, PDF/TXT download links, print button
- `data-variant` attribute on `<html>` drives variant-specific CSS tightening
- Fixed palette: `data-theme="light"` `data-palette="amber"` — does not use theme tokens
- 49 hardcoded color values (intentional — ADR-0004)

## Dead weight (do not reintroduce)

- `.print-only` — 0 uses
- `.page-break-before-always` — 0 uses
- Keep `.page-break-inside-avoid` — used extensively
