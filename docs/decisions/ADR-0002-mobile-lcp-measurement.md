# ADR-0002: Accept simulated mobile LCP ~2.8 s; gate on applied-throttling LCP and main-thread cost

Status: Accepted (REV-003)
Date: 2026-10-29

## Context
The Villa Luma home page is a Next.js App Router static export (ADR-0001). With Lighthouse 13.6 default mobile settings (simulated throttling, Lantern), median mobile LCP is 2800 ms against a 2.5 s target, while FCP is ~0.9 s and the LCP element is the eager, fetchpriority=high hero image (36.9 KB AVIF).

Evidence (docs/reverse-engineering/passalacqua/VERIFICATION_REPORT.md, REV-002 and REV-004 sections):
- Lantern's LCP graph includes every non-low-priority-image request and CPU task that finished before the observed LCP, including Next's async JS chunks (~148 KB React + App Router runtime) and their evaluation. Locally these finish before the first paint, so they always count.
- Removing the external script tags (diagnostic only) gives 1580 ms. Deferring the chunks until after the hero load (option B) or after load + 2 animation frames (B2) gives no gain (2921 / 2791 ms), because the observed first paint (~200 ms) still comes after the deferred scripts run. B also breaks the requirement that navigation is not gated by media (test fails in all three engines).
- Lighthouse with applied DevTools throttling (slow 4G, 4x CPU) gives median LCP 2267 ms, LCP = FCP in every run.
- The App Router runtime cannot be removed without leaving the architecture in ADR-0001.

## Decision
1. Accept the simulated mobile LCP of ~2.8 s for this page. Do not ship script-deferral hacks or post-export HTML rewriting aimed at the simulator.
2. For mobile LCP, the gating number is Lighthouse with `throttlingMethod: 'devtools'` and Lighthouse's mobile slow-4G values, median of 3: target <= 2.5 s. Keep reporting the simulated value alongside it, labelled as such.
3. Track main-thread cost under applied 4x CPU (TBT, long tasks, style/layout) as the leading risk for INP. Field INP/LCP become the source of truth once the site has real traffic.
4. Re-run both modes after any change to client components, Next.js version or hero media.

## Consequences
- Positive: no fragile build steps; interactivity is not delayed; measurement reflects real slow-network paint order.
- Negative: the default Lighthouse mobile report still shows LCP in the orange band and Performance ~96 instead of 100.
- Operations: performance task logs must state the throttling method for every LCP number.

## Revisit when
Next.js offers supported control over chunk loading/hydration priority, client JS is substantially reduced, field data contradicts the lab results, or the project leaves App Router.
