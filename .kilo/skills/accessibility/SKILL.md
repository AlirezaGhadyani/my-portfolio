---
name: accessibility
description: Accessibility patterns, ARIA conventions, focus management, and reduced-motion support.
---

# Accessibility Skill

## What patterns does this project use

- `prefers-reduced-motion` killswitch in `global.css:366-376` — disables all transitions
- `data-motion="reduced"` attribute for JS-initiated motion reduction
- `:focus-visible` outline in `global.css:301-304` — 2px solid accent
- `.sr-only` utility class for visually-hidden content
- `aria-current="page"` on active nav links
- `aria-pressed` on filter chips
- `aria-describedby` linking inputs to error spans
- `aria-invalid` set/removed dynamically on validation

## What is forbidden

- `aria-label` on elements without a semantic role (ignored by AT)
- `aria-live` on `<button>` elements (announces own label changes)
- `aria-label` describing current state instead of next action (theme toggle)
- Focus traps without Escape-to-close
- Missing `inert` on background content when modal/drawer is open
- `scroll-behavior: smooth` surviving reduced-motion (add `html` to selector)

## What to inspect first

1. `src/components/ThemeToggle.astro` — aria-label must describe next action
2. `src/components/PaletteSelector.astro` — proper menu/menuitemradio or disclosure pattern
3. `src/components/ContactSection.astro` — form validation, error announcements, focus management
4. `src/components/SiteHeader.astro` — mobile drawer focus trap, `aria-current`
5. `src/styles/global.css` — reduced-motion, focus-visible, sr-only

## What commonly goes wrong

- Theme toggle label inverted (says "switch to dark" when already in dark mode)
- Palette popup uses `role="dialog"` without focus trap — use `menu`/`menuitemradio` or native `popover`
- Contact form errors not linked to inputs (`aria-describedby` missing)
- Mobile drawer has no focus trap — page behind is interactive
- JS breakpoint `768` vs CSS `48rem` — desyncs under root font size changes
- `scroll-behavior: smooth` not disabled for `html` element in reduced-motion

## Validation required

```bash
pnpm test:e2e    # Playwright + axe-core
# Manual: Orca/NVDA screen reader pass
# Keyboard-only navigation test
```
