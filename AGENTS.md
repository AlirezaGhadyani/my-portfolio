## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Quick routing

| Task type | Load these files | Then run |
| --- | --- | --- |
| Resume data / schema change | `knowledge/data-model.md` → `src/data/schema.ts` → `src/domain/present.ts` → all 3 renderers | `/resume-check` |
| UI / component change | `knowledge/design-system.md` → `knowledge/conventions.md` → the component | `/tokens` → `/a11y` |
| Print / PDF change | `knowledge/document-pipeline.md` → `src/pages/print/resume/[...variant].astro` → `scripts/generate-pdf.ts` | `/resume-check` |
| Contact / headers change | `knowledge/edge-and-secrets.md` → `functions/api/contact.ts` → `contact.test.ts` → `public/_headers` | `pnpm test` |
| Anything else | `knowledge/architecture.md` | `/plan` |

## Invariants (never violate)

1. `src/data/**` imports nothing outside itself — it is the domain layer.
2. `resume.ts` is the single source of truth for resume facts.
3. `dist/` must contain zero `.js` files — verify after any UI change.
4. A resume fact added to one renderer must be added to all three (web, print, text).
5. The print document does not use theme tokens — it is a fixed-palette A4 artifact.
6. Do not merge the print and web renderers — share `present.ts`, not markup.
7. No new breakpoint values — use the 4 defined in `knowledge/design-system.md`.
8. CSS `@media` may never be nested inside `@keyframes` — parsers silently drop it.

## Verification gate

```bash
pnpm check && pnpm test && pnpm lint && pnpm format:check && pnpm build:all && find dist -name "*.js" | wc -l
```

## Agents

| Agent | Owns |
| --- | --- |
| `data-steward` | `src/data/**`, `src/domain/present.ts`, content-collection integrity |
| `frontend` | `src/components/**`, `src/pages/**` (non-print), `src/styles/`, `src/layouts/**` |
| `document-engineer` | `pages/print/**`, `styles/print.css`, `scripts/generate-{pdf,txt}.ts` |
| `edge-security` | `functions/**`, `public/_headers`, `wrangler.toml`, `.env.example` |

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
