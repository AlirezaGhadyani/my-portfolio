---
name: tokens
description: Check design token usage compliance.
---

# /tokens

Check design token usage compliance.

## Usage

```
/tokens [file or directory]
```

## Behavior

1. Load `knowledge/design-system.md` for the token inventory
2. Run `pnpm test` to execute `tokens.test.ts` and `contrast.test.ts`
3. If a file/directory is given, scan it for:
   - Raw `hsl()` or hex color literals (should be tokens)
   - Numeric `border-radius` values (should be `--radius-*` tokens)
   - Hardcoded `#ffffff`/`#fff` on accent backgrounds (should be `--on-accent`)
   - Hardcoded `#ef4444` (should be `--danger`)
   - Retired tokens (`--radius`, `--transition-smooth`, `--shadow-color`)
   - New breakpoint values (should use the 4 defined constants)
4. Report findings with file:line references

## Exceptions

- `src/pages/print/**` is exempt — it uses a fixed palette (ADR-0004)
- `global.css` and `theme.ts` are the token source — they contain the raw values
