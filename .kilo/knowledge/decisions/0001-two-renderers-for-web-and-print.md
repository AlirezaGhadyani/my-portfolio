# ADR-0001: Two Renderers for Web and Print

**Status:** Accepted  
**Date:** 2026-08-25  
**Deciders:** Architecture remediation plan (T5.4)

## Context

The original architecture plan (`1787564533702-*.md`, Loop 2) proposed sharing markup components
between the web and print renderers. This would mean one set of `.astro` components driving both
the themeable, responsive, interactive website and the fixed-palette A4 PDF output.

## Decision

We deliberately do **not** share markup between the web and print renderers.

**What is shared:** `src/domain/present.ts` — the presentation adapter that handles date formatting,
ordering, and display strings.

**What is not shared:** Component markup, styles, or layout logic.

## Rationale

A themeable/responsive/interactive document and a fixed-palette A4 artifact have fundamentally
opposed requirements:

| Concern       | Web                                                     | Print                         |
| ------------- | ------------------------------------------------------- | ----------------------------- |
| Colors        | 5 palettes × 2 themes via CSS tokens                    | Fixed 49 hardcoded values     |
| Layout        | Responsive, fluid                                       | Fixed A4 dimensions           |
| Interactivity | JS-powered (theme toggle, palette selector, mobile nav) | Zero JS                       |
| Typography    | Variable fonts, clamp()                                 | Fixed point sizes             |
| Page breaks   | N/A                                                     | `break-inside: avoid`         |
| Margins       | `var(--gutter)`                                         | `@page` + Playwright contract |

Unifying these into a configuration-driven component yields something harder to maintain than
two clear, purpose-built renderers. The configuration surface area would exceed the code it replaces.

## Consequences

- Three renderers exist (web, print, text) — a resume fact must be added to all three
- `present.ts` is the single shared layer — all formatting consistency flows through it
- The print page has 49 hardcoded color values — this is intentional, not technical debt
- A future agent must NOT "fix" this duplication by merging the renderers

## References

- `src/pages/print/resume/[...variant].astro` — print renderer
- `src/components/*.astro` — web renderer
- `scripts/generate-txt.ts` — text renderer
- `src/domain/present.ts` — shared adapter
