# ADR-0001: Use Next.js Static Export on Cloudflare Pages

Status: Accepted for starter architecture
Date: 2026-10-28

## Context
Need fast global CDN delivery, a low-cost/free static hosting path, strong crawlability, maintainable React interactions and no persistent Next.js server.

## Decision
Use Next.js App Router with `output: 'export'`, prerender SEO-critical HTML at build time, and add client-only interactivity at component boundaries. Deploy `out/` to Cloudflare Pages.

## Consequences
- Positive: simple hosting, globally cached static assets, predictable crawled HTML, smaller runtime footprint.
- Constraints: no request-time SSR/Server Actions/ISR. Dynamic service capabilities need an explicit external backend.
- Operations: content changes require a rebuild/deployment; domain/metadata must be configured correctly.

## Revisit when
A business requirement genuinely needs authenticated personalization, private dynamic content, server-rendered data or complex runtime APIs that cannot be externalized cleanly.
