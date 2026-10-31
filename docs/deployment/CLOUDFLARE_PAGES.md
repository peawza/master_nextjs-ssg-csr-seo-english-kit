# Deploy to Cloudflare Pages (Static Next.js)

Two supported paths:
- **Git integration** (steps below): Cloudflare builds from the repository.
- **Direct Upload from Windows with Docker** (DEPLOY-001): `build.bat`, `preview.bat`, `deploy-cloudflare.bat`. See [DOCKER_AND_BATCH.md](DOCKER_AND_BATCH.md). Choose one per project: Cloudflare does not let a project switch between Direct Upload and Git integration in either direction; you would create a new project ([Direct Upload docs](https://developers.cloudflare.com/pages/platform/direct-upload/)).

1. Verify `next.config.ts` uses `output: 'export'`.
2. Run `npm install` and commit `package-lock.json`; use `npm ci` in CI afterward.
3. Run `npm run typecheck`, `npm run lint`, `npm run build`, `npm run verify:html`.
4. Verify the build produced `out/index.html`, `out/services/index.html`, `out/robots.txt` and `out/sitemap.xml`.
5. Push the Git repository to GitHub.
6. In Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect Git repository.
7. Framework preset: **Next.js (Static HTML Export)**.
8. Production branch: `main`.
9. Build command: `npm run build` (equivalent to Next's `next build`).
10. Build output directory: `out`.
11. Set a compatible Node.js version in Cloudflare Pages build environment if needed, and confirm the selected version works with the installed Next.js version.
12. Add your real custom domain and HTTPS, then replace example.com in `src/config/site.ts` and rebuild.
13. Verify HTTP status, redirect/canonical behavior, static headers, robots/sitemap, 404 handling and mobile loading.
14. Connect Google Search Console and monitor real indexing/performance.

## Static-export boundaries
Pages is serving static HTML/CSS/JS; there is no long-lived Next.js server. For forms, auth or transactional APIs, choose a separately managed backend/Worker and document it clearly.

## Reference
https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
