# Folder Structure & Architecture Audit

## 1. Current-State Assessment

This is an **Astro 7 static portfolio + resume system** deployed to Cloudflare Pages. The architecture is well-defined:

- **Domain layer** (`src/data/`) — Zod schemas, canonical resume facts, variant configs, theme palettes. Imports nothing outside itself.
- **Presentation adapter** (`src/domain/present.ts`) — Pure functions for date formatting, ordering, display strings. Shared by all three renderers.
- **Three renderers** — Web (`src/components/` + `src/pages/`), Print/PDF (`src/pages/print/`), ATS text (`scripts/generate-txt.ts`).
- **Edge function** (`functions/api/contact.ts`) — Cloudflare Pages Function with Turnstile + Resend.
- **Build scripts** (`scripts/`) — PDF, TXT, sitemap, OG image generation + verification.
- **AI agent system** (`.kilo/`) — Knowledge base, agent definitions, commands, skills, plans.

The `src/` directory follows a clean layered architecture with explicit dependency rules documented in `.kilo/knowledge/architecture.md` and enforced by `.kilo/rules.md`.

**Verdict: The `src/` architecture is well-designed and should not be restructured.** The layer boundaries are clear, the dependency direction is correct, and the three-renderer pattern is an intentional architectural decision (ADR-0001).

## 2. Problems Found

### 2.1 `CLAUDE.md` at project root

- **Location:** `/CLAUDE.md`
- **Problem:** AI-tool-specific configuration file at the project root. Contains agent routing instructions that duplicate `.kilo/README.md` and `AGENTS.md`. This is a Claude Code convention file that clutters the root for anyone using a different tool.
- **Severity:** Low
- **Worth fixing:** Yes — trivial move, reduces root clutter.

### 2.2 `docs/` directory is dead weight

- **Location:** `/docs/`
- **Problem:** Contains `phase-status.md` (explicitly marked "Superseded") and `adr/` with only ADR-0002 and ADR-0003 (the complete set of 5 ADRs lives in `.kilo/knowledge/decisions/`). This directory is stale, incomplete, and duplicates content that has migrated to the knowledge base.
- **Severity:** Medium
- **Worth fixing:** Yes — removes confusion about where documentation lives.

### 2.3 `src/assets/` is empty

- **Location:** `/src/assets/`
- **Problem:** Empty directory. Astro's `src/assets/` is conventionally used for images that need processing, but this project uses `public/` for all static assets. An empty directory with no clear purpose.
- **Severity:** Low
- **Worth fixing:** Yes — remove it. If needed later, it can be recreated.

### 2.4 `src/lib/` is very thin

- **Location:** `/src/lib/validation.ts`
- **Problem:** Contains a single 7-line file (`CONTACT_LIMITS` constant) used only by `functions/api/contact.ts`. A `lib/` directory for one constant object is over-structured. The constant could live closer to its consumer.
- **Severity:** Low
- **Worth fixing:** Optional — the current placement is not harmful, just unnecessary indirection.

### 2.5 `AGENTS.md` and `.kilo/README.md` overlap

- **Location:** `/AGENTS.md` and `/.kilo/README.md`
- **Problem:** Both contain the same routing table, invariants, and agent definitions. `AGENTS.md` is a convention for Claude Code / Cursor / similar tools. `.kilo/README.md` is the Kilo-specific entry point. Maintaining two copies risks drift.
- **Severity:** Low
- **Worth fixing:** Optional — `AGENTS.md` at root is a cross-tool convention. Could be symlinked or kept as a thin pointer to `.kilo/`.

### 2.6 `pnpm-workspace.yaml` naming

- **Location:** `/pnpm-workspace.yaml`
- **Problem:** Contains only `allowBuilds` configuration, not workspace package definitions. The filename suggests a monorepo workspace, but this is a single-app project. This is a pnpm convention file — the name is standard even for non-monorepo projects.
- **Severity:** None (false positive)
- **Worth fixing:** No — this is correct pnpm usage.

### 2.7 Root config file count

