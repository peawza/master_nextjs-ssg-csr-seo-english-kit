# SEO-First Next.js SSG + CSR — English Agent Starter Kit

An English **master prompt, documented folder architecture, multi-agent handoff rules, and sample Next.js source scaffold** for a Cloudflare Pages static website.

## Start here

1. Read `MASTER_PROMPT_EN.md` and `PROJECT_FOLDER_STRUCTURE.md`.
2. Open this extracted directory in Codex, Claude Code, Kiro or Gemini.
3. Paste the master prompt to the agent and ask it to **initialize, complete and test the project in this directory**.
4. Replace the example brand, content, domain and design tokens in `src/config/site.ts`, `src/content/home.ts`, and `docs/design/`.
5. Have the agent verify compatible package versions, run `npm install` to create a `package-lock.json`, `npm run build`, and the relevant checks.
6. Push to GitHub and connect that repo to Cloudflare Pages, setting `npm run build` and output directory `out`.

## Example local setup (after version verification)

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run verify:html
```

The included `package.json` and source files are **a reference starter**, not a verified final deployment. This environment could not download npm dependencies, so no successful install/build/Lighthouse score is claimed. Have the agent resolve any version/API changes before committing a lockfile.

## What is included

- English master prompt with strict SSG/CSR, SEO, HTML-tree, responsive and Lighthouse requirements.
- Actual `src/`, `public/`, `scripts/`, docs and agent policy directories.
- Initial Home page (7 semantic sections) plus one `/services/` SEO route.
- Markdown design system mapped to CSS variables and CSS Modules.
- Static metadata, sitemap/robots, build HTML checker and a GitHub PR log gate.
- `AGENTS.md` (Codex, common rules), `CLAUDE.md`, `GEMINI.md`, `.kiro/steering/`.

## Host architecture

`Next.js (SSG at build) -> out/ (static HTML/CSS/JS) -> Cloudflare Pages CDN -> visitors`.

Client components are small, progressive enhancements, not the source of SEO-critical copy. Do **not** switch to an always-on Node server, deploy request-time SSR, or add Next Server Actions without explicitly changing the deployment design.

## Important limits

- Lighthouse 100/100 is an aspirational design/testing goal, not a guaranteed score.
- Agent task logs are a **process requirement**; the included GitHub workflow enforces logs for source-file changes on PRs, but cannot automatically prove that every local AI action was logged.
- Before production, replace `https://example.com`, placeholder email and brand identity; verify canonicals, robots, sitemap and legal/privacy details.
- The initial sample website is illustrative; the **master prompt** directs the AI to implement complete design, tests, CI and final content based on your real brief.

## Reference documentation

- Next.js Static Exports: https://nextjs.org/docs/app/guides/static-exports
- Cloudflare Pages (Next.js static): https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
- Kiro Steering: https://kiro.dev/docs/steering/
