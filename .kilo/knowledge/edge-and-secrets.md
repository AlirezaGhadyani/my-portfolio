# Edge & Secrets

Environment variables, the fail-open prohibition, KV limitations, and CSP rationale.

## Environment variables

| Variable | Scope | Consumer | Effect if missing |
| --- | --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | **build-time** | `ContactSection.astro` | Widget not rendered |
| `TURNSTILE_SECRET_KEY` | runtime | `contact.ts:218` | **503 (fail closed)** |
| `RESEND_API_KEY` | runtime | `contact.ts:252` | **503 (fail closed)** |
| `CONTACT_TO_EMAIL` | runtime | `contact.ts:263` | Falls back to `contact@example.com` |
| `CONTACT_FROM_EMAIL` | runtime | `contact.ts:264` | Falls back to `onboarding@resend.dev` |
| `RATE_LIMIT_KV` | runtime binding | `contact.ts` | Falls back to memory limiter |

**Critical:** A build without `PUBLIC_TURNSTILE_SITE_KEY` deployed against a runtime that has
`TURNSTILE_SECRET_KEY` set makes every submission fail with "Bot verification token is missing".

## Fail-open prohibition

Both `TURNSTILE_SECRET_KEY` and `RESEND_API_KEY` are **required**. Absent either → 503 with
generic message "Contact form is temporarily unavailable. Please email me directly."

Never silently disable protection. Never leak which variable is missing to the client.

Previous bugs (fixed in T1.1):
- Absent `RESEND_API_KEY` → messages silently discarded, user told "success"
- Absent `TURNSTILE_SECRET_KEY` → verification skipped, unauthenticated mail relay

## Contact endpoint flow

```
POST /api/contact
  → parse JSON
  → Zod validation (ContactPayloadSchema)
  → honeypot check (silent success if filled)
  → client IP extraction (reject if no cf-connecting-ip)
  → rate limit check (memoryRateLimiter)
  → Turnstile verification (requires TURNSTILE_SECRET_KEY)
  → send email via Resend (requires RESEND_API_KEY)
  → success response
```

## Rate limiting

`memoryRateLimiter` is per-isolate and near-useless in production. It uses an in-memory Map
that resets on each isolate restart. Prefer Cloudflare Rate Limiting rules on the `/api/contact` route.

The KV-based limiter (`createKvRateLimiter`) was removed — KV is eventually consistent (~60s
propagation), making concurrent requests all pass.

`clientIp` must come from `cf-connecting-ip` header. Reject when absent — never fall back to
`'127.0.0.1'` (collapses all unknown clients into one bucket).

## Security headers (`public/_headers`)

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy` — see below
- `/downloads/*` — `Cache-Control: public, max-age=3600, must-revalidate` (mutable, not hashed)
- Immutable assets (`/favicon.ico`, `/favicon.svg`, `/og-image.svg`) — `max-age=31536000, immutable`

## CSP rationale

```
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com
style-src 'self' 'unsafe-inline'
```

`unsafe-inline` in `script-src` is required for:
1. The theme bootstrap script in `Layout.astro` (FOUC prevention — must run before paint)
2. `is:inline` scripts in components (PaletteSelector, ThemeToggle)

`unsafe-inline` in `style-src` is required for Astro's scoped `<style>` blocks.

The `onclick="window.print()"` pattern was replaced with `data-print` wired from an inline script
(T1.6), removing one source of `unsafe-inline` dependency.

`https://challenges.cloudflare.com` is required for Cloudflare Turnstile (bot protection).

## Input sanitization

- Control characters stripped from `name` before email subject: `name.replace(/[\r\n\u0000-\u001f]/g, ' ')` (`contact.ts:266`)
- HTML escaped in email body via `escapeHtml()` (`contact.ts:299-306`)
- Honeypot field: if filled, return silent success (bot trap)
