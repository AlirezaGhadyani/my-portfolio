# Color Palette Customization System Architecture & Implementation Plan

## 1. Overview & Objectives

This document details the architectural design and execution plan for introducing a curated, accessible, developer-configurable color palette customization system to the portfolio application.

The solution enhances the existing dual-mode theme system (`data-theme="light|dark"`) by layering a palette dimension (`data-palette="amber|terracotta|emerald|ocean|amethyst"`), persisted in local storage with zero flash-of-unauthenticated/un-styled content (zero-FOUC), with developer defaults configured via single-source-of-truth configuration and full validation.

---

## 2. Current Architecture Review & Insights

### Theme Architecture

- **Root Layout (`src/layouts/Layout.astro`)**: Contains a synchronous zero-FOUC inline `<head>` script reading `localStorage.getItem('theme')` and falling back to `(prefers-color-scheme: dark)`. Sets `data-theme="light|dark"` on `<html>`.
- **Global Design Tokens (`src/styles/global.css`)**: Defines tokens for `:root` / `html[data-theme="light"]` and `html[data-theme="dark"]`. The primary theme-reactive variables are:
  - `--accent`: Primary interaction and branding color.
  - `--accent-hover`: Hover state of primary accent.
  - `--accent-muted`: Soft tinted background for chips, active highlights, tags.
  - `--accent-glow`: Alpha-translucent glow for box-shadows, hero radial gradient.
  - `--border-active`: Interactive border outline color.
- **Header & Controls (`src/components/SiteHeader.astro`, `src/components/ThemeToggle.astro`)**: The header actions area currently houses the `ThemeToggle` button and mobile menu toggle.
- **Print Styles (`src/styles/print.css`, `src/pages/print/resume/[...variant].astro`)**: Print uses explicit fixed light styling to guarantee crisp ATS and PDF output.

---

## 3. Data Model, Definitions & Developer Configuration

### Single Source of Truth: `src/data/theme.ts`

We establish a dedicated typed configuration and palette registry module `src/data/theme.ts` backed by Zod schema validation.

```typescript
import { z } from "zod";

export const PaletteTokenGroupSchema = z.object({
	accent: z.string(),
	accentHover: z.string(),
	accentMuted: z.string(),
	accentGlow: z.string(),
	borderActive: z.string(),
});

export const PaletteDefinitionSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	light: PaletteTokenGroupSchema,
	dark: PaletteTokenGroupSchema,
});

export const ThemeConfigSchema = z.object({
	defaultPalette: z.string(),
	palettes: z.record(z.string(), PaletteDefinitionSchema),
});
```

### Curated Palette Catalog (5 Distinct, High-Contrast Harmonized Palettes)

Each palette defines balanced tokens for both `light` and `dark` modes meeting WCAG AA contrast (≥ 4.5:1 against respective surfaces):

1. **Terracotta / Amber (Default - "Warm Ochre / Ember")**
   - _Light_: `hsl(13 68% 46%)` / hover `hsl(13 68% 38%)` / muted `hsl(13 65% 93%)` / glow `hsl(13 68% 46% / 0.15)` / border `hsl(13 68% 46%)`
   - _Dark_: `hsl(33 85% 62%)` / hover `hsl(33 90% 72%)` / muted `hsl(33 85% 62% / 0.14)` / glow `hsl(33 85% 62% / 0.22)` / border `hsl(33 85% 62%)`
2. **Ocean / Cobalt ("Nordic Slate & Azure")**
   - _Light_: `hsl(217 91% 45%)` / hover `hsl(217 91% 37%)` / muted `hsl(217 90% 94%)` / glow `hsl(217 91% 45% / 0.15)` / border `hsl(217 91% 45%)`
   - _Dark_: `hsl(212 95% 64%)` / hover `hsl(212 95% 74%)` / muted `hsl(212 95% 64% / 0.14)` / glow `hsl(212 95% 64% / 0.22)` / border `hsl(212 95% 64%)`
