# Design System — Villa Luma / REV-001

Fictional English-language lakeside hospitality design study. Original content and licensed replacement images, informed by Passalacqua's editorial proportions. No brand/logo/text reuse. Specifications: docs/reverse-engineering/passalacqua/DESIGN_BREAKDOWN.md.

| Token | Value / purpose |
|---|---|
| --color-bg | #f7f5ee cream |
| --color-surface | #eeefe4 soft green cream |
| --color-text | #283c35 dark green |
| --color-muted | #536359 body copy |
| --color-accent | #526747 olive links/focus |
| --color-accent-text / --color-white | #ffffff |
| --color-border | #b7c1ae rules |
| --color-overlay | #10251d photographic fallback |
| --content-max | 80rem |
| --radius-card | 0 |
| --gutter | clamp(1.25rem,5vw,6rem) |
| --space-section | clamp(4rem,8vw,8rem) |
| --font-display | Cormorant Garamond, Georgia, serif |

Icons (REV-005): decorative symbols (menu, close, crest, arrows, ornament) are inline SVG from src/components/ui/Icon.tsx: 24x24 viewBox, 1.5 stroke, round caps/joins, currentColor, 1em square (.icon), aria-hidden and focusable=false. Do not use Unicode symbol glyphs for decoration; they are not in the page fonts, force system font fallback during layout and render inconsistently (sometimes as emoji) across platforms.

Thin straight separators, generous negative space, serif display and restrained sans labels. Photo overlays use translucent --color-overlay equivalents; white borders use translucent white. Keep this table synchronized with src/styles/tokens.css. No image-based headings. No fake commercial conversion. Shared header/footer apply to retained /services/ route as well.
