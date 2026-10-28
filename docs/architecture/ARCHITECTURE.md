# Architecture — SSG for Crawlability, CSR for Interaction

## Rendering model

```text
Source content + static routes + CSS tokens
                    |
               next build
                    |
          out/*.html, JS, CSS
                    |
            Cloudflare Pages CDN
                    |
                 Visitors
                    |
   Small client components hydrate for interactions
```

- **SSG:** `src/app` routes, primary section content, brand/site config, SEO metadata and structured data are statically generated.
- **CSR:** interactive navigation and optional animation add progressive enhancement; browser state is not responsible for primary text.
- **No built-in application server:** Cloudflare Pages serves exported files. Backend integrations, if needed, are separate services.

## Core component rules
- `layout.tsx` and route `page.tsx` stay server/static by default.
- Route-specific presentation belongs in `components/sections`, shared site chrome in `components/layout`, interaction in `components/interactive`.
- External content needed for indexing should be collected at build time or checked into version-controlled content.
- Never rely on private runtime environment variables in browser bundles.

## SEO page strategy
- Home: broad brand positioning and navigation.
- Service pages: distinct meaningful search intents.
- Later: statically generated `blog/[slug]` from Markdown/MDX with `generateStaticParams()` and no runtime database dependency.

## Static export compatibility
Disallowed request-dependent features include SSR, ISR, Server Actions, Next middleware/proxy, request-time cookies/headers, ungenerated dynamic routes and default Next image optimization. Check the current official Next.js documentation when frameworks change.
