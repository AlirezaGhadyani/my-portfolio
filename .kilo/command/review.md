---
name: review
description: Code review with architecture-awareness.
---

# /review

Code review with architecture-awareness.

## Usage

```
/review [file or directory]
```

## Behavior

1. Load relevant knowledge files based on what's being reviewed:
   - Data files → `knowledge/data-model.md`
   - Components/pages → `knowledge/design-system.md`, `knowledge/conventions.md`
   - Print/PDF → `knowledge/document-pipeline.md`
   - Contact/headers → `knowledge/edge-and-secrets.md`
2. Check against the invariants in `rules.md`
3. Look for:
   - Hardcoded values that should be tokens
   - Inline date formatting that should use `present.ts`
   - Missing accessibility attributes
   - Security issues (fail-open, missing headers)
   - Cross-renderer consistency violations
4. Report findings with file:line references

## Rules

- Cite specific file:line for every finding
- Distinguish between "must fix" (invariant violation) and "should fix" (improvement)
- Never approve code that violates an invariant
