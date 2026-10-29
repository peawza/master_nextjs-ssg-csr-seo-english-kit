# PROJECT STATE — Canonical AI Handoff

Last updated: 2026-10-29 20:15 (Asia/Bangkok)
Status: **REV-006 COMPLETE (investigation) — no P0/P1; ADR-0003 Proposed, awaiting decision; code = 738c5ae, all gates green**

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
- ADR-0003 (Proposed, REV-006): client runtime cost. Measured: TBT median 339ms shipped, 367ms with no client components, 0ms with all framework JS removed. The cost is App Router runtime + hydration, not our components. Recommendation: option A (keep, monitor field INP).

## Known gaps
- TBT ~340ms (range 233-658, n=5) / TTI ~3.7s under 4x CPU, set by the React/Next App Router runtime (chunk 216iyidhmrh3u.js). Removing it needs ADR-0003 B/C/D.
- Firefox/WebKit visual baselines absent; manual screen-reader and real-device checks NOT RUN; desktop reference media loading UNKNOWN (Cloudflare 403).

## Constraints
example.com remains a deliberate local placeholder. Global noindex/follow and X-Robots-Tag protect the fictional study. Do not enable indexing or publish without domain/content review. lighthouse-results/optimized/desktop-*.json are not valid desktop data; rev-002-attempt1-noisy and rev-003-protoB* are diagnostic only.

## Uncommitted changes
REV-004/005 committed as 738c5ae. REV-006 docs only: ADR-0003, VERIFICATION_REPORT.md, task.md, this file, docs/agent-logs/2026-10-29-REV-006-KIRO.md. No source change. Not committed; awaiting user.

## Next action
User decision on ADR-0003 (recommend A). If B is chosen: REV-007 to prototype a Pages Router zero-runtime home page with vanilla menu/reveal and keep all tests green. Also: measure INP on a real mid-range Android device, manual screen-reader pass, real domain before indexing. Log: docs/agent-logs/2026-10-29-REV-006-KIRO.md.
