# task.md — แผนทดลองสร้างหน้าแรกแนว Passalacqua ด้วย Next.js

Task ID: REV-001 | Agent: Codex (ต่องานโดย Kiro 2026-10-29) | วันที่: 2026-10-28 (Asia/Bangkok)
สถานะ: เสร็จในขอบเขต local (2026-10-29) ไม่มี P0/P1; รายการ P2 อยู่ใน VERIFICATION_REPORT.md
Reference: https://www.passalacqua.it/en/

## เป้าหมายและขอบเขต
หน้าแรก Villa Luma — Design Study พร้อมเมนู ใช้ชื่อ ข้อความ และภาพใหม่ที่มีสิทธิ์ ไม่ใช่โรงแรมจริง ไม่รับจอง ไม่มี backend, CMS, analytics, หลายภาษา หรือ production deployment รักษา /services/ เดิม
Next.js App Router + TypeScript strict + CSS Modules/tokens + static export out/ สำหรับ Cloudflare Pages เนื้อหา SEO อยู่ใน HTML; CSR เฉพาะ interactive leaves

## ลำดับงานและเกณฑ์ผ่าน
### REV-001A — Baseline
- [x] อ่าน AGENTS.md, REVERSE_ENGINEERING.md, state, architecture, ADR และ design docs
- [x] ตรวจ git status; รักษา REVERSE_ENGINEERING.md และ .playwright-mcp/ ที่มีอยู่
- [x] บันทึก Node/npm และเปิด task log
- [x] ติดตั้ง dependency/lockfile และตรวจ baseline; แยกผลเดิมจากผลหลังแก้ (ดู Codex log)
เกณฑ์: ไม่เขียนทับงานผู้ใช้ รู้ข้อจำกัด tooling

### REV-001B — Reference evidence
- [x] เปิด browser ตรวจ DOM/computed styles
- [x] ภาพ full-page 1440x900, 390x844, 768x1024 และ menu desktop/mobile
- [x] สำรวจ width 320,375,1024,1280,1920 และ Escape
- [x] ตรวจ section closeups, hover/focus, scroll และ media loading เพิ่ม — closeups/hover/focus/scroll (R08–R13); media loading มือถือ 390x844 OBSERVED ใน REV-004 (MEDIA_LOADING_AUDIT.md) ส่วน desktop ถูก Cloudflare 403 บล็อก headless จึงเป็น UNKNOWN
หลักฐานต้องมี URL เวลา viewport state OBSERVED/INFERRED/UNKNOWN และ confidence ห้ามอ้าง library/timing ที่ไม่ทราบ ห้ามส่งแบบฟอร์มหรือทำธุรกรรม

### REV-001C — Specifications before code
- [x] สร้าง REFERENCE_AUDIT, DESIGN_BREAKDOWN, ANIMATION_SPEC, HTML_TREE_AND_SEO, IMPLEMENTATION_PLAN, VERIFICATION_REPORT ภายใต้ docs/reverse-engineering/passalacqua/
- [x] ปรับเอกสาร design และ tokens ให้ตรงกัน (DESIGN_SYSTEM.md ตรงกับ src/styles/tokens.css ทุกค่า; MOTION.md ตรงกับ 180/250/400ms ในโค้ด)
เกณฑ์: แยกค่าที่วัดจากค่าที่เลือก; ไม่มีการคัดลอก source/brand assets

### REV-001D — Content/media
- [x] เตรียม hero, introduction, seasons, seasonal features 2 เรื่อง, suites 3 แบบ, stories, journal, related places 2 ส่วน และ footer
- [x] บันทึก provenance/license, dimensions, alt, focal point และ responsive variants (ASSET_REGISTRY.md, assets.json, optimized-assets.json)
- [x] โหลด hero ก่อนและ lazy-load ส่วนล่าง ไม่มี hotlink (verify:html ยืนยันว่า media ทั้งหมดเป็นไฟล์ local)
เกณฑ์: เนื้อหาใหม่ ไม่มี fake testimonials/รางวัล/ราคาหรือคำกล่าวอ้างโรงแรมจริง

