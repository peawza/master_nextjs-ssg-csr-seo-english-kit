# Design breakdown — REV-001
Evidence: REFERENCE_AUDIT R01–R07. This is an adaptation using new copy and images.

## Selected local tokens (not claims of exact reference values)
Cream #f7f5ee; ink #283c35; muted #536359; accent #526747; border #b7c1ae; surface #eeefe4; white #ffffff. Content max 80rem. Gutter clamp(1.25rem,5vw,6rem). Section spacing clamp(4rem,8vw,8rem). Thin straight rules; no rounded card chrome.
Cormorant Garamond OFL self-hosted serif for display, system sans for body. Body 16px/1.7. Hero heading clamp(3.5rem,6.2vw,6.5rem); section display clamp(2.6rem,4.6vw,4.8rem). Label uppercase 11px with generous tracking.

## Composition and responsive rules
Header grid 1fr/auto/1fr with centered typographic brand. Hero photographic landscape, dark gradient beneath bottom-left H1, minimum 38rem desktop/34rem mobile. Desktop hero height 88svh capped 62rem. Desktop 5vw gutter.
Centered introductory serif statement with small botanical line ornament. Editorial grid 1.15fr/.85fr, generous gap; portrait next to prose then reversed feature. Suite overview and 3-column image cards. Full-width story panel. Two-column journal. Related places alternating image/text. Footer with permanent navigation and clear fictional-study disclosure.
Below 768px: stack editorial grids, cards one column, shrink gutters, menu one column with internal scroll. Above: two menu groups with divider. All images explicit intrinsic size, object-fit cover, recorded focal positions. Footer wraps.
No horizontal overflow allowed even where the reference overflowed. Hero crop center; room images center; lake crop center 55%. Contrast and usability take priority over exact color matching.
