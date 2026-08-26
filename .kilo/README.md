# .kilo — AI Engineering System

Entry point for AI agents working on this portfolio. Read this first.

## Quick routing

| Task type                   | Load these files                                                                                           | Then run            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------- |
| Resume data / schema change | `knowledge/data-model.md` → `src/data/schema.ts` → `src/domain/present.ts` → all 3 renderers               | `/resume-check`     |
| UI / component change       | `knowledge/design-system.md` → `knowledge/conventions.md` → the component                                  | `/tokens` → `/a11y` |
| Print / PDF change          | `knowledge/document-pipeline.md` → `src/pages/print/resume/[...variant].astro` → `scripts/generate-pdf.ts` | `/resume-check`     |
| Contact / headers change    | `knowledge/edge-and-secrets.md` → `functions/api/contact.ts` → `contact.test.ts` → `public/_headers`       | `pnpm test`         |
| Anything else               | `knowledge/architecture.md`                                                                                | `/plan`             |

## Invariants (never violate — see `rules.md` for details)

1. `src/data/**` imports nothing outside itself.
2. `resume.ts` is the single source of truth for resume facts.
3. `dist/` must contain zero `.js` files.
4. A resume fact added to one renderer must be added to all three.
5. The print document does not use theme tokens.
6. Do not merge the print and web renderers.
7. No new breakpoint values.
8. CSS `@media` may never be nested inside `@keyframes`.

## Agents

| Agent               | Owns                                                                             |
| ------------------- | -------------------------------------------------------------------------------- |
| `data-steward`      | `src/data/**`, `src/domain/present.ts`, content-collection integrity             |
| `frontend`          | `src/components/**`, `src/pages/**` (non-print), `src/styles/`, `src/layouts/**` |
| `document-engineer` | `pages/print/**`, `styles/print.css`, `scripts/generate-{pdf,txt}.ts`            |
| `edge-security`     | `functions/**`, `public/_headers`, `wrangler.toml`, `.env.example`               |

## Commands

| Command               | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| `/plan`               | Generate or update an implementation plan                   |
| `/verify`             | Run the full verification gate (§3 of the remediation plan) |
| `/review`             | Code review with architecture-awareness                     |
| `/audit-architecture` | Check for regressions against the invariants                |
| `/resume-check`       | Verify all 3 renderers produce consistent output            |
| `/a11y`               | Accessibility audit                                         |
| `/tokens`             | Check design token usage compliance                         |

## Directory structure

```
.kilo/
├── README.md              # This file — entry point + routing
├── rules.md               # Always/Never rules with file:line citations
├── agent/                 # Agent definitions (4 agents)
├── command/               # Command definitions
├── knowledge/             # Architecture, data model, design system docs
│   └── decisions/         # Architecture Decision Records
├── skills/                # Project-specific skill instructions
└── plans/                 # Implementation plans (existing)
```