### REV-001E — Semantic architecture
- [x] Static page/sections/header/footer และ typed content; interactive menu/motion leaves
- [x] H1 เดียว, heading hierarchy, skip link, anchors จริง
- [x] เก็บ /services/, ไม่มี API/SSR/ISR/Server Actions (build: ทุก route เป็น Static)
- [x] Metadata/OG/canonical ของ design study และ noindex
เกณฑ์: ไม่มี JS ก็อ่านเนื้อหาและใช้ navigation ได้; out/index.html มีเนื้อหาครบ

### REV-001F — Responsive layout
- [x] Hero/editorial/cards/footer ด้วย CSS Modules; fluid type และ image crop
- [x] ตรวจ 320/375/390/768/1024/1280/1440/1920 (ผ่านใน Chromium, Firefox, WebKit)
เกณฑ์: ไม่ล้นแนวนอน ไม่ตัดข้อความ ไม่มีภาพบิดหรือ CTA ทับเนื้อหา

### REV-001G — Interaction/motion
- [x] Menu button aria-expanded/controls, modal focus, Escape, restore focus, anchor close, scroll unlock
- [x] No-JS navigation fallback
- [x] CSS 180ms hover, 250ms menu, 400ms reveal <=16px ครั้งเดียว
- [x] IntersectionObserver cleanup; reduced motion ไม่มี reveal/translation/smooth scroll
เกณฑ์: H1/CTA ไม่รอ JS; ไม่มี keyboard trap/scroll lock ค้าง; ไม่เพิ่ม GSAP

### REV-001H — Build/static verification (2026-10-29: ผ่านทั้งหมด)
- [x] npm.cmd run typecheck
- [x] npm.cmd run lint
- [x] npm.cmd run build
- [x] npm.cmd run verify:html
ตรวจ H1, ทุก section, anchor IDs ไม่ซ้ำ, metadata/canonical/OG, /services/, sitemap/robots ไม่มี canonical ของต้นฉบับ

### REV-001I — Browser/visual (2026-10-29: ผ่าน 45 ข้าม 6 ไม่ผ่าน 0)
- [x] Tab/Shift+Tab/Enter/Space/Escape, focus และ anchor
- [x] JavaScript disabled, reduced motion, slow network (จำลองหน่วง 700ms), image/font failure
- [x] Chromium/Firefox/WebKit; ภาพ local ตรง viewport reference
- [x] Local screenshot regression baseline (เฉพาะ Chromium; Firefox/WebKit ตรวจด้านการทำงาน)
เกณฑ์: ไม่มี P0 (ใช้งาน/build ไม่ได้) หรือ P1 (layout/accessibility หลักเสีย); P2 บันทึกติดตาม ไม่ใช้ pixel-perfect กับภาพคนละชุด

### REV-001J — Lighthouse/SEO (2026-10-29, lighthouse-results/final/)
- [x] Production static server; mobile/desktop อย่างละ 3 รอบ รายงาน median
  - Mobile: P95 A100 BP100 SEO69 LCP 2896ms CLS 0 — LCP ไม่ถึงเป้า 2.5s (P2)
  - Desktop: P100 A100 BP100 SEO69 LCP 646ms CLS 0
  - SEO 69 มาจาก noindex ที่ตั้งใจไว้เท่านั้น
เป้าหมาย P>=90, A/BP/SEO>=95, LCP<=2.5s, CLS<=0.1; noindex ของ design study ต้องคงไว้แม้ลด SEO score ไม่อ้าง field INP หากไม่มีข้อมูลจริง; NOT RUN พร้อมเหตุผลหากเครื่องมือไม่พร้อม

## Interfaces และ defaults
English UI; Thai task plan. Internal typed navigation/media/editorial content only ไม่มี public API. Brand Villa Luma; self-hosted OFL font และภาพ Unsplash พร้อม provenance. ไม่มี audio/intro blocker, autoplay slider, scroll hijacking หรือ custom cursor. Hero static และ visible; responsive CSS ไม่ใช้ viewport JS.

