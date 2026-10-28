# Implementation plan — REV-001
1. Capture/reference specs before app edits (see audit).
2. Download licensed replacement images, create local 640/1280/1920 WebP variants and font with license. Registry records source and crop; no reference images shipped.
3. Keep server root/page/sections, typed content in src/content/villa.ts, scoped CSS Module. Replace header/footer with shared study chrome; services content unchanged.
4. Client leaves: native-dialog SiteMenu and IntersectionObserver MotionEnhancer. Permanent footer nav is no-JS fallback; section content remains server rendered.
5. Responsive CSS and synchronized design docs/tokens. No framework or runtime dependency added for animation.
6. Add static HTML assertions; production export; browser tests across widths, keyboard, no JS, reduced motion, failing media; retain reproducible test scripts.
7. Lighthouse three mobile and desktop runs; report actual medians and intentional noindex SEO limitation. Save local screenshots and handoff.

Interfaces: typed anchor navigation; Media { name, alt, width, height, position? }; suite and editorial data. Static files only; no APIs, migrations, or request-time features. Static serving script for reproducible local verification; no deploy.
Acceptance and dependency sequence: task.md. All unfinished verification remains NOT RUN.
