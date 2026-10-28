# Reference audit — REV-001
Reference: https://www.passalacqua.it/en/
Captured: 2026-10-28 22:55–23:00 Asia/Bangkok. Public UI only; no submissions or source reuse.

## Tested capabilities
Browser navigation, DOM/computed styles, resize, screenshots: available and tested. Terminal/file access works with scoped escalation (sandbox helper startup fails). Node 24.15.0/npm.cmd 11.12.1. Git status inspected. Video input: none supplied. Screenshot files under screenshots/. Network/performance not yet comprehensively audited.

| ID | Viewport/state | Evidence | Status/confidence |
|---|---|---|---|
| R01 | 1440x900 initial | reference-desktop-initial.png | OBSERVED/high |
| R02 | 1440x900 full scroll | reference-desktop-full.png | OBSERVED/high |
| R03 | 390x844 full scroll | reference-mobile-full.png | OBSERVED/high |
| R04 | 768x1024 full scroll | reference-tablet-full.png | OBSERVED/high |
| R05 | desktop menu open | reference-desktop-menu.png | OBSERVED/high |
| R06 | mobile menu open | reference-mobile-menu.png | OBSERVED/high |
| R07 | mobile hero | reference-mobile-hero.png | OBSERVED/high |

Observed: full-bleed hero; display serif heading; editorial introduction; seasonal sections; suites with three categories; story; book; two related-place features; footer. Header has About us, logo, booking link; expanded menu has two groups. Book/booking links external; not activated.
Computed H1: Canela-Thin, weight 100, 70px/77px at 1440; 50px/55px at 390; 54px/59.4px at 768. Body Switzer-Light 16px/24px. These proprietary fonts are observations, not reused assets.
Hero H1 bounds: desktop x72,y666,w522,h202; mobile x20,y389,w350,h207. First main image desktop 854x569, mobile 350x234. These measurements describe the captured state, not all loads.
Menu observed white/light background, centered logo, two serif link columns separated by a thin vertical rule. Escape left reference menu open; local implementation will improve this.
No audio/video elements in DOM at capture; absence in every possible state is UNKNOWN. Exact easing/timing, private implementation and libraries UNKNOWN. Cookie panel seen in earlier session, absent at this capture; no claims about consent compliance.
Width sweep scrollWidth: 320→395,375→375,390→390,768→1229,1024→1196,1280→1280,1440→1440,1920→1920. Overflow is session-specific observed behavior and will not be replicated.
Console reported 1 error/3 warnings during navigation; attributable requests not yet classified; do not treat reference diagnostics as local failures.

## Evidence policy
Screenshots document reference appearance only, never ship as local website imagery. No copyrighted text or logo copied. Dynamic content/motion may change. Missing observations remain UNKNOWN, not inferred implementation facts.

## Additional interaction evidence — 2026-10-28 23:15 Asia/Bangkok
R08–R13: reference-{desktop,mobile}-{focus,middle,footer}.png. Hover/focus link measured Canela-Light 20px/24px, color white, computed transition 0.25s, native 1px auto outline in both viewport states. This verifies the link transition property only, not a complete animation timeline. Scroll-to-main and footer states captured. Reference desktop/mobile menu, initial and full-page captures exist. No transaction links followed.