3. **Emerald / Jade ("Forest & Mint")**
   - _Light_: `hsl(160 84% 34%)` / hover `hsl(160 84% 28%)` / muted `hsl(160 70% 93%)` / glow `hsl(160 84% 34% / 0.15)` / border `hsl(160 84% 34%)`
   - _Dark_: `hsl(158 75% 52%)` / hover `hsl(158 80% 64%)` / muted `hsl(158 75% 52% / 0.14)` / glow `hsl(158 75% 52% / 0.22)` / border `hsl(158 75% 52%)`
4. **Amethyst / Violet ("Neon Iris & Berry")**
   - _Light_: `hsl(270 70% 48%)` / hover `hsl(270 70% 40%)` / muted `hsl(270 65% 94%)` / glow `hsl(270 70% 48% / 0.15)` / border `hsl(270 70% 48%)`
   - _Dark_: `hsl(270 85% 68%)` / hover `hsl(270 85% 78%)` / muted `hsl(270 85% 68% / 0.14)` / glow `hsl(270 85% 68% / 0.22)` / border `hsl(270 85% 68%)`
5. **Rose / Crimson ("Subtle Ruby")**
   - _Light_: `hsl(346 77% 46%)` / hover `hsl(346 77% 38%)` / muted `hsl(346 70% 94%)` / glow `hsl(346 77% 46% / 0.15)` / border `hsl(346 77% 46%)`
   - _Dark_: `hsl(346 88% 65%)` / hover `hsl(346 90% 75%)` / muted `hsl(346 88% 65% / 0.14)` / glow `hsl(346 88% 65% / 0.22)` / border `hsl(346 88% 65%)`

### Developer Default Configuration

- Exported as `defaultPalette: 'amber'` (or whichever ID is configured) in `themeConfig`.
- Zod schema validation ensures `palettes[defaultPalette]` exists at build and test time; throws descriptive build error if misconfigured.

---

## 4. Token Integration & Cascading Rules

### CSS Token Architecture in `src/styles/global.css`

Base theme mode provides default variables. Adding `data-palette="[id]"` overrides `--accent`, `--accent-hover`, `--accent-muted`, `--accent-glow`, and `--border-active`:

```css
/* Base default fallback */
html[data-theme="light"],
:root {
	/* ... default amber tokens ... */
}
html[data-theme="dark"] {
	/* ... default amber dark tokens ... */
}

/* Explicit Palette Overrides */
html[data-palette="ocean"][data-theme="light"] {
	--accent: hsl(217 91% 45%);
	--accent-hover: hsl(217 91% 37%);
	--accent-muted: hsl(217 90% 94%);
	--accent-glow: hsl(217 91% 45% / 0.15);
	--border-active: hsl(217 91% 45%);
}
html[data-palette="ocean"][data-theme="dark"] {
	--accent: hsl(212 95% 64%);
	--accent-hover: hsl(212 95% 74%);
	--accent-muted: hsl(212 95% 64% / 0.14);
	--accent-glow: hsl(212 95% 64% / 0.22);
	--border-active: hsl(212 95% 64%);
}
/* (Repeat for all palettes: emerald, amethyst, rose, etc.) */
```

---

## 5. Storage, Resolution Precedence & Zero-FOUC Execution

### Resolution Precedence

1. **Runtime Interaction**: User clicks a palette in the selector -> Updates `<html>` attribute `data-palette` and saves to `localStorage.setItem('palette', id)`.
2. **Persisted Preference**: On initial script execution, `localStorage.getItem('palette')` is evaluated. If present and matching one of `['amber', 'ocean', 'emerald', 'amethyst', 'rose']`, it is applied.
3. **Invalid / Stale Stored Key**: If the stored key no longer exists in predefined valid palettes, the script clears/replaces it with the developer default.
4. **Developer Default Fallback**: If no key is in `localStorage`, the developer-configured `themeConfig.defaultPalette` is set.
5. **Reset to Default Action**: Clears `localStorage.removeItem('palette')` and applies `themeConfig.defaultPalette`.

### Zero-FOUC Implementation in `src/layouts/Layout.astro`

The synchronous `<head>` script is updated to resolve both `data-theme` and `data-palette` prior to first DOM paint:

