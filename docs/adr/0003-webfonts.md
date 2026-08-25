# ADR-0003: Self-hosted variable fonts

- **Status:** Accepted (T3.5)
- **Date:** 2026-08-25

## Context

`global.css` declared `--font-sans: "Inter", ...` and `--font-mono: "JetBrains Mono", ...`,
but neither font was loaded anywhere — no `@font-face`, no `.woff2`, no external link. The
entire site rendered in system fallbacks, and `docs/phase-status.md` compounded the confusion
by claiming the fonts were "Geist Sans/Mono". The design identity (incl. the print PDFs) never
applied. PDF generation depends on fonts being loaded: T0.5 fixed `document.fonts.ready`
awaiting so we can rely on real glyph metrics.

## Decision

Self-host latin-only variable subsets of **Inter** and **JetBrains Mono**:

- Install `@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono`.
- Declare two explicit `@font-face` rules in `global.css` pointing at the latin `woff2-variations`
  files (`font-display: swap`, weight ranges `100 900` / `100 800`).
- Update the `@theme` font stacks to `"Inter Variable"` / `"JetBrains Mono Variable"`, keeping the
  full system fallback stacks.
- Preload both woff2 files in `Layout.astro` head.

Only the two latin files are emitted into `dist/` (~49 KB + ~40 KB). Other subsets are not
shipped; non-latin glyphs fall back to the system stack.

## Consequences

- ~88 KB of transfer on first paint; the fonts load off the critical path via `preload`.
- Web, print, and PDF surfaces finally render the intended typeface; PDFs stay within their
  declared page counts (verified: fullstack/frontend 2p, brief/ats 1p).
- `dist/` remains zero-JS (fonts are CSS-level assets).
- To switch fonts later, change the `@font-face` sources and the `@theme` stacks in one place.
