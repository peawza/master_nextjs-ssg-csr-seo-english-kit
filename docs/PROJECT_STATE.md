# PROJECT STATE — Canonical AI Handoff

Last updated: 2026-10-28 (Asia/Bangkok)
Status: **REFERENCE SCAFFOLD CREATED — NOT VERIFIED BY BUILD**

## Project purpose
SEO-first marketing website with build-time static HTML, lightweight client interactions, shared Markdown design system and free static deployment to Cloudflare Pages.

## Implemented in the starter kit
- English master prompt, shared rules and agent-specific entrypoints.
- Sample semantic homepage, static services route, CSS tokens and mobile navigation.
- Example metadata, sitemap/robots handlers and Cloudflare Pages header file.
- Sample static HTML validation script and PR-level agent log checker.

## Verification results
- Files were generated and ZIP structure checked: **YES**.
- npm install: **NOT RUN** (npm registry unavailable in the file-generation runtime).
- Typecheck / ESLint / Next build / Playwright / Lighthouse: **NOT RUN**.
- Production deployment: **NOT RUN**.

## Known placeholders and risks
- Domain is `https://example.com`; change before launch.
- Business copy and email are placeholders; confirm factual claims.
- Dependencies are a starter range, not a committed lockfile; verify compatible stable versions and create lockfile.
- Playwright/Lighthouse tooling must be installed and configured by the implementing agent.

## Next suggested task
BOOT-001: Verify dependencies, install, create package lock, run typecheck/lint/build; fix any failures. Create a dated agent log with exact commands and results.

## Handoff protocol
Read `AGENTS.md` → this file → relevant design specs → recent agent logs → git status. After task completion, update this file and record measured validation results.
