---
name: cloudflare-edge
description: Patterns for Cloudflare Pages Functions, security headers, environment variables, and edge runtime.
---

# Cloudflare Edge Skill

## What patterns does this project use

- Cloudflare Pages Functions (`functions/api/contact.ts`)
- `onRequestPost` handler exported for the contact endpoint
- Environment variables via `env` parameter (Cloudflare bindings)
- `public/_headers` for security headers (Cloudflare Pages convention)
- Memory-based rate limiting (fallback when KV not bound)

## What is forbidden

- Fail-open behavior — missing secrets must return 503
- Leaking which variable is missing to the client
- Falling back to `'127.0.0.1'` for client IP (collapses all unknowns)
- `Cache-Control: immutable` on mutable URLs
- Missing `Strict-Transport-Security` header
- `onclick` handlers in HTML (requires `unsafe-inline` in CSP)

## What to inspect first

1. `functions/api/contact.ts` — the contact endpoint
2. `functions/api/contact.test.ts` — endpoint tests
3. `public/_headers` — security headers
4. `src/lib/validation.ts` — shared validation limits
5. `.env.example` — environment variable documentation

## What commonly goes wrong

- `memoryRateLimiter` is per-isolate — near-useless in production
- KV rate limiter is eventually consistent (~60s) — concurrent requests all pass
- `vi.restoreAllMocks()` does not undo `global.fetch = vi.fn()` — use `vi.stubGlobal()` + `vi.unstubAllGlobals()`
- Honeypot check must come before rate-limit check
- Control characters in `name` can inject email headers — strip before subject

## Environment variables

| Variable | Scope | Required |
| --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | build-time | Yes (widget not rendered without) |
| `TURNSTILE_SECRET_KEY` | runtime | **Yes (503 if missing)** |
| `RESEND_API_KEY` | runtime | **Yes (503 if missing)** |
| `CONTACT_TO_EMAIL` | runtime | No (falls back to example.com) |
| `CONTACT_FROM_EMAIL` | runtime | No (falls back to resend.dev) |
| `RATE_LIMIT_KV` | runtime binding | No (falls back to memory) |

## Validation required

```bash
pnpm test          # contact.test.ts
pnpm build:all     # headers copied to dist/
cat dist/_headers  # verify security headers
```
