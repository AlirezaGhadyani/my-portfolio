---
name: creative-styling
description: Advanced CSS styling, Tailwind v4 configurations, fluid typography, dark/light theme perfection, glow/glass effects, animations, micro-interactions, and premium document/print styling.
---

# Creative Styling & Animation Skill

## Implementation Guide

### 1. Theme Variables & Gradients
- Define semantic color palettes with dark/light mode balance:
  - Backgrounds: Canvas, Surface, Elevated Surface, Overlay.
  - Borders: Subtle (`hsl(... / 0.08)`), Default (`hsl(... / 0.15)`), Active/Focus.
  - Accents: Primary brand gradient, subtle badge backgrounds (`hsl(accent / 0.1)`), glowing hover halos.
  - Subtle noise / grid / ambient glow backgrounds for hero sections.

### 2. Modern Animations & Keyframes
```css
@keyframes pulse-subtle {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.75; }
}

@keyframes float-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 3. Interactive UI Components
- **Buttons**: Smooth transitions (`all 0.2s cubic-bezier(0.16, 1, 0.3, 1)`), hover elevation, subtle inner highlight, active press scale (`0.98`).
- **Cards**: Hover border glow (`border-color: var(--accent)`), subtle elevation shadow transition, interactive tags.
- **Badges**: Monospace tags with pill border-radius, soft background tint, accent text color.

### 4. Resume & Print CSS Excellence
- Print stylesheets must balance aesthetics and ATS machine readability:
  - Elegant typography hierarchy with crisp weights (Bold 700 headers, Medium 500 company names, Regular 400 body).
  - Subtle primary accent borders separating sections.
  - Clean two-column meta items (Role / Date / Location).
  - Compact bullets with refined line-height (1.4 - 1.45).
