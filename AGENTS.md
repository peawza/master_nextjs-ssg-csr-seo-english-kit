# AGENTS.md — Shared Operating Rules

**Read before starting every task.** This is the canonical policy for Codex, Claude Code, Kiro and Gemini. Agent-specific files must not duplicate or override core architecture decisions without an ADR.

## Mission
Maintain an SEO-first, accessible, responsive Next.js App Router website deployed as static output (`out/`) on Cloudflare Pages. Serve meaningful SSG HTML; use CSR only for progressive enhancement.

## Read-first checklist
1. `docs/PROJECT_STATE.md` — current truth and handoff.
2. `docs/architecture/ARCHITECTURE.md` and relevant ADRs.
3. `docs/design/` documents applicable to your change.
4. Recent relevant files in `docs/agent-logs/`.
5. `git status --short` and the target files before modifying them.

## Code non-negotiables
- TypeScript strict; predictable readable file and component names.
- Server/static components by default; `use client` only at interactive leaves.
- No request-time SSR, ISR, Server Actions, middleware, request-dependent API routes, runtime image optimizer or ungenerated dynamic paths.
- SEO-critical content must exist in exported HTML without JavaScript.
- Semantic landmarks, strong headings, keyboard navigation, accessible motion, responsive layout.
- CSS tokens + CSS Modules; design markdown and CSS must stay synchronized.
- Keep dependencies minimal; do not add third-party scripts by default.
- Never include secrets in client source, logs or screenshots.

## Agent execution protocol
1. Give the task an ID, e.g. `SEO-003`.
2. Explain scope and acceptance tests **before editing**.
3. Create or update `docs/agent-logs/YYYY-MM-DD-TASK-ID-AGENT.md`.
4. Implement the smallest safe change; avoid unrelated refactors.
5. Run real tests as available; record full commands and observed status (pass/fail/not run).
6. Review the diff, report side effects and unresolved questions.
7. Update `docs/PROJECT_STATE.md` including next actionable step.
8. End the user-facing message with exact paths to the log and state file.

## Mandatory log fields
Date/time (with timezone); agent; task ID; goal; pre-change state; edited paths; technical decisions; commands/tests with actual outcomes; SEO impact; Lighthouse impact/actual measured scores; risks/blockers; handoff and next action.

If tests cannot run, explicitly say `NOT RUN` and why. Do not report estimated Lighthouse scores as measured scores. Do not invent implementation results.

## Changes and collaboration
- Preserve user edits and uncommitted changes; inspect `git status` first.
- Never delete or rewrite another agent's log; make a new task log or append a dated correction.
- Changes to architectural boundaries require an ADR.
- `docs/agent-logs/` and `docs/PROJECT_STATE.md` must remain plain text readable by all agents.
- Source-editing PRs must include a task log; `.github/workflows/agent-log-check.yml` checks this for PRs, not local editor changes.

## Quality targets
Production build; typecheck; lint; accessible browser behavior; static HTML SEO assertions; mobile/desktop Lighthouse audits where available. Aim for 100/100, but report actual measurement and respect functional correctness.
