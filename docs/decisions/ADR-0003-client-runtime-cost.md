# ADR-0003: Client runtime cost of App Router hydration on a mostly static page

Status: Proposed (REV-006), awaiting decision
Date: 2026-10-29

## Context
Under applied throttling (Lighthouse devtools mode, slow 4G, 4x CPU), the home page has TBT median 339 ms (n=5, range 233-658) and TTI median 3.7 s. REV-006 measurements (docs/reverse-engineering/passalacqua/VERIFICATION_REPORT.md, REV-006 section):

| Variant (devtools mode, n=5) | TBT median | TTI median | LCP median | Perf median |
|---|---|---|---|---|
| E0 shipped build | 339 ms | 3737 ms | 2259 ms | 88 |
| E1 same page, no client components (SiteMenu, MotionEnhancer removed) | 367 ms | 3172 ms | 1957 ms | 89 |
| E2 same HTML, all Next/React JS and RSC payload removed (menu/motion non-functional) | 0 ms | 1940 ms | 1902 ms | 98 |

- Our client components cost ~2 KB gzip and no measurable main-thread time. The cost is the App Router runtime (React DOM + router, ~117 KB gzip) evaluating and hydrating the whole document from the RSC payload (30 KB, 59% of the HTML).
- App Router has no supported way to ship a route without the runtime. Pages Router has `export const config = { unstable_runtimeJS: false }`, which is unstable and undocumented and has no App Router equivalent (vercel/next.js discussion #75230).

## Options
A. Keep ADR-0001 as is. Accept TBT ~340 ms / TTI ~3.7 s under 4x CPU. Monitor field INP after launch. Zero migration cost.
B. Pages Router route with `unstable_runtimeJS: false` for the home page, plus a small vanilla progressive-enhancement script (menu dialog, reveal) loaded with `<script defer>` from public/. Expected close to E2 (TBT ~0). Costs: depends on an unstable flag; two routers; SiteMenu/MotionEnhancer rewritten without React; tests must still pass.
C. Post-export transform that strips the Next runtime from out/ and injects vanilla scripts. Same gain as B but fragile across Next upgrades and invisible to Next's own tooling. Not recommended.
D. Move the static site to a zero-JS-by-default SSG (for example Astro or Eleventy) with islands or vanilla scripts. Best long-term fit for content sites; largest migration; replaces ADR-0001.

## Recommendation
A for now. The page already meets the ADR-0002 LCP gate, TBT under 4x CPU is moderate, and the site has no field data or launch date. Revisit with B or D if field INP is poor or the site grows into many mostly static pages.

## Consequences
To be filled when accepted. A keeps the current architecture. B, C or D supersede parts of ADR-0001 and require updates to ARCHITECTURE.md, AGENTS.md and tests.
