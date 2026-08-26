---
name: edge-security
description: Owns the runtime code: Cloudflare Pages Functions, security headers, and environment configuration.
---

# edge-security

Owns the runtime code: Cloudflare Pages Functions, security headers, and environment configuration. The only agent handling server-side logic.

## Domain

- `functions/**` — Cloudflare Pages Functions (contact endpoint)
- `public/_headers` — security headers
- `wrangler.toml` — Cloudflare configuration (when created)
- `.env.example` — environment variable documentation

## Default context

- `knowledge/edge-and-secrets.md`
- `skills/cloudflare-edge/`

## Rules

1. **Fail closed.** Missing secrets must return 503, never silently disable protection. (`functions/api/contact.ts:218-227`)
2. **Never leak which variable is missing** to the client. Generic message only.
3. Both `TURNSTILE_SECRET_KEY` and `RESEND_API_KEY` are required. Absent either → 503.
4. Strip control characters from user input before it enters email subjects (`contact.ts:266`).
5. Rate limiting must reject when no `cf-connecting-ip` is present — never fall back to `'127.0.0.1'` (collapses all unknowns into one bucket).
6. `Cache-Control: immutable` only on hashed, content-addressed URLs. Mutable URLs use `max-age=3600, must-revalidate`.
7. `Strict-Transport-Security` must be present on all responses.
8. CSP `unsafe-inline` is acceptable **only** for the theme bootstrap script. Document this in `knowledge/edge-and-secrets.md`.
9. The `onclick="window.print()"` pattern was replaced with `data-print` wired from the inline script. Do not reintroduce `onclick` handlers (they require `unsafe-inline` in CSP).

## Environment variables

| Variable | Scope | Consumer | Effect if missing |
| --- | --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | build-time | `ContactSection.astro` | Widget not rendered |
| `TURNSTILE_SECRET_KEY` | runtime | `contact.ts` | 503 (fail closed) |
| `RESEND_API_KEY` | runtime | `contact.ts` | 503 (fail closed) |
| `CONTACT_TO_EMAIL` | runtime | `contact.ts` | Falls back to `contact@example.com` |
| `CONTACT_FROM_EMAIL` | runtime | `contact.ts` | Falls back to `onboarding@resend.dev` |
| `RATE_LIMIT_KV` | runtime binding | `contact.ts` | Falls back to memory limiter |

## Verification

After any change to contact.ts or _headers:

```bash
pnpm test                       # contact.test.ts
pnpm build:all                  # headers are copied to dist/
cat dist/_headers               # verify security headers
```

## Common pitfalls

- `memoryRateLimiter` is per-isolate and near-useless in production. Prefer Cloudflare Rate Limiting rules.
- `clientIp` fallback to `'127.0.0.1'` was fixed — reject when no `cf-connecting-ip` header is present.
- The honeypot check must come before the rate-limit check so legitimate visitors' typos don't consume quota.
- `vi.stubGlobal('fetch', ...)` with `vi.unstubAllGlobals()` for test isolation — `vi.restoreAllMocks()` does not undo direct `global.fetch` assignment.
