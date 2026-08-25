# Design System

Single source of truth for the token layer (T3.2). Changes to tokens must keep the
following contracts green: `src/styles/contrast.test.ts` (WCAG AA matrix),
`src/styles/tokens.test.ts` (no raw color/radius literals outside the print page),
`src/data/theme.test.ts` (palette parity between `theme.ts` and `global.css`).

## Breakpoint scale (CSS cannot use `var()` inside `@media` — these are the constants)

Collapsed from 9 ad-hoc values to 4 in T3.2 (was 30/32/35/36/38/40/42/48/52rem).

| Constant  | Rem     | Intent                                |
| --------- | ------- | ------------------------------------- |
| `--bp-xs` | `35rem` | narrow phones — single-column layouts |
| `--bp-md` | `42rem` | small tablets — grid fallbacks        |
| `--bp-lg` | `48rem` | tablets / header→drawer nav collapse  |
| `--bp-xl` | `52rem` | wide content reflow                   |

- **Reading rule:** `@media (max-width: 48rem)` = `--bp-lg`.
- The mobile-nav JS in `SiteHeader.astro` mirrors `--bp-lg` (48rem) scaled by the live
  root font size, so CSS and JS can never desync when the user changes their font size.
- Do **not** introduce new breakpoint values. Reuse these four or refactor the layout.

## Container widths

| Token / value     | Rem     | Used by                                         |
| ----------------- | ------- | ----------------------------------------------- |
| `--content-width` | `76rem` | `.content-shell`, header inner                  |
| (hardcoded)       | `82rem` | `SiteFooter`                                    |
| (hardcoded)       | `66rem` | case-study article (`projects/[slug].astro`)    |
| (hardcoded)       | `58rem` | print resume page (fixed A4 artifact, ADR-0004) |

## Radius scale

| Token           | Value    | Notes                        |
| --------------- | -------- | ---------------------------- |
| `--radius-sm`   | `6px`    | chips, inputs, inline code   |
| `--radius-md`   | `9px`    | default content panels       |
| `--radius-lg`   | `14px`   | large cards, hero intercepts |
| `--radius-full` | `9999px` | pills, swatches, status dots |

`--radius` (12px) was retired in T3.2; its 8 uses migrated to `--radius-md`.

## Color tokens (theme-switched)

Beyond the neutral/accent scale, the semantic set:

| Token              | Light                      | Dark               | Contract                               |
| ------------------ | -------------------------- | ------------------ | -------------------------------------- |
| `--on-accent`      | `#ffffff` (or per-palette) | near-black         | `>= 4.5:1` vs `--accent` (per palette) |
| `--danger`         | `#b91c1c`                  | `#f87171`          | `>= 4.5:1` on `--bg` and `--surface`   |
| `--status-success` | `hsl(142 72% 30%)`         | `hsl(142 71% 60%)` | `>= 4.5:1` on `--bg` and `--surface`   |
| `--status-warning` | `hsl(40 90% 38%)`          | `hsl(45 95% 55%)`  | non-text icon accent (decorative cert) |
| `--syntax-string`  | `hsl(145 48% 34%)`         | `hsl(145 48% 62%)` | `>= 4.5:1` on `--surface`              |
| `--syntax-number`  | `hsl(29 80% 38%)`          | `hsl(29 92% 70%)`  | `>= 4.5:1` on `--surface`              |

## Parity rule

`global.css` palette blocks must be kept byte-identical to `theme.ts`. `theme.ts` is the
authoritative payload (used by the swatch renderer and validation); `global.css` is what
actually themes the site. `src/data/theme.test.ts` enforces equality for all 5 palettes ×
2 themes; any change to a palette hue must be made in **both** files.

## Enforcement

- `tokens.test.ts` bans raw `hsl()`/hex and numeric `border-radius` in `.astro` files
  outside the print page (`src/pages/print/`), and bans references to retired tokens.
- `contrast.test.ts` asserts the full token × theme matrix (text, danger, status-success,
  syntax colours, per-palette accent/on-accent).
- The print document intentionally bypasses all theme tokens (fixed palette, ADR-0004).
