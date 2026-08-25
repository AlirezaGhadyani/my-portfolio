# ADR-0002: Remove Tailwind CSS

- **Status:** Accepted (T3.6)
- **Date:** 2026-08-25

## Context

Tailwind v4 + `@tailwindcss/vite` are installed and listed in the project's "core stack",
but `src/` contains effectively zero utility classes. Its only real contributions were:

1. the `@theme` aliases for `--font-sans` / `--font-mono`, and
2. the global preflight reset.

The audit flagged this as a phantom dependency: a stack claim that nothing is actually built
on. Keeping it "just in case" is what created the ambiguity in the first place.

## Decision

Remove Tailwind CSS and `@tailwindcss/vite`, and replace its contributions with native CSS:

- `--font-sans` / `--font-mono` moved into a plain `:root` block (they are already plain CSS
  custom properties after compilation).
- The essential preflight behaviour (universal box-sizing/margin/padding reset, heading
  font-size/weight inheritance, list-style removal, form-element font/colour inheritance,
  SVG block display, placeholder opacity) is replicated explicitly in `global.css`'s
  `@layer base`.
- `astro.config.mjs` no longer registers the Tailwind Vite plugin.

## Consequences

- The shared stylesheet drops ~10 KB (preflight + unused `--tw-*` theme variables).
- Rendering is unchanged for existing UI: the replicated preflight covers everything the site
  actually depended on, and every component already carried its own explicit styles.
- PDF page counts are preserved (fullstack/frontend 2p, brief/ats 1p) after regeneration.
- **Policy:** no Tailwind utilities in new work. Future component styles are plain scoped CSS
  using the tokens from `.kilo/knowledge/design-system.md`.
