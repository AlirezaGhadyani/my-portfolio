---
name: ui-ux-design
description: Design intelligence, UI/UX architecture, responsive design system guidelines, typography, micro-interactions, layout composition, and accessibility standards for modern web applications.
---

# UI / UX Design & Aesthetics Skill

## Philosophy & Core Principles

1. **Craft & Intentionality**:
   - Avoid generic, boilerplate "AI styling".
   - Establish a distinct visual identity with cohesive typography, calibrated whitespace, balanced contrast, and tasteful accents.
   - Use intentional hierarchy: Hero/Eyebrow -> Display Title -> Subtitle -> Content Groupings -> Actionable Targets.

2. **Responsive-First Architecture**:
   - Fluid typography using CSS `clamp()` for headings and body.
   - Responsive grids (`repeat(auto-fit, minmax(..., 1fr))`) and flex layouts with wrapping.
   - Mobile navigation with accessible drawers, touch targets (minimum 44x44px), and proper thumb-zone usability.
   - Elimination of horizontal overflow and layout shifts.

3. **Design Tokens & Visual Rhythm**:
   - 4px/8px consistent spacing scale (`0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`, `6rem`).
   - Unified radii system: `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`, `var(--radius-full)`.
   - Subtle multi-layered shadows for depth (`0 1px 2px`, `0 4px 12px`, `0 12px 32px` with alpha-blended shadow colors).
   - Glassmorphism & backdrop filters (`backdrop-filter: blur(12px)`) with graceful fallbacks.

4. **Micro-Interactions & Animation**:
   - Smooth easing curves (`cubic-bezier(0.16, 1, 0.3, 1)` or `ease-out`).
   - Hover lifts (`transform: translateY(-2px)`), scale effects, glowing borders, active state feedback.
   - Staggered entry animations (`fadeInUp`, subtle reveals).
   - Strict adherence to `prefers-reduced-motion` for accessibility.

5. **Iconography & Visual Anchors**:
   - Use crisp, consistent 24x24 or 20x20 vector SVG icons (Lucide / Feather style stroke icons).
   - Icon + text pairing for all action buttons (external link, download, email, github, theme toggle).
   - Status indicators (live status dot with subtle pulse animation).

6. **Print & Document Polish (PDF / Resume Export)**:
   - Clean typographical grid, crisp font pairing, and subtle divider accents.
   - High data density without visual clutter.
   - Explicit `@page` margins, zero cutoffs, clean page-break rules (`break-inside: avoid`).
