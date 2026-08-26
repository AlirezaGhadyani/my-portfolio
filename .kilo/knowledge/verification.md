# Verification

The verification gate — what each command catches and when to run it.

## The gate (run in order — stop at first failure)

```bash
pnpm check              # Astro type-check — 0 errors
pnpm test               # Vitest — all pass (schema, variants, present, contrast, tokens, contact)
pnpm lint               # ESLint — 0 errors (includes .astro files since T0.2)
pnpm format:check       # Prettier — 0 files (only valid after T0.3)
pnpm build:all          # 8 HTML routes + sitemap + txt + 4 PDFs + OG PNG
find dist -name "*.js" | wc -l   # must be 0
tsx scripts/verify-outputs.ts     # cross-renderer consistency
```

## What each command catches

| Command | Catches | Failure means |
| --- | --- | --- |
| `pnpm check` | Type errors in `.astro` files, missing imports, wrong props | Broken component wiring |
| `pnpm test` | Schema validation, variant logic, date formatting, contrast ratios, token compliance, contact endpoint | Data model or logic regression |
| `pnpm lint` | ESLint rules across all files including `.astro` | Code quality / style violation |
| `pnpm format:check` | Prettier formatting | Inconsistent formatting |
| `pnpm build:all` | Full build pipeline including PDF generation | Build breakage, PDF pagination failure |
| `find dist -name "*.js"` | Client-side JavaScript | Zero-JS invariant violated |
| `verify-outputs.ts` | Cross-renderer consistency | Resume data divergence |

## verify-outputs.ts checks

1. **PDF page counts** — each variant matches its `pdfPages` declaration
2. **Company presence** — every company in `resumeData.experience` appears in HTML, all 4 PDFs, and ATS text
3. **Experience order** — identical across all outputs
4. **No raw ISO dates** — `/\b\d{4}-\d{2}\b/` must not match in ATS text or PDFs
5. **ATS ASCII** — `resume-ats.txt` is pure ASCII
6. **OG PNG exists** — `dist/og-image.png` is present
7. **Case study integrity** — every `hasCaseStudy: true` project has a matching `.md` file
8. **Sitemap integrity** — every sitemap URL has a built route

## When to run

- **After any change:** full gate
- **After data/present.ts change:** `pnpm test` + `pnpm build:all` + `verify-outputs.ts`
- **After component/style change:** `pnpm check` + `pnpm lint` + `pnpm build` + `find dist -name "*.js"`
- **After contact/headers change:** `pnpm test` + `pnpm build:all`
- **After print/PDF change:** `pnpm build:all` + `verify-outputs.ts`

## Baseline snapshot

`scripts/snapshot-baseline.ts` records the current state to `.baseline/` (gitignored).
Run before major refactoring to have a diff target.

## CI

The CI pipeline (`.github/workflows/ci.yml`) runs the same gate on every push to `main`.
It installs pnpm, Playwright Chromium, and runs all commands in order.
