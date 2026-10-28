# Asset registry — REV-001
Downloaded 2026-10-28. Machine-readable URLs, byte sizes and responsive dimensions: assets.json.
All photos are replacement illustrative stock, not photographs of a real Villa Luma and not copied from the reference. Sources are the Unsplash image IDs below. License reviewed: https://unsplash.com/license (commercial/noncommercial download and adaptation permitted; not a competing image library). Authors not independently verified; no fabricated attribution. Photo reuse is limited to this design study.

| Local stem | Unsplash source ID | Crop/focal | Use |
|---|---|---|---|
| lake | photo-1476514525535-07fb3b4ae5f1 | 3:2 variants, center55% | hero, seasons, story |
| room | photo-1611892440504-42a792e24d32 | 3:2 source, center | suite |
| terrace | photo-1566073771259-6a8506099945 | 3:2 source, center | suite, journal |
| dining | photo-1414235077428-338989a2e8c0 | 3:2 source, center | seasonal, related place |
| garden | photo-1418065460487-3e41a6c84dc5 | 3:2 source, center | seasonal, suite, related place |

Variants: 640x427,1280x853,1920x1280 WebP. Display crops defined in CSS. Alt text in src/content/villa.ts. Hero eager/high priority; remaining images lazy. Website loads all assets locally, no Unsplash requests at runtime.
Font: https://github.com/google/fonts/tree/main/ofl/cormorantgaramond ; unmodified CormorantGaramond[wght].ttf renamed locally, with original OFL text at public/fonts/OFL-CormorantGaramond.txt. Body uses system fonts.
Reference screenshots are documentation only and never imported into the website.

Optimization: the initial 1,195,560-byte TTF was replaced by the Google Fonts Latin WOFF2 subset at https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2 (same OFL; locally hosted). TTF removed from public output. Original sun favicon is authored SVG. Alt descriptions corrected after visual inspection.

## AVIF optimization
scripts/optimize-study-assets.mjs uses development-only sharp, deriving AVIF from downloaded 1920px WebP sources. Dimensions/bytes recorded in optimized-assets.json. Generic widths 640/960/1280/1920; quality42. Mobile hero uses a center crop to 2:3 (640x960 and960x1440); 27,624 and54,086 bytes. Original WebP remains a compatibility fallback. No network-dependent transformation at runtime.
