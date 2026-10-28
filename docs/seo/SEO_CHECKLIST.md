# SEO Acceptance Checklist

## Document and metadata
- [ ] Every production route has a distinct title and natural description.
- [ ] Canonical URLs point to correct HTTPS production URLs.
- [ ] `<html lang>` is correct for the main content language.
- [ ] Robots and sitemap are generated, use the production domain and exclude preview/test paths.
- [ ] Open Graph/Twitter metadata and preview images are accurate where included.

## HTML tree
- [ ] One clear main H1 per page as the style convention.
- [ ] Logical H2/H3 outline; no heading selected purely by visual size.
- [ ] Exactly one meaningful `<main>` landmark, usable header/nav/footer landmarks.
- [ ] Meaningful sections are labeled by their visible headings.
- [ ] SEO text exists in raw build output, with real internal `<a href>` links.
- [ ] No critical text hidden until JS starts; content readable when JS is disabled.

## Content and structured data
- [ ] Keyword-to-URL map describes search intent and page ownership.
- [ ] Service pages contain genuine unique copy, internal links and descriptive CTAs.
- [ ] JSON-LD reflects content that is visible and verifiably true.
- [ ] Media use descriptive alt text or empty alt for purely decorative assets.
- [ ] No broken links, invented ratings/reviews or keyword stuffing.

## Search readiness
- [ ] `npm run build` and `npm run verify:html` pass.
- [ ] Submit production sitemap to Google Search Console after verifying site ownership.
- [ ] Monitor indexing, Core Web Vitals and real search performance over time.
