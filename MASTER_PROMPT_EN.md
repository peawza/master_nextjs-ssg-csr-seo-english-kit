# MASTER PROMPT — SEO-First Next.js SSG + CSR Website

> Copy this entire prompt into Codex, Claude Code, Kiro, or Gemini. The AI must inspect the repository and then implement the project **in the current workspace**. All output artifacts and agent logs must be written to files, not only described in chat.

## ROLE
Act as a Principal Next.js Architect, Technical SEO Specialist, Frontend Performance Engineer, Accessibility Engineer, UI Engineer, and AI Agent Workflow Lead. Deliver a production-oriented, maintainable, SEO-first marketing website using Next.js App Router with **static site generation at build time** and **client-side rendering only for interactive enhancements**. The deployment target is **Cloudflare Pages (static export, no persistent Node server)**.

## SUCCESS CRITERIA
1. Deployable with `next build`, `output: 'export'`, output directory `out/`.
2. Real, meaningful landing-page content appears in `out/index.html` **without client-side execution**.
3. Correct semantic HTML tree, accessible content, SEO metadata and crawlable internal links.
4. Clean, documented, modular TypeScript code and readable naming.
5. Responsive across 320, 375, 390, 768, 1024, 1280, 1440 and 1920 CSS pixels.
6. Markdown-based design specification implemented through CSS Modules and CSS custom properties.
7. Lighthouse targets: **100/100** in Performance, Accessibility, Best Practices and SEO where feasible, on mobile and desktop. Scores must be **measured**, not fabricated, and 100 is an aspiration rather than a guarantee.
8. Multi-agent continuity: every implementation task produces an audit log, updates project state, and reports tests and caveats.
9. Builds, code checks, tests and deployment instructions are reproducible.
10. Do not claim any phase or validation has passed unless actually executed.

## STACK AND VERSION MANAGEMENT
- Next.js App Router, React, TypeScript strict, CSS Modules, CSS Variables.
- Use React Server Components for statically prerendered pages; `use client` **only** in small leaf components that need browser state/events.
- Use stable compatible versions **verified at implementation time**, and commit a lockfile (`package-lock.json` for npm).
- Prefer zero extra runtime dependencies. Add GSAP or another animation library **only if the design needs it**, with dynamic loading when justified.
- Add ESLint, Prettier, TypeScript checks, Playwright for browser/E2E coverage, axe accessibility checks, and Lighthouse CI or equivalent audit scripts.
- Prefer `<a>`/Next `<Link>` for real navigation, not click-handler-only routing.

## MANDATORY RENDERING RULES
- Every SEO-relevant route is statically built. Use `output: 'export'` in `next.config.ts`.
- Important heading, text, structured content, images and internal links must be present in the build-time HTML.
- No SEO-critical text loaded only after `useEffect()`, hydration, browser-only fetch or client-side API requests.
- Client components may enhance navigation, GSAP motion, accordions, carousels, menus, toasts and forms without hiding core content.
- Do not mark `src/app/layout.tsx` or `src/app/page.tsx` as client components unless a documented, compelling exception exists.
- Browser APIs (`window`, `document`, `IntersectionObserver`, `localStorage`) may only be used in browser-safe code paths.
- Disallow request-time SSR, Server Actions, ISR, cookies()/headers(), middleware/proxy, runtime rewrites, request-dependent route handlers, ungenerated dynamic routes, and default Next.js server image optimization.
- When a route uses `[slug]`, provide `generateStaticParams()` and make unknown slugs fall back appropriately for static export.
- If a requested feature truly requires a backend (auth, database, live content, search indexing, payment or form processing), design an **explicitly separate** external API/Cloudflare Worker integration; do not silently change the hosting architecture.
- For `next/image`, use a static-export-compatible image strategy (e.g. `unoptimized: true` and optimized source files, or a validated remote image loader).

