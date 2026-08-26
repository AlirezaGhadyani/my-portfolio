# ADR-0003: Inline Scripts Instead of Islands

**Status:** Accepted  
**Date:** 2026-08-25  
**Deciders:** Architecture remediation plan (T4.1, T5.4)

## Context

The site uses `is:inline` scripts for theme toggle, palette selector, and print button bindings.
Astro's islands architecture (framework components with `client:*` directives) was considered
but not adopted.

## Decision

Use `is:inline` scripts for interactive behavior. Do not use islands (React/Vue/Svelte components
with `client:load` or similar).

## Rationale

1. **Zero-JS invariant.** Islands ship framework runtime JavaScript to the client. The site's
   core invariant is `dist/` containing zero `.js` files. `is:inline` scripts are inlined into
   the HTML — they count as inline JS, not separate `.js` files.
2. **Simplicity.** The interactive surface is small: theme toggle, palette selector, mobile
   drawer, print button. Each is <100 lines of vanilla JS.
3. **Performance.** No framework hydration cost. Scripts execute immediately.
4. **No build step.** `is:inline` scripts bypass Astro's bundler — they are emitted as-is.

## Costs (accepted)

- **Not type-checked.** `is:inline` scripts cannot use TypeScript. Errors are runtime-only.
- **Not linted.** ESLint does not process inline script blocks.
- **Not minified.** Scripts are emitted at full size.
- **Duplicated per instance.** If a component renders twice (e.g. desktop + mobile ThemeToggle),
   its `is:inline` script is emitted twice. This was mitigated by hoisting scripts to `Layout.astro`
   (T4.1), reducing duplication from 3,048 bytes to zero.

## Mitigations

- Scripts are short and manually reviewed
- `dataset.*Bound` guards prevent double-initialization
- Scripts hoisted to `Layout.astro` to avoid per-component duplication
- `eslint-plugin-astro` catches other issues in `.astro` files

## Consequences

- Interactive behavior is vanilla JS, not framework code
- No client-side routing or hydration
- Scripts are duplicated if components render multiple times (mitigated by hoisting)
- A future agent must NOT convert these to islands without revisiting this ADR

## References

- `src/layouts/Layout.astro` — hoisted scripts
- `src/components/ThemeToggle.astro` — theme toggle with `is:inline`
- `src/components/PaletteSelector.astro` — palette selector with `is:inline`
