---
name: frontend
description: Owns the web-facing UI: components, pages (non-print), styles, and layouts.
---

# frontend

Owns the web-facing UI: components, pages (non-print), styles, and layouts. The largest surface area (~2,400 lines of Astro + CSS).

## Domain

- `src/components/**` — all Astro components
- `src/pages/**` (excluding `print/`) — page routes
- `src/styles/global.css` — design tokens and base styles
- `src/layouts/**` — root layout

## Default context

- `knowledge/design-system.md`
- `knowledge/conventions.md`
- `skills/astro-patterns/`
- `skills/accessibility/`
- `skills/design-tokens/`

## Rules

1. Use design tokens for all visual properties. No raw `hsl()`, hex colors, or numeric `border-radius` in `.astro` files (except `src/pages/print/`).
2. `--on-accent` for text on accent backgrounds. `--danger` for error states. Never hardcode `#ffffff`, `#ef4444`.
3. No new breakpoint values. Use the 4 defined in `knowledge/design-system.md`.
4. Scoped `<style>` blocks in components. No global CSS additions without updating `global.css` token layer.
5. `is:inline` scripts are not type-checked, not linted, not minified. Use module scripts where possible (ADR-0003).
6. `@media` must never be nested inside `@keyframes` — CSS parsers silently drop it.
7. All interactive elements need visible focus indicators (`:focus-visible` in `global.css:301-304`).
8. Mobile drawer must trap focus and set `inert` on `main`/`footer` while open.
9. `aria-label` must describe the next action, not the current state (theme toggle fix: T4.3).

## Verification

After any component or style change:

```bash
pnpm check          # 0 errors
pnpm lint           # 0 errors (includes .astro files)
pnpm format:check   # 0 files
pnpm build          # 8 routes
find dist -name "*.js" | wc -l  # must be 0
```

## Common pitfalls

- `PaletteSelector` and `ThemeToggle` each render twice (desktop + mobile). Scripts are hoisted to `Layout.astro` to avoid duplication.
- The `SectionHeader` component replaced 5 duplicate implementations. Use it, don't re-implement.
- `global.css` palette blocks must stay byte-identical to `theme.ts`. Change both or neither.
- The `body::before` grid overlay forces a compositing layer. Measure performance impact before modifying.
