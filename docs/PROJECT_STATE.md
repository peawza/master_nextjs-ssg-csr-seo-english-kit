# PROJECT STATE — Canonical AI Handoff

Last updated: 2026-10-30 (Asia/Bangkok)
Status: **DEPLOY-001 IMPLEMENTED (local, uncommitted) — Docker build/preview + Windows batch Direct Upload tooling tested; real Cloudflare upload NOT RUN (no credentials). SEO-007 COMPLETE (c6c84aa). SEO-008 BLOCKED on release inputs; ADR-0003 Proposed**

## Current implementation
Villa Luma fictional single-page hospitality design study. Next.js App Router static export, original English content, locally hosted licensed images/font, CSS Modules/tokens, accessible dialog navigation and progressive section motion. /services/ retained. Decorative icons are inline SVG (src/components/ui/Icon.tsx). No backend, tracking or booking. Not deployed yet. Deployment tooling: `build.bat`, `preview.bat`, `deploy-cloudflare.bat` -> scripts/deploy/cli.mjs -> Dockerfile (pinned node digest, Wrangler 4.155.0); guide docs/deployment/DOCKER_AND_BATCH.md; config via .env (.env.example).

## Verified (2026-10-29, measured, REV-005)
- typecheck / lint / build / verify:html: PASS.
- Browser suite Chromium + Firefox + WebKit: 45 passed, 6 skipped (visual baselines Chromium-only by design), 0 failed. Chromium baselines regenerated for the SVG icons.
- Lighthouse 13.6.0, median of 3:
  - Simulated (lighthouse-results/rev-005): mobile P95 A100 BP100 SEO69, LCP 2820ms, CLS 0; desktop P100 A100 BP100 SEO69, LCP 654ms, CLS 0.
  - Devtools / applied throttling (lighthouse-results/rev-005-devtools): mobile P85, LCP 2104ms (ADR-0002 gate <= 2.5s: PASS), TBT 478ms, CLS 0.00025.
- SEO 69 is only the intentional noindex.

## Verified (2026-10-30, measured, SEO-007 on c6c84aa)
- typecheck / lint / build / verify:html: PASS (exit 0). verify:html 95 PASS, 0 FAIL, now including og:url = canonical, OG/Twitter = page title/description, JSON-LD, 404 head (no canonical/OG, single noindex), sitemap = indexable routes, robots sitemap URL.
- Browser suite (same source): 45 passed, 6 skipped, 0 failed.
- Lighthouse NOT RUN (head-only change).
- Metadata convention: non-home routes use `pageMetadata()` (src/lib/seo/metadata.ts); add new routes to the `routes` map in scripts/verify-static-html.mjs.

## Verified (2026-10-30, measured, DEPLOY-001 working tree)
- Host typecheck / lint / build / verify:html: PASS (verify 95 PASS, 0 FAIL); no src/tests/package change vs c6c84aa.
- Docker build from a clean copy of HEAD at a path with spaces: PASS (npm ci, lint, typecheck, build, verify:html in container; 77-file artifact with _headers).
- Preview container: HTTP checks 16/16 (/, /services/ 200; unknown 404 with 404.html; _headers on 200/404); Playwright Chromium against the container 17/17; non-root, read-only rootfs, cap-drop ALL, bound to 127.0.0.1.
- Full browser suite with updated serve-static.mjs: 45 passed, 6 skipped, 0 failed.
- Failure paths exit 1: missing config, preview = production branch, production without --confirm-production, port in use, Docker engine down, Docker CLI missing, broken build (no artifact left, upload not reached), invalid token (Cloudflare 9106 before upload; token not in output). No .env/token in context, image history or artifact.
- Real `wrangler pages deploy`: NOT RUN (no account ID/token/project). Lighthouse NOT RUN (no site change).

## Decisions
- ADR-0001 static export; ADR-0002 mobile LCP gate uses applied throttling, simulated value reported but not gated (docs/decisions/).
- ADR-0003 (Proposed, REV-006): client runtime cost. Measured: TBT median 339ms shipped, 367ms with no client components, 0ms with all framework JS removed. The cost is App Router runtime + hydration, not our components. Recommendation: option A (keep, monitor field INP).

## Known gaps
- TBT ~340ms (range 233-658, n=5) / TTI ~3.7s under 4x CPU, set by the React/Next App Router runtime (chunk 216iyidhmrh3u.js). Removing it needs ADR-0003 B/C/D.
- Firefox/WebKit visual baselines absent; manual screen-reader and real-device checks NOT RUN; desktop reference media loading UNKNOWN (Cloudflare 403).

## Constraints
example.com remains a deliberate local placeholder. Global noindex/follow and X-Robots-Tag protect the fictional study. Do not enable indexing or publish without domain/content review. lighthouse-results/optimized/desktop-*.json are not valid desktop data; rev-002-attempt1-noisy and rev-003-protoB* are diagnostic only.

## Uncommitted changes
REV-004/005 committed as 738c5ae. REV-006 docs only: ADR-0003, VERIFICATION_REPORT.md, task.md, this file, docs/agent-logs/2026-10-29-REV-006-KIRO.md. REV-006, SEO-007 (source, verifier, log) and SEO-008 log committed as 0875710 / c6c84aa. Uncommitted: SEO-007 log close-out (Kiro); DEPLOY-001 plan + Codex log and SEO-008 log follow-up (Codex); DEPLOY-001 implementation (Kiro): Dockerfile, .dockerignore, .env.example, build.bat, preview.bat, deploy-cloudflare.bat, scripts/deploy/cli.mjs, docs/deployment/DOCKER_AND_BATCH.md, edits to scripts/serve-static.mjs, .gitignore, eslint.config.mjs, README.md, docs/deployment/CLOUDFLARE_PAGES.md, task.md, this file, docs/agent-logs/2026-10-30-DEPLOY-001-KIRO.md. Preserve all workstreams.

## Next action
DEPLOY-001: tooling done. Remaining: (1) commit when the user asks; (2) user creates a Cloudflare Pages Direct Upload project and an Account API token (Account / Cloudflare Pages / Edit), fills .env, runs `deploy-cloudflare.bat` (preview target), then verify status, headers, robots/sitemap and 404 on the pages.dev URL. Production deploy stays gated by SEO-008 and `--confirm-production`. Logs: docs/agent-logs/2026-10-30-DEPLOY-001-KIRO.md (implementation), docs/agent-logs/2026-10-30-DEPLOY-001-Codex.md (plan).

SEO-007 is done (log: docs/agent-logs/2026-10-30-SEO-007-KIRO.md). Open SEO content issue for BRAND-001/SEO-008: /services/ copy offers "web design ... technical SEO services", contradicting the site disclosure; src/content/home.ts holds unused starter copy.

Provide the SEO-008 release inputs: production HTTPS origin, approved public email, approval/replacement of fictional copy and illustrative media, and explicit authorization to allow indexing. Then update source metadata/headers and verify every exported SEO URL. Separately, decide ADR-0003 (recommend A). If B is chosen: REV-007 to prototype a Pages Router zero-runtime home page with vanilla menu/reveal and keep all tests green. Also measure INP on a real mid-range Android device and complete a manual screen-reader pass. Logs: docs/agent-logs/2026-10-29-REV-006-KIRO.md; docs/agent-logs/2026-10-30-SEO-008-Codex.md.