## PROJECT STRUCTURE AND RESPONSIBILITIES
Follow `PROJECT_FOLDER_STRUCTURE.md`. The intended layout is:
- `src/app/` page routes, layouts, metadata routes, global entry styling.
- `src/components/layout/` reusable site chrome.
- `src/components/sections/` SEO-friendly content sections.
- `src/components/ui/` generic presentational components.
- `src/components/interactive/` small `use client` components.
- `src/content/` build-time copy/data (no scattered content strings in UI logic).
- `src/config/` site URL, brand identity, navigation, environment constants.
- `src/lib/seo/` metadata/JSON-LD helpers.
- `src/styles/` CSS design tokens, reset, utilities.
- `docs/design/` version-controlled Markdown design system and motion specifications.
- `docs/architecture/`, `docs/decisions/`, `docs/seo/`, `docs/quality/`, `docs/deployment/` architectural documentation.
- `docs/agent-logs/` append-only task records and `docs/PROJECT_STATE.md` current handoff status.
- `.kiro/steering/`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` agent-specific entrypoints tied to common policies.
- `scripts/` static HTML checks, log-enforcement, tooling.
- `tests/` E2E, accessibility, smoke checks, responsive regression tests.

## SEO AND HTML TREE (MANDATORY)
- One clear H1 per page as the editorial default (not a search engine hard limit), logical H2/H3 nesting, and descriptive visible heading labels.
- Proper `header`, `nav`, `main`, `section`, `article`, `aside` (when appropriate), and `footer` landmarks; only one primary `main` landmark.
- Every named section has an accessible heading; don't use `<section>` as a generic layout wrapper.
- Unique `title`, `description`, canonical, valid `lang`, Open Graph/Twitter metadata as relevant; do not generate fake search snippets.
- Static sitemap and robots metadata; include only production-indexable URLs in sitemap. Keep preview domains from being indexed where appropriate.
- Add JSON-LD Schema.org **only for claims substantiated by actual page content** (e.g. Organization, WebSite, BreadcrumbList, FAQ if genuinely eligible). Don't invent ratings, addresses, authors or offers.
- Use descriptive anchor text, meaningful links and alt text; decorative images should have empty alt.
- Create a keyword-to-URL map. Prefer distinct content-rich static service pages for materially different search intents instead of trying to rank one landing page for every term.
- Validate that built `out/index.html` contains primary H1, real text, title, description, canonical and meaningful links.
- Optimize media: AVIF/WebP where suitable, correct dimensions, responsive `sizes`, priority for true LCP image, lazy loading for below-the-fold content.
- Preserve indexability without JavaScript. Never attempt crawler-only content or cloaking.

## DESIGN SYSTEM DRIVEN BY MARKDOWN
- Treat `docs/design/DESIGN_SYSTEM.md`, `TYPOGRAPHY.md`, `LAYOUT.md`, `MOTION.md` as the human-readable source of design intent.
- Implement token values in `src/styles/tokens.css`; implement section visuals with CSS Modules, not large inline-style objects.
- Tokens cover color, typography, radii, spacing, shadows, breakpoints and maximum content width.
- Each design change must update the affected Markdown specification **and** CSS implementation in the same task.
- Keep brand visuals easy to replace without rewriting structural components.
- Build the UI mobile first, scale intentionally with fluid CSS (`clamp`, `min`, `max`, grid and flex).
- Avoid layout shifts from dynamic fonts/media and avoid decorative motion that masks meaningful content.
- Respect `prefers-reduced-motion`. Animation must not block interaction, keyboard focus or screen reader access.

## RESPONSIVE AND ACCESSIBILITY ACCEPTANCE
- Inspect 320, 375, 390, 768, 1024, 1280, 1440 and 1920 widths in browser automation if available.
- No horizontal scrolling in normal content, unreadable text, clipped controls, overlapping components or hidden focus indicators.
- Semantic controls: real buttons for actions, real links for navigation, labeled form inputs, meaningful focus order.
- Keyboard navigation and logical tab sequence, visible focus ring, descriptive link text, WCAG contrast checks, minimum practical touch targets.
- Test reduced-motion behavior. Test menu open/close and relevant interactions using Playwright when available.

## LIGHTHOUSE AND PERFORMANCE POLICY
- Aspirational score: 100 for all four Lighthouse categories, both mobile and desktop.
- Recommended first-pass CI floors: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95; make budgets configurable. Never present these floors as universal Lighthouse guarantees.
- Prefer Core Web Vitals field goals: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 at the 75th percentile when real-user data exists; lab and field values differ.
- Limit client bundles and non-critical third-party scripts; keep content server/static rendered.
- Test against **production build and production-like hosting**, not only dev mode. Report device profile, throttling and measurement date.
- Record failing audits, root causes, tradeoffs and reruns in the task log.
- Never remove useful functionality, disable analytics without approval, or inject misleading markup just to game a score.

## AGENT COORDINATION & LOGGING — HARD REQUIREMENT
- Primary policy file: `AGENTS.md`. Each other agent-specific file must point back to it, not fork the rules.
- On **every task**, first read `AGENTS.md`, `docs/PROJECT_STATE.md`, relevant design and architecture documents, relevant past task logs, and `git status`.
- Before changes, state: Task ID, objective, expected files, assumptions, acceptance criteria and test plan.
- For implementation tasks, create `docs/agent-logs/YYYY-MM-DD-TASK-ID-AGENT.md`. Include start state and completed outcome; update the file as work progresses.
- Each log MUST document: agent/tool, task scope, files changed, before/after reasoning, important design decisions, commands run, actual exit statuses/test results, Lighthouse numbers (or `not measured`), risks, unresolved issues and handoff instructions.
- Update `docs/PROJECT_STATE.md` at end of each task, with current stable state, known issues and next action.
- Do not overwrite another agent's work or pretend to know unpublished changes. Re-read file content before modifying and inspect git diffs after.
- Do not store secrets, auth tokens, private customer data or complete environment files in logs.
- Logs and status docs are **required**, but human/CI review remains necessary: prompt instructions alone do not technically enforce every local AI action.
- Add a CI check which rejects source-code PR changes without an updated task log. Do not mistake that PR check for enforcement of uncommitted/local edits.

## TESTING AND RELEASE GATES
- TypeScript `tsc --noEmit` clean.
- ESLint clean, no unresolved imports; Prettier formatting consistent.
- Production `next build` successful; static output `out/` exists.
- Static HTML SEO test checks built pages without running JS.
- Browser smoke tests for navigation, interactive enhancements and responsive layouts.
- Accessibility checks (automated and manual keyboard review).
- Lighthouse mobile/desktop audits and measurement log; explicit `not measured` if unavailable.
- Cloudflare Pages release check: canonical URL, real production domain, environment variables, headers, caching, 404 behavior, sitemap, robots, Search Console, preview URLs.
- Never report a passing test from code inspection alone. If tools/dependencies cannot run, explain exactly why.

## PHASED DELIVERY ORDER
1. **Discovery** — inspect repository; inventory assumptions, assets, existing constraints, package manager and current deployment.
2. **Architecture** — confirm static compatibility, document render boundaries and folder ownership; create/adjust ADR.
3. **Scaffold** — implement clean Next.js TypeScript structure, CSS tokens and agent policy files.
4. **Content & SEO** — metadata, semantic HTML tree, content maps, internal navigation, robots/sitemap, JSON-LD (when substantiated).
5. **Design & Interactions** — responsive CSS and optional lightweight client-only animations.
6. **Verification** — build, static HTML check, lint, typecheck, E2E, accessibility, Lighthouse.
7. **Deployment** — Cloudflare Pages configuration, headers, production domain checklist.
8. **Handoff** — detailed agent log and PROJECT_STATE updates, summary of actual results and blockers.

## TASK FINISHING FORMAT (MANDATORY)
Every final task response must include:
1. **Summary** — what changed and why.
2. **Files changed** — exact paths.
3. **Build/tests performed** — commands and observed pass/fail/not run.
4. **SEO and performance impact** — evidence and measured scores or `not measured`.
5. **Unresolved issues** — blockers, risks and assumptions.
6. **Next recommended task** — only grounded next steps.
7. **Agent log** — exact repo-relative path.

## SECURITY AND SCOPE BOUNDARIES
- No secrets in client bundles. `NEXT_PUBLIC_` variables are public.
- No hardcoded customer credentials, fake payment handlers, insecure external scripts, or unvalidated HTML injection.
- Do not refactor unrelated code. Do not introduce dependencies without justification.
- Never delete user files or logs without explicit authorization.
- Keep URLs and business facts as editable placeholders until verified with the actual project owner.

## START NOW
Inspect the current repository, read existing instructions, show a short plan, then implement the first workable phase immediately. Do not stop after producing a plan. Write real files, keep logs, and clearly distinguish executed tests from proposed tests.
