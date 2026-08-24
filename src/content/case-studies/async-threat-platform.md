---
title: "Async Threat Intelligence Platform"
projectSlug: "async-threat-platform"
role: "Lead full-stack engineer"
duration: "9 months"
summary: "An edge-rendered security analytics SaaS that ingests millions of threat signals per hour and serves near-zero-JS dashboards from Cloudflare's edge."
techStack:
  - "Astro"
  - "Cloudflare Workers"
  - "React"
  - "TypeScript"
  - "PostgreSQL"
  - "WebSocket"
impactMetrics:
  - "-40% p95 latency"
  - "2.4M signals/day"
---

## Problem

Security teams needed live visibility over a torrent of threat signals, but browser-based dashboards buckled under both volume and latency. Every page reload re-fetched megabytes of data, and interactive widgets shipped hundreds of kilobytes of framework JavaScript before any signal rendered.

## Approach

I owned the platform end to end, from ingestion contract through to the rendered dashboard.

### Ingestion

Signals arrive through a serverless ingestion layer that normalises, deduplicates, and writes into partitioned PostgreSQL. Push-based WebSocket delivery replaces polling for live views, so the browser receives only the deltas that changed since the last frame.

### Rendering

The query surface is generated ahead of time as static Astro collections, and the dashboard shell renders with **zero runtime JavaScript**. Interactive widgets are isolated Astro islands — small compiled components — so the initial document is pure HTML and CSS.

### Edge delivery

Everything serves from Cloudflare's edge CDN. The interactive layer is tiny; the heavy computation happens server-side at the edge, not in the visitor's browser.

## Results

- Reduced p95 latency by 40% for the dashboard request path.
- Sustained ingestion of 2.4M signals per day without pipeline backpressure.
- Perfect Lighthouse performance score on the primary dashboard surface.
- Fully keyboard-navigable interface with a strict `prefers-reduced-motion` fallback.

## Takeaways

Static-serving the data layer and isolating every interactive widget collapses the client footprint to near zero without sacrificing live updates. Serverless ingestion and edge delivery make "fast" a property of the architecture, not a caching afterthought.