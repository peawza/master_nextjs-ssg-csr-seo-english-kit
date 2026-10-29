# PROJECT STATE — Canonical AI Handoff

Last updated: 2026-10-29 18:45 (Asia/Bangkok)
Status: **REV-003 + REV-005 COMPLETE — no P0/P1; ADR-0002 accepted; all gates green**

## Current implementation
Villa Luma fictional single-page hospitality design study. Next.js App Router static export, original English content, locally hosted licensed images/font, CSS Modules/tokens, accessible dialog navigation and progressive section motion. /services/ retained. Decorative icons are inline SVG (src/components/ui/Icon.tsx). No backend, tracking or booking. No deployment.

## Verified (2026-10-29, measured, REV-005)
- typecheck / lint / build / verify:html: PASS.
- Browser suite Chromium + Firefox + WebKit: 45 passed, 6 skipped (visual baselines Chromium-only by design), 0 failed. Chromium baselines regenerated for the SVG icons.
- Lighthouse 13.6.0, median of 3:
  - Simulated (lighthouse-results/rev-005): mobile P95 A100 BP100 SEO69, LCP 2820ms, CLS 0; desktop P100 A100 BP100 SEO69, LCP 654ms, CLS 0.
  - Devtools / applied throttling (lighthouse-results/rev-005-devtools): mobile P85, LCP 2104ms (ADR-0002 gate <= 2.5s: PASS), TBT 478ms, CLS 0.00025.
- SEO 69 is only the intentional noindex.

## Decisions
- ADR-0001 static export; ADR-0002 mobile LCP gate uses applied throttling, simulated value reported but not gated (docs/decisions/).

## Known gaps
- TBT ~480ms under 4x CPU, dominated by React/Next runtime evaluation (chunk 216iyidhmrh3u.js).
- Firefox/WebKit visual baselines absent; manual screen-reader and real-device checks NOT RUN; desktop reference media loading UNKNOWN (Cloudflare 403).

## Constraints
example.com remains a deliberate local placeholder. Global noindex/follow and X-Robots-Tag protect the fictional study. Do not enable indexing or publish without domain/content review. lighthouse-results/optimized/desktop-*.json are not valid desktop data; rev-002-attempt1-noisy and rev-003-protoB* are diagnostic only.

## Uncommitted changes
REV-004 docs (MEDIA_LOADING_AUDIT.md, media-loading.json, REFERENCE_AUDIT.md, REV-004 log) and REV-003/005 (ADR-0002, LIGHTHOUSE_POLICY.md, Icon.tsx, 5 components, villa.module.css, test + 3 Chromium snapshots, DESIGN_SYSTEM.md, VERIFICATION_REPORT.md, task.md, this file, REV-005 log). Not committed; awaiting user.

## Next action
Optional REV-006: reduce client JS evaluation cost (audit what MotionEnhancer/SiteMenu pull in; consider a lighter progressive-enhancement approach under ADR-0001) and measure INP on a real mid-range Android device. Also: manual screen-reader pass, real domain before indexing. Logs: docs/agent-logs/2026-10-29-REV-005-KIRO.md, docs/agent-logs/2026-10-29-REV-004-KIRO.md.
