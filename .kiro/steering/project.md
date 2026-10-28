---
inclusion: always
---

# Project Steering — SEO-First Next.js Website

The canonical cross-agent policy is `AGENTS.md` at repository root; read it before implementing changes. This repository deploys as a **Next.js static export** to Cloudflare Pages. Render primary SEO content at build time, put `use client` only in interactive leaf components, and maintain the Markdown design specifications in `docs/design/`. Avoid any unsupported request-time Next.js features.