- **Location:** Project root
- **Problem:** 10 config files at root (`astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.js`, `.prettierrc.cjs`, `wrangler.toml`, `.env.example`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`). This is standard for a modern JS project — each tool expects its config at root.
- **Severity:** None
- **Worth fixing:** No — moving config files would break tooling.

### 2.8 `test-results/` directory

- **Location:** `/test-results/`
- **Problem:** Playwright test output directory. Gitignored. Harmless but could be recreated on demand.
- **Severity:** None
- **Worth fixing:** No — standard Playwright behavior.

## 3. Recommended Target Structure

The `src/` structure is already clean and should not change. The only changes are root-level cleanup:

```
portfolio/
├── .astro/                  # (generated, gitignored)
├── .baseline/               # (gitignored)
├── .env.example             # Environment config template
├── .git/
├── .github/
│   └── workflows/ci.yml
├── .gitignore
├── .kilo/                   # AI agent system
│   ├── README.md            # Entry point (consider making AGENTS.md a pointer here)
│   ├── agent/
│   ├── command/
│   ├── knowledge/
│   │   └── decisions/       # Complete ADR set (0001–0005)
│   ├── plans/
│   ├── rules.md
│   ├── skills/
│   └── ...
├── .prettierrc.cjs
├── .vscode/
├── AGENTS.md                # Cross-tool agent routing (keep at root)
├── README.md                # Project documentation
├── astro.config.mjs
├── e2e/                     # Playwright E2E tests
├── eslint.config.js
├── functions/
│   └── api/
│       ├── contact.ts
│       └── contact.test.ts
├── playwright.config.ts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── public/
│   ├── _headers
│   ├── favicon.ico
│   ├── favicon.svg
│   └── og-image.svg
├── scripts/
│   ├── generate-og-image.ts
│   ├── generate-pdf.ts
│   ├── generate-sitemap.ts
│   ├── generate-txt.ts
│   ├── lib/
│   │   ├── chromium.ts
│   │   └── static-server.ts
│   ├── serve-static.ts
│   ├── snapshot-baseline.ts
│   └── verify-outputs.ts
├── src/
│   ├── components/          # Web renderer (Astro components)
│   ├── content/             # Content collections (case studies)
│   ├── content.config.ts
│   ├── data/                # Domain layer (schemas, facts, variants, theme)
│   ├── domain/              # Presentation adapter
│   ├── layouts/             # Root Layout.astro
│   ├── lib/                 # Shared utilities
│   ├── pages/               # Routes
│   └── styles/              # Global CSS + print CSS + style tests
├── tsconfig.json
├── vitest.config.ts
└── wrangler.toml
```

**Changes from current:**

- Remove `CLAUDE.md` (or move to `.kilo/`)
- Remove `docs/` directory
- Remove `src/assets/` (empty)
- Optionally move `src/lib/validation.ts` → `functions/api/validation.ts`

## 4. Before → After Mapping

| Current                     | Proposed                                 | Reason                                                                              |
| --------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------- |
| `CLAUDE.md`                 | `.kilo/CLAUDE.md` (or delete)            | AI-tool-specific file doesn't belong at root                                        |
| `docs/adr/0002-tailwind.md` | Delete                                   | Superseded by `.kilo/knowledge/decisions/0002-tailwind-as-token-host-only.md`       |
| `docs/adr/0003-webfonts.md` | Delete                                   | Superseded by `.kilo/knowledge/decisions/0003-inline-scripts-instead-of-islands.md` |
| `docs/phase-status.md`      | Delete                                   | Explicitly marked "Superseded"                                                      |
| `docs/`                     | Delete directory                         | Empty after removing contents                                                       |
| `src/assets/`               | Delete directory                         | Empty, no files                                                                     |
| `src/lib/validation.ts`     | `functions/api/validation.ts` (optional) | Only consumer is `functions/api/contact.ts`                                         |

## 5. Architecture Improvements

**No architectural changes are needed.** The current architecture is well-designed:

- The domain layer boundary (`src/data/**` imports nothing outside itself) is clean and enforced.
- The three-renderer pattern with shared presentation adapter is intentional and well-documented.
- The build script pipeline has a clear, documented order dependency.
- The edge function is properly isolated from the static build.
- The design system has automated parity and contrast enforcement.

The only architectural observation worth noting:

**`src/lib/validation.ts` coupling:** The `CONTACT_LIMITS` constant in `src/lib/` is consumed only by `functions/api/contact.ts`. This creates a cross-boundary import from the edge function into `src/`. Moving it to `functions/api/validation.ts` would make the boundary cleaner, but this is a minor point — the constant is pure data with no dependencies.

## 6. Migration Sequence

1. **Delete `docs/` directory** — Remove `docs/phase-status.md`, `docs/adr/0002-tailwind.md`, `docs/adr/0003-webfonts.md`. All content is superseded by `.kilo/knowledge/`.
2. **Delete `src/assets/`** — Empty directory, no files to move.
3. **Move or delete `CLAUDE.md`** — Either move to `.kilo/CLAUDE.md` or delete if redundant with `AGENTS.md`.
4. **(Optional) Move `src/lib/validation.ts`** → `functions/api/validation.ts` and update the import in `functions/api/contact.ts`.
5. **Run verification gate** — `pnpm check && pnpm test && pnpm lint && pnpm format:check && pnpm build:all && find dist -name "*.js" | wc -l`

## 7. Risk Assessment

| Change               | Risk                                                  | Mitigation                                     |
| -------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| Delete `docs/`       | None — gitignored content is preserved in git history | Verify no imports reference docs/              |
| Delete `src/assets/` | None — empty directory                                | N/A                                            |
| Move `CLAUDE.md`     | Low — may affect Claude Code tool detection           | Test that Claude Code still finds instructions |
| Move `validation.ts` | Low — single import to update                         | Update import path in `contact.ts`             |

No risk of:

- Circular dependencies (no new imports)
- Broken imports (only `validation.ts` move affects one import)
- Build issues (no config changes)
- Runtime behavior changes (no logic changes)
- Test failures (no test changes needed)
- Deployment problems (no deployment config changes)

## 8. Final Recommendation

**Perform a light cleanup.**

The project's architecture is already well-designed. The `src/` directory structure is clean, the layer boundaries are correct, and the three-renderer pattern is intentional. The only issues are:

1. **`docs/` directory** — Dead weight, superseded by `.kilo/knowledge/`. Delete it.
2. **`CLAUDE.md` at root** — AI-tool-specific clutter. Move or delete.
3. **`src/assets/` empty** — Remove.
4. **`src/lib/validation.ts`** — Optional move to `functions/api/` for cleaner boundaries.

These are all low-effort, low-risk changes. There is no need for a moderate refactor or major restructuring. The project is well-organized and the architecture is sound.

**Priority order:**

1. Delete `docs/` (medium impact — removes confusion about documentation location)
2. Delete `src/assets/` (low impact — removes empty directory)
3. Move/delete `CLAUDE.md` (low impact — reduces root clutter)
4. Move `validation.ts` (optional — slightly cleaner boundary)
