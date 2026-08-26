---
name: ui-ux-design
description: Design intelligence, UI/UX architecture, responsive design system guidelines, typography, micro-interactions, layout composition, and accessibility standards.
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
   - Use the project's token layer (`skills/design-tokens/`) for all visual values.
   - Subtle multi-layered shadows for depth.
   - Glassmorphism & backdrop filters with graceful fallbacks.

4. **Micro-Interactions & Animation**:
   - Smooth easing curves (`cubic-bezier(0.16, 1, 0.3, 1)` or `ease-out`).
   - Hover lifts, scale effects, glowing borders, active state feedback.
   - Staggered entry animations.
   - Strict adherence to `prefers-reduced-motion` for accessibility.

5. **Iconography & Visual Anchors**:
   - Use crisp, consistent 24x24 or 20x20 vector SVG icons.
   - Icon + text pairing for all action buttons.
   - Status indicators (live status dot with subtle pulse animation).

6. **Print & Document Polish (PDF / Resume Export)**:
   - Clean typographical grid, crisp font pairing, and subtle divider accents.
   - High data density without visual clutter.
   - Explicit `@page` margins, zero cutoffs, clean page-break rules.
