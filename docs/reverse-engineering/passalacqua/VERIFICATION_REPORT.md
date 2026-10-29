# Verification report — REV-001
Status: final verification complete on 2026-10-29 (Asia/Bangkok, +07:00). Measured results only.
Earlier history (baseline failures before npm install, first Lighthouse baseline P77/72) is recorded in docs/agent-logs/2026-10-28-REV-001-Codex.md.

## Environment
Windows, cmd shell, Node v24.15.0, npm.cmd 11.12.1, Next.js 16.4.3 (Turbopack), Lighthouse 13.6.0, Playwright Chromium/Firefox/WebKit. Local server: node scripts/serve-static.mjs (out/, gzip for text, X-Robots-Tag noindex).

## Build and static checks — 2026-10-29
| Command | Result | Notes |
|---|---|---|
| npm.cmd run typecheck | PASS | tsc --noEmit, no diagnostics |
| npm.cmd run lint | PASS | eslint ., no errors or warnings |
| npm.cmd run build | PASS | 6 static routes: /, /_not-found, /robots.txt, /services, /sitemap.xml (+404) |
| npm.cmd run verify:html | PASS | one H1, lang, main, title, description, canonical, noindex, OG, unique IDs; sections about, seasons, seasonal-notes, suites, stories, journal, places, about-project; anchors resolve; footer no-JS nav; no hotel schema; study disclosure; no reference assets; all media local; /services/, robots, sitemap, 404 |

## Browser — npm.cmd run test:browser (2026-10-29)
Result: 45 passed, 6 skipped, 0 failed (57.5s).
- Chromium/Firefox/WebKit each: widths 320/375/390/768/1024/1280/1440/1920 (no horizontal overflow, one H1, all sections visible, menu dialog fits, Escape restores focus); keyboard Enter/Space/Tab/Shift+Tab wrap/Escape/anchor focus and scroll unlock; JavaScript disabled; reduced motion; blocked images and fonts; delayed media (700ms); /services/ retained, no page errors, all images decode.
- Visual screenshot baselines desktop/mobile/tablet: PASS in Chromium. Skipped by design in Firefox/WebKit (baselines are Chromium-only; behavior tested in all engines).

## Lighthouse — node scripts/audit-lighthouse.mjs, AUDIT_DIR=lighthouse-results/final
3 runs per profile, fresh Chrome per run, simulated throttling (Lighthouse defaults for mobile; desktop preset values for desktop). Raw reports: lighthouse-results/final/{mobile,desktop}-{1,2,3}.json and summary.json.

| Profile | Performance runs | Median P | A | BP | SEO | Median LCP | CLS |
|---|---|---|---|---|---|---|---|
| Mobile (412x823, 4x CPU) | 95/95/96 | 95 | 100 | 100 | 69 | 2896ms | 0 |
| Desktop (1350x940) | 100/100/100 | 100 | 100 | 100 | 69 | 646ms | 0 |

Against task targets (P>=90, A/BP/SEO>=95, LCP<=2.5s, CLS<=0.1):
- Performance, Accessibility, Best Practices, CLS: met on both profiles.
- SEO 69: below target by design. Only failing SEO audit is is-crawlable, caused by the required noindex for this fictional study. Kept as instructed.
- LCP: desktop met (646ms); mobile 2896ms does NOT meet 2.5s under simulated slow-4G. Lab value only; no field INP/LCP data exists.
- Remaining non-blocking insights: unused-javascript, legacy-javascript, cache-insight (local server max-age=3600), image-delivery, render-blocking CSS, network-dependency-tree, forced-reflow.

Audit tooling defect fixed in this session: the desktop profile set emulatedUserAgent to an empty string, which Lighthouse 13.6 rejects (Network.setUserAgentOverride protocol error). Removed the override so the desktop preset UA applies. Consequence: the earlier lighthouse-results/optimized/desktop-*.json reports were captured with mobile settings and are not valid desktop measurements.

## Issue classification
- P0 (unusable/build broken): none.
- P1 (main layout/accessibility broken): none observed in tests.
- P2 (tracked): mobile lab LCP 2.9s over 2.5s target (2.8s after REV-002, see below); Firefox/WebKit have no visual baselines; example.com placeholder canonical. Unused starter files: removed in REV-002.

## Not verified
Manual screen reader testing (NVDA/VoiceOver), real devices, real slow networks, and hosting-specific cache headers on Cloudflare Pages: NOT RUN. Full WCAG conformance requires manual assistive-technology review.

## REV-002 update — 2026-10-29 (Asia/Bangkok, +07:00)
Changes: removed unused starter components (HomeSections, HeroSection, MobileNav) and their CSS rules; added a 768w mobile hero AVIF (36.9 KB vs 54.1 KB for 960w). Gates re-run: typecheck, lint, build, verify:html PASS; test:browser 45 passed, 6 skipped, 0 failed (1.6m).

Lighthouse, AUDIT_DIR=lighthouse-results/rev-002 (same script and settings as above):

| Profile | Performance runs | Median P | A | BP | SEO | Median LCP | CLS |
|---|---|---|---|---|---|---|---|
| Mobile | 93/96/96 | 96 | 100 | 100 | 69 | 2800ms | 0 |
| Desktop | 100/100/100 | 100 | 100 | 100 | 69 | 642ms | 0 |

A first REV-002 attempt run right after the browser suite showed host CPU noise (TBT ~195ms, SI 2366ms with byte-identical JS); kept in lighthouse-results/rev-002-attempt1-noisy/ for the record, not used as the measurement.

Root cause of the remaining mobile LCP gap (diagnosed from Lighthouse 13.6 Lantern source, node_modules/@paulirish/trace_engine/models/trace/lantern/metrics/LargestContentfulPaint.js): simulated LCP is the max end time of every non-low-priority-image node that finished before the observed LCP, including Next.js async JS chunks (~148 KB, React + App Router runtime) and their evaluation tasks. FCP excludes them (0.9 s). Diagnostic run with the external script tags stripped from a throwaway out/index.html: mobile LCP 1580 ms (single run, diagnostic only; out/ rebuilt afterwards). Mobile LCP is therefore bound by framework JS, not by the image. Closing the gap needs an architectural decision (see docs/PROJECT_STATE.md).