## Dependency และส่งมอบ
A → B → C → D → E → F → G → H/I/J → handoff
ส่งมอบ task.md, สเปก 6 ไฟล์, asset registry, source, lockfile, static out/, ภาพหลักฐานและรายงานผลจริง ไม่ deploy
จบงานเมื่อทุก section ใช้ได้ ไม่มี P0/P1, review diff แล้ว และอัปเดต log/state พร้อม next action; สิ่งที่ยังตรวจไม่ได้ห้ามทำเครื่องหมายผ่าน

## งานต่อ (REV-002, ไม่บังคับ)
- [x] REV-003 ตัดสินใจเรื่อง mobile LCP: ADR-0002 (option A) ใช้ค่า devtools throttling เป็นเกณฑ์ ได้ 2104ms ผ่าน; ค่า simulated 2820ms รายงานไว้แต่ไม่ใช้ตัดสิน
- [x] REV-005 ลด main-thread: เปลี่ยน symbol glyph เป็น SVG icon ลด first layout ~27% (trace 4x CPU); TBT ใน Lighthouse ไม่เปลี่ยนเกินกว่าความผันผวนระหว่างรอบ (ถูก JS ของ framework ครอง)
- [x] REV-006 วัดต้นทุน JS ฝั่ง client: component ของเราแทบไม่มีผล (ตัดออกแล้ว TBT 367 เทียบกับ 339ms) ต้นทุนมาจาก App Router runtime ทั้งหมด (ตัด framework JS ออกแล้ว TBT 0) เสนอทางเลือกใน ADR-0003 (Proposed) รอตัดสินใจ
- [ ] (เดิม) ลด mobile LCP ให้ต่ำกว่า 2.5s — ทำบางส่วน: เพิ่มภาพ hero 768w ได้ median 2800ms (เดิม 2896ms) ยังไม่ผ่านเป้า สาเหตุหลักคือ framework JS ~148KB ใน Lantern LCP graph (วินิจฉัย: ตัด JS แล้วได้ 1580ms) ต้องตัดสินใจเชิงสถาปัตยกรรม/ADR ก่อนทำต่อ
- [x] ลบ starter components ที่ไม่ได้ใช้: src/components/sections/HomeSections.tsx, HeroSection.tsx, src/components/interactive/MobileNav.tsx — ลบแล้วพร้อม CSS ที่ไม่ได้ใช้ใน sections.module.css (REV-002)
- [x] audit media loading ของต้นฉบับ (ปิดข้อค้างใน REV-001B) — REV-004: มือถือ OBSERVED, desktop UNKNOWN (Cloudflare 403)
- [ ] ทดสอบ screen reader ด้วยคน และกำหนดโดเมนจริงก่อนเปิด index

## งานต่อ (SEO-007 — Per-route metadata correctness, 2026-10-30)
สถานะ: **COMPLETED — Kiro (commit c6c84aa)**. งานนี้แก้ความถูกต้องของ SEO metadata ใน static export แต่ไม่เปลี่ยนนโยบาย `noindex`, production domain หรือ copy ของเว็บไซต์

### ข้อบกพร่องที่แก้แล้ว
- [x] `/services/` มี canonical, `og:url`, title, description และ Twitter metadata ของ route ตัวเองแล้ว (ใช้ `pageMetadata()` ใน src/lib/seo/metadata.ts)
- [x] `404.html` ไม่มี canonical และ social preview แล้ว; มี `noindex` รายการเดียว และ title "Page not found"
- [x] Home WebSite JSON-LD URL = `https://example.com/` ตรงกับ canonical
- [x] `verify:html` ตรวจ OG/Twitter, JSON-LD, 404 head, robots และ sitemap แล้ว (ก่อนแก้ FAIL 9 ข้อตรงกับข้อบกพร่อง; หลังแก้ PASS 95 FAIL 0)