```html
<script is:inline define:vars={{ defaultPalette: themeConfig.defaultPalette, validPalettes: Object.keys(themeConfig.palettes) }}>
  (function () {
    var root = document.documentElement;
    // Motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.setAttribute('data-motion', 'reduced');
    }
    // Theme mode
    var storedTheme = null;
    try { storedTheme = localStorage.getItem('theme'); } catch(e) {}
    var dark = storedTheme === 'dark' || (storedTheme === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');

    // Palette resolution
    var storedPalette = null;
    try { storedPalette = localStorage.getItem('palette'); } catch(e) {}
    if (!storedPalette || validPalettes.indexOf(storedPalette) === -1) {
      storedPalette = defaultPalette;
    }
    root.setAttribute('data-palette', storedPalette);
  })();
</script>
```

---

## 6. UX / UI Placement & Component Architecture

### UI Placement Strategy

- Located in `SiteHeader.astro` actions bar, directly next to `ThemeToggle.astro`.
- Combined into a unified appearance control group:
  - `PaletteSelector.astro`: Popover dropdown button with a compact color swatch icon (`Palette` SVG icon) and indicator badge.
  - On click / keyboard trigger: Opens an accessible popover containing palette preview cards, preview swatches, active check indicator, and a subtle "Reset to default" button.
- Mobile Navigation Drawer (`nav-mobile`): Contains a dedicated "Theme & Accent" settings section within the mobile drawer for seamless touch navigation.

### Visual Design of Palette Cards

- **Dimensions & Touch Targets**: Minimum 44x44px hit targets.
- **Visual Feedback**:
  - Color dot swatch cluster showing light & dark harmony.
  - Palette name & brief mood descriptor ("Nordic Slate", "Warm Ochre", etc.).
  - Selected indicator: Clean SVG checkmark badge with active border outline.
  - "Default" chip badge identifying developer default.
- **Keyboard & Focus**: Complete `tabindex="0"`, arrow key navigation, `aria-haspopup="dialog"`, `aria-expanded`, and `aria-selected` semantic attributes. Closes cleanly on `Escape` and outside click.

---

## 7. Migration, Edge Cases & Error Handling

1. **Developer changes default from `'amber'` to `'ocean'`**:
   - New visitors receive `'ocean'`.
   - Existing users who explicitly selected `'emerald'` retain `'emerald'`.
   - Users who never customized inherit the new default.
2. **Palette Deprecation / Renaming**:
   - If a saved palette ID is removed, validation rejects it and gracefully falls back to `defaultPalette` without JS error.
3. **Private Browsing / Blocked LocalStorage**:
   - `try / catch` wraps all `localStorage` access so the UI still functions at runtime.
4. **Print Styles Compatibility**:
   - Print stylesheet remains isolated, preserving crisp monochrome / formal color contrast.

---

## 8. Verification & Testing Strategy

1. **Unit & Schema Tests (`src/data/theme.test.ts`)**:
   - Validate `ThemeConfigSchema` parses properly.
   - Assert `defaultPalette` exists within `palettes`.
   - Validate WCAG contrast mathematical ratios for all light & dark tokens against canvas.
2. **Component & Integration Tests**:
   - Verify zero-FOUC inline script syntax and attribute application.
   - Test localStorage persistence and event emission across mode toggle and palette change.
3. **Build & Lint Checks**:
   - `astro check`, `vitest run`, `eslint .`, `prettier --check .`.

---

## 9. Implementation Plan Task Breakdown

1. **Theme Schema & Registry (`src/data/theme.ts`, `src/data/theme.test.ts`)**:
   - Create Zod schemas, palette definitions, and developer default export.
   - Add unit tests verifying schema integrity and valid default palette resolution.
2. **Global CSS Update (`src/styles/global.css`)**:
   - Add CSS rules for `html[data-palette="..."][data-theme="..."]`.
3. **Root Layout Zero-FOUC Update (`src/layouts/Layout.astro`)**:
   - Inject `data-palette` resolution into `<head>` inline script.
4. **Palette Selector Component (`src/components/PaletteSelector.astro`)**:
   - Build accessible popover selector with swatches, preview cards, keyboard navigation, reset button.
5. **Header & Mobile Integration (`src/components/SiteHeader.astro`)**:
   - Integrate `PaletteSelector` into desktop header actions and mobile navigation drawer.
6. **Verification & Quality Checks**:
   - Run tests, linter, formatter, typecheck, and dev build.
