---
name: audit-architecture
description: Check for regressions against the architectural invariants.
---

# /audit-architecture

Check for regressions against the architectural invariants.

## Usage

```
/audit-architecture
```

## Behavior

1. Load `knowledge/architecture.md` and `rules.md`
2. Check each invariant:

   **Invariant 1: `src/data/**` imports nothing outside itself**
   ```bash
   grep -rn "from \"[.][.]" src/data/ | grep -v "from \"[.][.]\/data\/"
   ```

   **Invariant 2: `resume.ts` is single source of truth**
   Check for hardcoded identity/dates/tech in components:
   ```bash
   grep -rn "Jordan Avery\|jordan.avery\|example\.com" src/components/ src/pages/ src/layouts/
   ```

   **Invariant 3: `dist/` contains zero `.js` files**
   ```bash
   find dist -name "*.js" | wc -l
   ```

   **Invariant 4: Cross-renderer consistency**
   ```bash
   tsx scripts/verify-outputs.ts
   ```

   **Invariant 5: Print uses fixed palette**
   ```bash
   grep -n "var(--" src/pages/print/
   ```

   **Invariant 7: No new breakpoints**
   ```bash
   grep -n "@media" src/components/*.astro src/pages/*.astro | grep -v "48rem\|42rem\|35rem\|52rem"
   ```

   **Invariant 8: No @media inside @keyframes**
   ```bash
   # Check CSS files for nested @media in @keyframes
   ```

3. Report findings

## Rules

- Every violation is a regression, even if tests pass
- Cite file:line for every finding
- Suggest the fix based on the relevant knowledge doc