### เกณฑ์จบงาน SEO-007
- [x] `typecheck`, `lint`, `build`, `verify:html` ผ่าน (exit 0 ทั้งหมด บน HEAD c6c84aa)
- [x] Browser suite: 45 passed / 6 skipped / 0 failed เท่ากับ baseline
- [x] บันทึกผลจริง, diff review, state และ Kiro log เสร็จ ไม่เปลี่ยน `noindex` หรือ `example.com`

ค้างต่อ (นอกขอบเขต): copy ของ /services/ ขัดกับข้อความ "No reservations or services are offered" และ src/content/home.ts ยังมี starter copy เดิม → BRAND-001 / SEO-008

## งานต่อ (SEO-008 — Release and indexing readiness, 2026-10-30)
สถานะ: **BLOCKED — รอข้อมูลสำหรับเผยแพร่จากเจ้าของเว็บไซต์**. ห้ามถอด `noindex` หรือ publish จนกว่ารายการบังคับด้านล่างจะได้รับการอนุมัติ

### สิ่งที่ตรวจพบ
- [x] ตรวจ source SEO: `src/config/site.ts` ยังมี `https://example.com` และ `hello@example.com`
- [x] ตรวจ metadata/header: `src/app/layout.tsx` ส่ง `noindex, follow`; `public/_headers` ส่ง `X-Robots-Tag: noindex, follow`
- [x] ตรวจเนื้อหา/สื่อ: เว็บไซต์และ footer ระบุชัดว่าเป็น fictional/imaginary design study, ไม่รับจองหรือให้บริการจริง และภาพเป็น illustrative
- [x] ยืนยันว่าการเปิด index ณ สถานะนี้ไม่พร้อมเผยแพร่ และไม่ควรใช้ `example.com` เป็น canonical, Open Graph หรือ sitemap

### ข้อมูลที่ต้องได้รับก่อนเริ่มแก้ source
- [ ] Production origin แบบเต็มรูปแบบ (ตัวอย่าง `https://www.your-domain.tld`) และยืนยันว่า DNS/Cloudflare Pages จะใช้ origin เดียวกัน
- [ ] Email ติดต่อสาธารณะที่อนุมัติแล้ว
- [ ] คำยืนยันว่า brand “Villa Luma”, เนื้อหา, ข้อความไม่มีบริการ/การจอง และภาพ illustrative เป็นสิ่งที่ต้องการเผยแพร่จริง **หรือ** ส่งเนื้อหา/asset/สิทธิ์ใช้งานทดแทนที่อนุมัติแล้ว
- [ ] ยืนยันว่าต้องการอนุญาตให้ search engines index เว็บไซต์นี้

### งานที่จะทำหลังได้รับข้อมูล
- [ ] อัปเดต `siteConfig.url` และ `siteConfig.email`; ตรวจ title/description/OG/Twitter alt ให้ตรงกับเนื้อหาที่อนุมัติ
- [ ] ถอด metadata robots `noindex` และ `X-Robots-Tag` จาก static/Cloudflare headers
- [ ] ตรวจ `robots.txt`, sitemap, canonical, Open Graph และ Twitter URL ว่าชี้ HTTPS production origin เดียวกันทุก route
- [ ] รัน `typecheck`, `lint`, `build`, `verify:html`, browser tests และ Lighthouse production preview (mobile/desktop 3 runs)
- [ ] deploy แล้วตรวจ response headers, robots, sitemap และ canonical บน production origin ก่อนแจ้ง Google Search Console

เกณฑ์ผ่าน: ไม่มี `example.com`, `hello@example.com`, `noindex` หรือ URL ข้าม origin ใน artifacts ที่ build; ทุก canonical/OG/sitemap/robots ใช้ HTTPS production origin ที่อนุมัติ; verification ผ่าน และ Lighthouse SEO 100 โดยไม่มี SEO audit อื่นล้มเหลว

