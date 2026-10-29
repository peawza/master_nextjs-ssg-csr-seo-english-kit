# Reference media-loading audit — REV-004
Reference: https://www.passalacqua.it/en/
Captured: 2026-10-29 17:32 Asia/Bangkok (2026-10-29T10:32:23Z). Read-only: navigate and scroll only, no clicks, no form input, no assets saved. Raw sanitized evidence: media-loading.json (query strings, tracking parameters and data: URIs removed).

## Method
Playwright Chromium (channel chromium). Load with waitUntil=load, then networkidle (15 s cap) + 2 s, snapshot DOM. Then scroll in 80%-viewport steps every 700 ms to the bottom, networkidle + 1.5 s, snapshot again. Only image/media/font requests recorded; byte counts are Playwright responseBodySize. Observed timings are unthrottled from one network location, one load each. They are not lab or field metrics.

| ID | Profile | Result | Status/confidence |
|---|---|---|---|
| M01 | Desktop 1440x900 DPR1, default HeadlessChrome UA | HTTP 403 Cloudflare challenge page (cdn-cgi/images/cf-no-screenshot-error.png, browser-bar.png); real page not served | OBSERVED/high. Desktop media loading remains UNKNOWN. UA was not spoofed to get around bot protection. |
| M02 | Mobile 390x844 DPR3, iPhone Safari UA, touch | Real page served, docHeight 10761 px | OBSERVED/high |

## Mobile findings (M02)
| Finding | Evidence | Status/confidence |
|---|---|---|
| All content images load eagerly, before any scroll: 31 media requests, 2,971,281 bytes before scrolling; only 1 more request after a full scroll (logo-sticky.svg, 43,031 B) | requests[].phase | OBSERVED/high |
| No img has a loading, fetchpriority or decoding attribute; no data-src/data-srcset lazy markers | imgs[] | OBSERVED/high |
| 13 content images use picture with media-query sources ((min-width:1024px), (min-width:768px) and (max-width:1023px), some also (max-width:767px)); the img fallback has no srcset/sizes, so one fixed mobile file per image | imgs[].sourceTypes, srcsetCandidates=0 | OBSERVED/high |
| Mobile hero image: natural 912x1216, rendered 390x844 at DPR3, 209,182 B; request finished ~0.76 s after navigation start (second media request; the first, at ~0.65 s, was a below-fold image, moltrasio-and-passalacqua-by-night.jpg) | imgs[], requests[] | OBSERVED/high |
| URLs end in .jpg/.png but every content image was served as Content-Type image/webp (format negotiation on the server/CDN) | requests[].mime | OBSERVED/high (mechanism INFERRED/medium) |
| Largest single files: cantinone.png 910,355 B and winter-facade-passalacqua.png 626,136 B (served as webp), each rendered at 385 px wide or less | requests[], imgs[] | OBSERVED/high |
| Width/height attributes on all content images (912x1216, 912x608, 650x650, 300x300) | imgs[].widthAttr/heightAttr | OBSERVED/high |
| Logos and icons are SVG (12 initial requests, 161,657 B); two white/dark full logos about 60 KB each | requests[] | OBSERVED/high |
| Fonts: 5 woff2 requests (Canela-Light, Canela-Thin, SilverlineScript self-hosted; two Switzer files from cdn.fontshare.com), 165,242 B; all FontFace display=swap; no preload/preconnect/dns-prefetch links | fonts[], hintLinks=[] | OBSERVED/high |
| No video or audio elements; 3 iframes (two same-origin 1x1/0x0, one consentcdn.cookiebot.com SDK) | videos=[], iframes[] | OBSERVED/high for this load; other states UNKNOWN |
| Third-party remarketing pixel (ade.googlesyndication.com) requested at ~4.7 s with consent-mode parameters indicating denied | requests[] | OBSERVED/high; consent behaviour not evaluated |
| Console warnings name GreenSock ("GSAP target ... not found") | console[] | OBSERVED/high that GSAP is loaded; animation timings remain UNKNOWN |
| Observed in-browser LCP 2924 ms, element div, no URL (text or CSS-painted block, not an img); DOMContentLoaded 1499 ms, load 4728 ms | observedLcp, nav | OBSERVED/medium (single unthrottled load) |
| Cache-Control on media: mostly public, max-age=31536000 (some immutable), some max-age=604800 | requests[].cacheControl | OBSERVED/high |

## Implications for Villa Luma (decisions, not changes)
- Do not replicate eager loading of every image or fixed single-size mobile files. Local implementation already uses AVIF/WebP srcset + sizes, a single eager fetchpriority=high hero, and lazy loading for everything else.
- The reference's media weight before scroll (~3 MB on mobile) is far above the local page; the local hero is 36.9 KB (768w AVIF) vs 209 KB.
- GSAP presence is now OBSERVED, but REV-001 deliberately uses CSS + IntersectionObserver (docs/design/MOTION.md); no change.
- Long cache lifetimes for fingerprinted assets are worth configuring on Cloudflare Pages (_headers) when deployment is planned; out of scope here.

## Not verified
Desktop and tablet media loading (blocked by bot protection for headless UA), behaviour after cookie consent, slow-network behaviour, repeat-visit caching, and any state other than the single capture above: UNKNOWN.
