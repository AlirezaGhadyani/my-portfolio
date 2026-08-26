---
name: verify
description: Run the full verification gate.
---

# /verify

Run the full verification gate (§3 of the remediation plan).

## Usage

```
/verify
```

## Behavior

Run in order — stop at first failure:

```bash
pnpm check              # 0 errors
pnpm test               # all pass
pnpm lint               # 0 errors
pnpm format:check       # 0 files
pnpm build:all          # 8 routes + sitemap + txt + 4 PDFs + OG PNG
find dist -name "*.js" | wc -l   # must be 0
tsx scripts/verify-outputs.ts     # cross-renderer consistency
```

## Output

Report each command's output. If any fails, report the failure and stop.
If all pass, report "All checks passed" with a summary.
