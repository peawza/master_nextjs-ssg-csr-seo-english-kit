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

## REV-004 — mobile LCP decision evidence, 2026-10-29 (Asia/Bangkok, +07:00)
No source change. Option B (defer Next hydration scripts) was measured only on throwaway copies of out/ in %TEMP%.

| Variant | Mode | Mobile P runs | Mobile LCP runs | Median LCP | Desktop median LCP | Browser suite |
|---|---|---|---|---|---|---|
| Shipped build (REV-002) | simulated | 93/96/96 | 3029/2791/2800 | 2800 | 642 | 45 pass / 6 skip |
| B: inject chunks after hero img load (3 s fallback) | simulated | 93/92/96 | 2921/2954/2817 | 2921 | 667 | 42 pass / 3 FAIL / 6 skip ("delayed media does not gate content or navigation", all engines) |
| B2: inject after window load + 2 rAF | simulated | 94/96/96 | 2901/2745/2791 | 2791 | not run | not run |
| Shipped build | devtools (applied slow 4G + 4x CPU) | 88/79/85 | 2267/2598/2064 | 2267 | not run | n/a |

Raw: lighthouse-results/rev-003-protoB/, lighthouse-results/rev-003-protoB2/, lighthouse-results/rev-004-devtools/ (gitignored).

Findings:
- B and B2 give no material gain. In the observed (unthrottled) trace the first paint lands at ~200 ms even without JS, while load + 2 rAF fires at ~105 ms. Deferred scripts still evaluate before the paint, so Lantern still counts them. B also breaks a stated requirement (navigation must not wait for media).
- With applied DevTools throttling the shipped build's LCP median is 2267 ms (< 2.5 s target), LCP = FCP in all runs. The simulated 2.8 s comes from how Lantern builds its graph for this page shape, not from a measured slow paint.
- Under applied 4x CPU, TBT is 360/548/482 ms (simulated reports ~60 ms) and Performance 79-88. Hydration main-thread cost is the real-world concern to watch (INP), not LCP.
- CLS under devtools mode: 0.00025 (well under 0.1).

## REV-003 / REV-005 — 2026-10-29 (Asia/Bangkok, +07:00)
REV-003: ADR-0002 accepted. The mobile LCP gate now uses applied (devtools) throttling; the simulated value is reported alongside, labelled as simulated.

REV-005 change: the decorative Unicode symbols (☰ × ✳ ↗ ↓ ↑ ❧) were replaced with inline SVG icons (src/components/ui/Icon.tsx). Accessible names lost their stray symbols: "× Close" became "Close", and the journal/back-to-top links no longer end in an arrow character.

Diagnosis (Chrome trace, Playwright Chromium, 412x823 DPR1.75, CDP CPU throttling 4x, first full Layout event, no JS-forced layout):
| Variant | Runs (ms) | Median |
|---|---|---|
| Before (REV-002 build) | 307, 391, 320, 280, 345 | 320 |
| Probe: symbols replaced by ASCII | 191, 262, 231 | 231 |
| Probe: web font disabled | 295, 315, 445 | 315 (no effect) |
| After (SVG icons, real build) | 180, 234, 200, 332, 256 | 234 |

Gates after the change: typecheck, lint, build, verify:html PASS. test:browser before the baseline update: 42 passed, 3 failed (only the Chromium visual baselines; the icons change on purpose, and the reviewed render shows icons in place with a small vertical shift below the ornament), 6 skipped. Chromium baselines regenerated (`npx.cmd playwright test --project=chromium -g "visual baseline" --update-snapshots`, 3 passed). Then test:browser: 45 passed, 6 skipped, 0 failed.

Lighthouse 13.6.0 after the change:
| Mode | Profile | P runs | LCP runs | Median LCP | TBT | CLS |
|---|---|---|---|---|---|---|
| simulated (lighthouse-results/rev-005) | mobile | 94/96/95 | 2962/2793/2820 | 2820 | n/a | 0 |
| simulated | desktop | 100/100/100 | 660/654/646 | 654 | n/a | 0 |
| devtools (lighthouse-results/rev-005-devtools) | mobile | 85/85/85 | 2157/2104/2079 | 2104 (REV-004: 2267) | 458/478/504, median 478 (REV-004: 482) | 0.00025 |

A/BP/SEO unchanged (100/100/69, SEO 69 = intentional noindex). Devtools Style & Layout median 709 ms (REV-004 runs 775/988/594). The first-layout cut shows in direct traces, but Lighthouse TBT does not move beyond run-to-run noise. TBT is dominated by script evaluation of chunk 216iyidhmrh3u.js (React/Next runtime, one ~577 ms long task at 4x CPU), and the layout task stays above 50 ms either way.
