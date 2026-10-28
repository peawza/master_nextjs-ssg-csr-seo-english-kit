# Responsive layout — REV-001
Mobile-first behavior; single-column editorial/cards below 768px, two-column editorial and three-column suites above. Gutter clamp(1.25rem,5vw,6rem). Section max-width 100rem; utility container 80rem. Hero 88svh (max 62rem/min 38rem), mobile 75svh (min34rem/max50rem). Header in normal flow, not sticky.
Landscape image 3:2; portrait 4:5; suites desktop 3:4/mobile4:3. Intrinsic dimensions plus object-fit cover. CSS responsive srcset files, no runtime image optimization. Full-screen menu scrolls internally and uses native dialog modal semantics. Footer always offers navigation without JS.
Test widths 320/375/390/768/1024/1280/1440/1920. No clipping or accidental horizontal scroll. Preserve readable fallbacks if media/fonts fail. Main content and every linked section focusable with tabindex=-1.

Performance refinement: AVIF sources at 640/960/1280/1920 with WebP fallback; hero uses a center-cropped 2:3 mobile AVIF below768px. Existing CSS display ratios stay unchanged.
