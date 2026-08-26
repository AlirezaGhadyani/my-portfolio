# ADR-0002: Tailwind as Token Host Only

**Status:** Accepted  
**Date:** 2026-08-25  
**Deciders:** Architecture remediation plan (T3.6, T5.4)

## Context

Tailwind v4 + `@tailwindcss/vite` are installed and named in the project's core stack. However,
`src/` contains effectively zero utility classes. Tailwind's only contributions are:

1. The `@theme` font aliases (Inter Variable, JetBrains Mono Variable)
2. The CSS reset / preflight

Both are replaceable by ~15 lines of CSS.

## Decision

Keep Tailwind installed but use it as a **token host only** — do not add utility classes to
components. Continue using scoped `<style>` blocks with CSS custom properties.

## Rationale

1. **Consistency.** The codebase already has a mature token layer (`global.css` + `theme.ts`).
   Mixing token-based styling with utility classes creates two parallel systems.
2. **Scoped styles.** Astro's scoped `<style>` blocks provide component isolation without
   Tailwind's class-based approach.
3. **Print compatibility.** The print page uses hardcoded values (ADR-0004). Utility classes
   would add unused CSS to the print bundle.
4. **Zero-JS invariant.** Tailwind's runtime (if used) would violate the zero `.js` in `dist/`
   invariant. Static CSS generation is fine, but the utility approach adds no value over tokens.

## Consequences

- Tailwind remains in `package.json` for its preflight and font aliases
- New components use scoped `<style>` with CSS custom properties, not utility classes
- Do not remove Tailwind reflexively — it works and adds no runtime cost
- If a future feature benefits from utilities (e.g. rapid prototyping), use them selectively

## References

- `src/styles/global.css` — the real token layer
- `src/data/theme.ts` — palette definitions
- `package.json` — Tailwind dependency
