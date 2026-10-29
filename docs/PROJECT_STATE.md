# PROJECT STATE — Canonical AI Handoff

Last updated: 2026-10-29 14:25 (Asia/Bangkok)
Status: **REV-001 COMPLETE (local scope) — no P0/P1; P2 items tracked**

## Current implementation
Villa Luma fictional single-page hospitality design study. Next.js App Router static export, original English content, locally hosted licensed images/font, CSS Modules/tokens, accessible dialog navigation and progressive section motion. /services/ retained with shared study header/footer. No backend, tracking or booking. No deployment.

## Verified (2026-10-29, measured)
- typecheck / lint / build / verify:html: PASS.
- Browser suite Chromium + Firefox + WebKit: 45 passed, 6 skipped (visual baselines Chromium-only by design), 0 failed.
- Lighthouse median of 3 (lab, simulated throttling), lighthouse-results/final/:
  - Mobile: P95 A100 BP100 SEO69, LCP 2896ms, CLS 0.
  - Desktop: P100 A100 BP100 SEO69, LCP 646ms, CLS 0.
- SEO 69 is only the intentional noindex (is-crawlable). Mobile LCP exceeds the 2.5s target.
- Full detail: docs/reverse-engineering/passalacqua/VERIFICATION_REPORT.md.

## Constraints
example.com remains a deliberate local placeholder. Global noindex/follow and X-Robots-Tag protect the fictional study. Do not enable indexing or publish without domain/content review. Stock imagery is illustrative, not an actual property. lighthouse-results/optimized/desktop-*.json were captured with mobile settings and are not valid desktop data.

## Uncommitted changes
scripts/audit-lighthouse.mjs (desktop UA fix), docs updates, task.md, lighthouse-results/final/. Not committed; awaiting user.

## Next action
REV-002 (optional): reduce mobile lab LCP below 2.5s; remove unused starter components src/components/sections/HomeSections.tsx, src/components/sections/HeroSection.tsx, src/components/interactive/MobileNav.tsx; add Firefox/WebKit visual baselines if needed; manual screen-reader pass. Task: task.md; logs: docs/agent-logs/2026-10-28-REV-001-Codex.md, docs/agent-logs/2026-10-29-REV-001-KIRO.md.