## งานต่อ (DEPLOY-001 — Docker build/preview และ Windows batch deploy, 2026-10-30)

สถานะ: **IMPLEMENTED — Kiro (2026-10-30), ทดสอบในเครื่องผ่านทั้งหมด; deploy ขึ้น Cloudflare จริง NOT RUN (ยังไม่มี credentials/project)**. แผนเดิมบันทึกโดย Codex; ผลจริงอยู่ใน docs/agent-logs/2026-10-30-DEPLOY-001-KIRO.md

### เป้าหมายและขอบเขต

ใช้ Docker สำหรับ build + preview ตามที่ผู้ใช้เลือก และใช้ Windows `.bat` สั่ง build/deploy โดยตั้งค่าผ่าน `.env`. Cloudflare Pages รับ static artifacts จาก `out/` ผ่าน Wrangler Direct Upload; ไม่รัน Docker image บน Pages และคงสถาปัตยกรรม ADR-0001 ไม่มี registry push หรือ CI/CD อัตโนมัติใน Task นี้

### Checklist implementation

- [x] สร้าง multi-stage Dockerfile: `npm ci`, lint/typecheck, static build และ `verify:html`; แยก stage export artifact กับ preview image (Dockerfile: deps/build/artifact/preview/wrangler)
- [x] Preview image ใช้ static server แบบ non-root รองรับ `/services/`, HTTP 404 และ security headers โดยไม่มี Next.js runtime server (uid 1000 node, read-only rootfs, cap-drop ALL; serve-static อ่าน `_headers`)
- [x] ล็อกเวอร์ชัน Node, base images และ Wrangler ที่ตรวจร่วมกับ lockfile แล้ว ไม่ใช้ `latest` (node:24.15.0-bookworm-slim@sha256:4e6b70dd…, wrangler 4.155.0, `npm ci`)
- [x] เพิ่ม `.dockerignore` ตัด `.env`, credentials, `.git`, dependencies และ build outputs ในเครื่องออกจาก build context (context 5.8 MB)
- [x] สร้าง `build.bat` สำหรับ build image และ export artifact ใหม่ทุกครั้ง (`.artifacts/out`)
- [x] สร้าง `preview.bat` เปิด preview image ที่ `http://127.0.0.1:4173` โดยเปลี่ยน port ผ่าน config ได้ (`PREVIEW_PORT`)
- [x] สร้าง `deploy-cloudflare.bat`: ตรวจ config → build → verify → upload artifact รอบเดียวกัน → แสดง deployment URL; หยุดด้วย nonzero exit code เมื่อขั้นตอนใดล้มเหลว
- [x] ใช้ Node helper ร่วมกันอ่าน config/เรียกคำสั่ง รองรับ path ที่มีช่องว่าง ไม่ประมวลผลค่า `.env` เป็น shell code; ระบุ Node และ Docker Desktop Linux containers เป็น prerequisites (scripts/deploy/cli.mjs, DOCKER_AND_BATCH.md)
- [x] Deploy ผ่าน Wrangler ที่ล็อกเวอร์ชันใน container ส่ง token เฉพาะขั้น upload ไม่ส่งเข้า Docker build หรือเก็บใน image (`docker run --env NAME`; image history/env ไม่มี CLOUDFLARE)
- [x] จัดทำคู่มือสร้าง Pages project แบบ Direct Upload และ token สิทธิ์ Pages Edit เฉพาะ account ที่ใช้; script ใช้ project ที่มีอยู่ ไม่สร้างอัตโนมัติ (docs/deployment/DOCKER_AND_BATCH.md)

### Config ผ่าน .env

- [x] เพิ่ม `.env.example` พร้อมคำอธิบาย คง `.env` จริงนอก Git และใช้ค่าดังนี้

