# ADR-0004: Print Uses a Fixed Light Palette

**Status:** Accepted  
**Date:** 2026-08-25  
**Deciders:** Architecture remediation plan (T5.4)

## Context

The print resume page (`src/pages/print/resume/[...variant].astro`) contains 49 hardcoded color
values instead of using the site's CSS custom property token layer. This looks like technical debt
but is an intentional architectural decision.

## Decision

The print document uses a fixed light palette with hardcoded color values. It does **not** use
theme tokens (`var(--accent)`, `var(--text)`, etc.).

## Rationale

1. **PDF output must not vary with a visitor's theme.** A recruiter downloading a PDF expects
   a consistent, professional document regardless of whether they visited in dark mode or
   selected the "rose" palette.
2. **Print media query overrides.** The `@media print` block in `print.css` forces
   `background: #ffffff !important` and `color: #111827 !important`. Theme tokens would be
   overridden anyway.
3. **Playwright PDF generation.** `generate-pdf.ts` calls `emulateMedia({ media: 'print' })`
   before `page.pdf()`. The print stylesheet takes precedence.
4. **Predictability.** 49 hardcoded values are auditable. Theme tokens with palette overrides
   create a combinatorial surface (5 palettes × 2 themes × N tokens) that is harder to verify
   for print quality.

## Consequences

- The print page has 49 hardcoded color values — this is intentional
- A future agent must NOT "fix" this by replacing hardcoded values with `var(--token)`
- If the print palette needs changing, edit `[...variant].astro` directly
- The screen-only toolbar uses a dark theme (`#090d16` background) — this is also hardcoded

## References

- `src/pages/print/resume/[...variant].astro:315-737` — print page styles
- `src/styles/print.css` — print media query overrides
- `scripts/generate-pdf.ts:64` — `emulateMedia({ media: 'print' })`
