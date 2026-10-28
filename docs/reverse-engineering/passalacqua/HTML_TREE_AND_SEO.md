# HTML tree and SEO — REV-001
header (brand, menu control, suites CTA)
main#main-content (focus target)
  hero: h1
  section#about: h2
  section#seasons: h2; seasonal articles h3
  section#suites: h2; three articles h3
  section#stories: h2
  section#journal: h2
  section#places: h2; two articles h3
footer#about-project: h2, nav, fictional-study disclosure

All copy and image alt text in build-time HTML. Every ID unique. Native anchors link to real sections. /services/ retained. Root metadata title/description/canonical/OG describes fictional study; WebSite JSON-LD (not Hotel/Organization claims). Noindex/follow applies globally while domain is example.com. robots permits crawl so meta noindex can be read; noindex header on Cloudflare as defense. Sitemap retains static routes but is not submitted. No booking, forms or tracking. Production launch requires domain/indexing review, outside this task.
