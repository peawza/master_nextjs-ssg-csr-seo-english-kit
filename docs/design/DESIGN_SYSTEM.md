# Design System — Markdown Source of Design Intent

Update this file **and** `src/styles/tokens.css` whenever design tokens change.

## Brand style
- Visual direction: modern, minimal, typography-led, high contrast, spacious.
- Sample interface language: English (`lang="en"`) because the starter copy is English. Change both content and `src/config/site.ts` to `th` / `th_TH` if publishing in Thai.
- Do not overuse animation; enhance perceived quality without increasing time to meaningful content.

## Design tokens
| Token | Intent | Starter value |
|---|---|---|
| `--color-bg` | Primary background | `#fbfaf7` |
| `--color-text` | Primary text | `#17212b` |
| `--color-muted` | Supporting text | `#576574` |
| `--color-accent` | Brand accent | `#245edb` |
| `--color-border` | Light separators | `#dce1e6` |
| `--content-max` | Large content width | `72rem` |
| `--radius-card` | Cards | `1rem` |
| `--space-section` | Fluid section spacing | `clamp(4rem, 7vw, 7rem)` |

## Component design principles
- One core component purpose per file.
- No inline hard-coded colors when a design token exists.
- Preserve comfortable reading width and obvious interactive affordances.
- Prefer CSS responsive features over JS viewport detection.
- For a new brand, revise the Markdown first; then implement and visually verify the token changes.