| ตัวแปร | การใช้งาน / ค่าเริ่มต้น |
| --- | --- |
| `DOCKER_IMAGE_NAME` | `villa-luma` |
| `DOCKER_IMAGE_TAG` | `local` |
| `PREVIEW_PORT` | `4173` |
| `CLOUDFLARE_ACCOUNT_ID` | ต้องกรอกก่อน deploy |
| `CLOUDFLARE_API_TOKEN` | Secret สำหรับ upload เท่านั้น |
| `CLOUDFLARE_PAGES_PROJECT_NAME` | ชื่อ project ที่มีอยู่ |
| `CLOUDFLARE_PRODUCTION_BRANCH` | ต้องระบุให้ตรงกับ project |
| `CLOUDFLARE_DEPLOY_BRANCH` | `preview` |
| `DEPLOY_TARGET` | `preview`; รองรับ `production` |

- [x] Process environment มีลำดับความสำคัญเหนือ `.env`; อ่านไฟล์ config จาก root โปรเจกต์
- [x] ตรวจค่าตามคำสั่ง: build/preview ไม่ต้องมี Cloudflare credentials
- [x] Preview branch ต้องไม่ตรงกับ production branch; production ต้องใช้ branch ที่ตั้งไว้ตรงกัน (production ต้องมี `--confirm-production` ด้วย)
- [x] ไม่พิมพ์ token ลง log และไม่ใช้ `NEXT_PUBLIC_*` สำหรับ credentials (`check` แสดงเป็น `(set)`, output ของ Wrangler ถูก redact)
- [x] Config deployment มีผลตอนเรียกคำสั่ง; การเปลี่ยนโดเมนใน static HTML ต้อง rebuild และดำเนินการตาม SEO-008

### เกณฑ์ตรวจรับและส่งมอบ

- [x] Build จาก checkout ใหม่ด้วย Docker ได้ พร้อม HTML/สื่อ/`_headers` ครบ (สำเนา HEAD ที่ path มีช่องว่าง ไม่มี node_modules: exit 0, 77 ไฟล์)
- [x] Preview ผ่าน `/`, `/services/`, URL ที่ไม่มีอยู่, menu และ keyboard navigation (HTTP 16/16; Playwright Chromium กับ container 17/17)
- [x] ตรวจ Docker ไม่พร้อม, port ชน, config ขาด, token ผิด, path มีช่องว่าง และ build ล้มเหลว; ห้าม upload artifact เก่าต่อ (ทุกกรณี exit 1; build พังแล้วไม่เหลือ artifact และไม่ถึงขั้น upload)
- [x] ตรวจว่าไม่มี `.env` หรือ token ใน build context, image layers และ artifacts
- [ ] ทดสอบ deployment บน preview ที่ได้รับอนุญาต ตรวจ HTTP status, headers และไฟล์สำคัญจาก URL จริง — **NOT RUN**: ยังไม่มี Account ID, token และ Direct Upload project (ทดสอบด้วย token ปลอมแล้ว Cloudflare ปฏิเสธก่อนส่งไฟล์)
- [x] อัปเดต README, task log และ PROJECT_STATE พร้อมผลจริงและวิธีย้อนกลับ (Pages dashboard: Rollback to this deployment; ไม่ใช้ artifact ซ้ำข้ามรอบ)

Production release ขึ้นกับการตรวจเนื้อหาและโดเมนใน SEO-008; tooling ไม่ถอด `noindex` อัตโนมัติ หน้า 404 ยังคง `noindex` แม้เปิด index หน้าปกติแล้ว การวางแผนนี้ยังไม่ใช่การ publish

อ้างอิง: https://developers.cloudflare.com/pages/get-started/direct-upload/
Log: docs/agent-logs/2026-10-30-DEPLOY-001-Codex.md (แผน), docs/agent-logs/2026-10-30-DEPLOY-001-KIRO.md (implementation และผลทดสอบ)

Log: docs/agent-logs/2026-10-28-REV-001-Codex.md, docs/agent-logs/2026-10-29-REV-001-KIRO.md, docs/agent-logs/2026-10-29-REV-002-KIRO.md
State: docs/PROJECT_STATE.md
