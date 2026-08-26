---
name: creative-styling
description: Advanced CSS styling, animations, micro-interactions, and premium document/print styling. Project-specific guidance in design-tokens skill.
---

# Creative Styling & Animation Skill

## Philosophy

This skill provides generic CSS styling guidance. For project-specific token usage, contrast
requirements, and palette rules, load `skills/design-tokens/` first.

## Animations & Keyframes

```css
@keyframes pulse-subtle {
	0%,
	100% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.08);
		opacity: 0.75;
	}
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

**Never nest `@media` inside `@keyframes`** — CSS parsers silently drop it.

## Interactive UI Components

- **Buttons**: Smooth transitions (`all 0.2s cubic-bezier(0.16, 1, 0.3, 1)`), hover elevation, active press scale (`0.98`).
- **Cards**: Hover border glow, subtle elevation shadow transition.
- **Badges**: Monospace tags with pill border-radius, soft background tint.

## Print & Document CSS

- Print stylesheets must balance aesthetics and ATS readability.
- Elegant typography hierarchy with crisp weights.
- Subtle primary accent borders separating sections.
- Compact bullets with refined line-height (1.4 - 1.45).
- **The print page uses a fixed palette — do not use theme tokens.**

## Reduced Motion

Always respect `prefers-reduced-motion`. This project has a killswitch in `global.css:366-376`
that disables all CSS transitions and animations.
