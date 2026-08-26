---
name: design-tokens
description: Patterns for the design token layer, palette system, contrast requirements, and CSS conventions.
---

# Design Tokens Skill

## What patterns does this project use

- CSS custom properties in `global.css` for all visual values
- 5 palettes (amber, ocean, emerald, amethyst, rose) × 2 themes (light, dark)
- `theme.ts` defines palette values; `global.css` applies them — must stay byte-identical
- `--on-accent` for text on accent backgrounds (near-black in dark theme, white in light)
- `--danger` for error states, `--status-success` for success, `--status-warning` for decorative
- Radius scale: `--radius-sm` (6px), `--radius-md` (9px), `--radius-lg` (14px), `--radius-full` (9999px)
- 4 breakpoint constants: 35rem, 42rem, 48rem, 52rem

## What is forbidden

- Raw `hsl()`, hex colors, or numeric `border-radius` in `.astro` files (except `src/pages/print/`)
- `#ffffff` or `#fff` on accent backgrounds — use `var(--on-accent)`
- `#ef4444` for errors — use `var(--danger)`
- New breakpoint values — use the 4 defined constants
- `@media` nested inside `@keyframes` — CSS parsers silently drop it
- Retired tokens: `--radius` (12px), `--transition-smooth`, `--shadow-color`

## What to inspect first

1. `src/styles/global.css` — token definitions and palette blocks
2. `src/data/theme.ts` — palette source of truth
3. `src/styles/contrast.test.ts` — WCAG contrast matrix
4. `src/styles/tokens.test.ts` — token compliance test
5. `.kilo/knowledge/design-system.md` — full token inventory

## What commonly goes wrong

- Changing `theme.ts` without updating `global.css` (or vice versa) — parity test catches this
- Using `--radius` (retired) instead of `--radius-md`
- Hardcoding colors in new components — `tokens.test.ts` catches this
- `--text-subtle` is restricted to non-text decoration (below 4.5:1 on light bg)
- emerald light accent as text is below 4.5:1 — use darker variant

## Validation required

```bash
pnpm test          # contrast.test.ts + tokens.test.ts + theme.test.ts
pnpm build         # visual check in both themes
```
