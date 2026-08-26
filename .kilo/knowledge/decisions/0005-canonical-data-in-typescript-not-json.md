# ADR-0005: Canonical Data in TypeScript, Not JSON

**Status:** Accepted  
**Date:** 2026-08-25  
**Deciders:** Architecture remediation plan (T5.4)

## Context

Resume facts (identity, experience, projects, skills, education, certifications) could be stored
in JSON files, a CMS, or a database. The project uses TypeScript files with Zod parse-at-load.

## Decision

Store canonical resume data in `.ts` files with Zod validation at module load time.

```ts
// src/data/resume.ts
export const resumeData: ResumeData = ResumeDataSchema.parse({
  identity: { ... },
  experience: [...],
  ...
});
```

## Rationale

1. **Build-time failure on invalid data.** `ResumeDataSchema.parse()` runs at build time. If a
   field is missing, wrong type, or malformed, the build fails immediately with a clear error.
   JSON would require a separate validation step.
2. **Type safety.** TypeScript infers types from Zod schemas. No hand-written interfaces to
   maintain or drift from the data.
3. **No runtime cost.** Data is parsed once at module load, not on every request.
4. **Simplicity.** No CMS, no API, no database. The data is small (one person's resume) and
   changes infrequently.
5. **Co-location.** Data files live next to their schemas in `src/data/`. Import paths are short
   and explicit.

## Costs (accepted)

- **Not editable by non-developers.** Changing resume facts requires editing TypeScript.
- **No content management UI.** No admin panel, no visual editor.
- **Rebuild required.** Data changes require a full rebuild and deploy.

These costs are acceptable for a personal portfolio with infrequent data changes.

## Consequences

- `src/data/**` is the domain layer — it imports nothing outside itself
- `resume.ts` is the single source of truth — never hardcode facts elsewhere
- Zod schemas define the types — do not duplicate with hand-written interfaces
- Content collections (`src/content/`) use Astro's `astro/zod` (Zod 3) — this is a known
  inconsistency with the data layer's `zod` (Zod 4)

## References

- `src/data/schema.ts` — Zod schemas
- `src/data/resume.ts` — canonical data
- `src/content.config.ts` — content collection schema (uses `astro/zod`)
