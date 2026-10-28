# Responsive Layout

## Guiding principle
Mobile first; use intrinsic sizing, `minmax()`, flex wrap and fluid spacing. Do not build fixed-width pages that only fit on a 1440px screenshot.

## Test widths
320 / 375 / 390 / 768 / 1024 / 1280 / 1440 / 1920 CSS px.

## Baseline tokens and rules
- Container `width: min(calc(100% - 2rem), var(--content-max))`.
- Breakpoints are chosen based on component needs, not a specific device brand.
- Main content must not overlap sticky/fixed navigation.
- Explicit image aspect ratios and measured intrinsic sizes prevent CLS.
- Use semantic section spacing, consistent gutters and accessible focus margins.

## Release acceptance
No accidental horizontal scroll, clipping, unreadable text, hidden controls, keyboard traps or layout shifts during media loading.
