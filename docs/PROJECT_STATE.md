# PROJECT STATE — Canonical AI Handoff

Last updated: 2026-10-29 17:05 (Asia/Bangkok)
Status: **REV-002 COMPLETE (cleanup + partial LCP) — no P0/P1; mobile LCP blocked on architecture decision**

## Current implementation
Villa Luma fictional single-page hospitality design study. Next.js App Router static export, original English content, locally hosted licensed images/font, CSS Modules/tokens, accessible dialog navigation and progressive section motion. /services/ retained with shared study header/footer. No backend, tracking or booking. No deployment. Unused starter components removed in REV-002.

## Verified (2026-10-29, measured, REV-002)
- typecheck / lint / build / verify:html: PASS.
- Browser suite Chromium + Firefox + WebKit: 45 passed, 6 skipped (visual baselines Chromium-only by design), 0 failed.
- Lighthouse 13.6.0 median of 3 (lab, simulated throttling), lighthouse-results/rev-002/:
  - Mobile: P96 A100 BP100 SEO69, LCP 2800ms (REV-001: 2896ms), CLS 0.
  - Desktop: P100 A100 BP100 SEO69, LCP 642ms, CLS 0.
- SEO 69 is only the intentional noindex (is-crawlable). Mobile LCP still exceeds the 2.5s target.
- Detail: docs/reverse-engineering/passalacqua/VERIFICATION_REPORT.md (REV-002 section).

## Mobile LCP root cause (diagnosed)
Lantern simulated LCP includes Next's async JS chunks (~148 KB React + App Router runtime) and their evaluation, because they finish and run before the observed first paint. Image is not the bottleneck. Diagnostic with scripts stripped: 1580ms. Reaching <2.5s requires changing when hydration JS loads, which is an architectural change needing an ADR and user approval.

## Constraints
example.com remains a deliberate local placeholder. Global noindex/follow and X-Robots-Tag protect the fictional study. Do not enable indexing or publish without domain/content review. Stock imagery is illustrative. lighthouse-results/optimized/desktop-*.json were captured with mobile settings and are not valid desktop data. lighthouse-results/rev-002-attempt1-noisy/ is a discarded noisy run.

## Uncommitted changes
REV-002: deleted 3 starter components, pruned src/styles/sections.module.css, StudyImage.tsx srcset, scripts/optimize-study-assets.mjs, public/images/lake-mobile-768.avif, optimized-assets.json, docs/design/LAYOUT.md, VERIFICATION_REPORT.md, task.md, this file, REV-002 log, lighthouse-results/rev-002*. Not committed; awaiting user.

## Next action
REV-003 (needs user decision): pick a mobile LCP strategy, write ADR-0002, implement, re-measure. Options: (A) accept 2.8s lab LCP as framework floor and document; (B) post-export step that delays Next hydration scripts until after the hero image loads; (C) replace React client components with small vanilla scripts (App Router runtime still ships, so limited gain). Other open items: audit reference media loading, Firefox/WebKit visual baselines if needed, manual screen-reader pass, real domain before indexing. Logs: docs/agent-logs/2026-10-29-REV-002-KIRO.md.
