# Lighthouse and Web Vitals Measurement Policy

## Goals and reality
Aim for Lighthouse **100/100** across Performance, Accessibility, Best Practices and SEO on mobile and desktop. A score is affected by browser version, network conditions and other external factors; **never guarantee or invent 100**.

## Suggested CI thresholds
- Performance >= 90
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 95

Make thresholds configurable and record the exact audit environment; do not silently lower budgets to make a build pass.

## Performance principles
- LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 are good field-performance targets (75th percentile) where field data exists.
- Audit built production site, not the Next dev server.
- Pre-render SEO content; ship minimal JS; prevent third-party scripts from blocking initial paint.
- Compress and size images, use modern formats and avoid layout shifts.
- Motion must respect reduced-motion and not lock main-thread input.

## Mobile LCP measurement mode (ADR-0002)
- Report two mobile LCP numbers: default simulated (Lantern) and applied throttling (`throttlingMethod: 'devtools'`, Lighthouse mobile slow-4G values, 4x CPU), each a median of 3 runs.
- The LCP <= 2.5 s gate uses the applied-throttling median. The simulated value (~2.8 s for the current App Router page) is reported, labelled, and not "fixed" with script-deferral hacks.
- Under applied throttling, also record TBT and long tasks; main-thread cost is the leading INP risk.

## Required evidence in each performance task log
Date, URL/build commit, device profile, network simulation, Lighthouse version, category scores, Web Vitals, failed audits and concrete remediation. Write `NOT MEASURED` when results are unavailable.
