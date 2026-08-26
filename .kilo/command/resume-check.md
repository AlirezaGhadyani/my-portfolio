---
name: resume-check
description: Verify all 3 renderers produce consistent output.
---

# /resume-check

Verify all 3 renderers produce consistent output.

## Usage

```
/resume-check
```

## Behavior

1. Run `pnpm build:all` to rebuild all outputs
2. Run `tsx scripts/verify-outputs.ts` which checks:
   - PDF page counts match declarations
   - Every company appears in all outputs
   - Experience order is identical across outputs
   - No raw ISO dates in ATS text or PDFs
   - ATS text is pure ASCII
   - OG PNG exists
   - Case study integrity
   - Sitemap integrity
3. Report results

## If failures occur

- Page count mismatch → check `VariantConfig.pdfPages` vs actual content
- Company missing → check `present.ts:orderedExperience()` usage in all renderers
- ISO date leak → find raw `{item.startDate}` in templates, replace with `present.ts` call
- ASCII violation → check `generate-txt.ts:95` dash normalization
