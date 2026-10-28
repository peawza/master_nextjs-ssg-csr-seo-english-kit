# Typography

- Base font: use a fast system stack initially; self-host a properly licensed Thai-capable font when approved.
- Use `font-display: swap` or another documented font-loading strategy if custom fonts are adopted.
- Fluid heading sizes with `clamp()`, no text rendered as images for meaningful copy.
- Base body `1rem`, line-height around `1.65` for Thai/English readability; avoid excessively long paragraph widths.
- H1 is the primary editorial heading; H2/H3 follow content hierarchy, not typography-size convenience.
- In mobile viewport widths 320–390 px, check Thai word wrapping, line height and button overflow.
