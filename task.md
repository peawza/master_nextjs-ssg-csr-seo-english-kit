# task.md — แผนทดลองสร้างหน้าแรกแนว Passalacqua ด้วย Next.js

Task ID: REV-001 | Agent: Codex | วันที่: 2026-10-28 (Asia/Bangkok)
สถานะ: กำลังดำเนินงานตามแผนที่อนุมัติ; ดูผลจริงใน VERIFICATION_REPORT.md
Reference: https://www.passalacqua.it/en/

## เป้าหมายและขอบเขต
หน้าแรก Villa Luma — Design Study พร้อมเมนู ใช้ชื่อ ข้อความ และภาพใหม่ที่มีสิทธิ์ ไม่ใช่โรงแรมจริง ไม่รับจอง ไม่มี backend, CMS, analytics, หลายภาษา หรือ production deployment รักษา /services/ เดิม
Next.js App Router + TypeScript strict + CSS Modules/tokens + static export out/ สำหรับ Cloudflare Pages เนื้อหา SEO อยู่ใน HTML; CSR เฉพาะ interactive leaves

## ลำดับงานและเกณฑ์ผ่าน
### REV-001A — Baseline
- [x] อ่าน AGENTS.md, REVERSE_ENGINEERING.md, state, architecture, ADR และ design docs
- [x] ตรวจ git status; รักษา REVERSE_ENGINEERING.md และ .playwright-mcp/ ที่มีอยู่
- [x] บันทึก Node/npm และเปิด task log
- [ ] ติดตั้ง dependency/lockfile และตรวจ baseline; แยกผลเดิมจากผลหลังแก้
เกณฑ์: ไม่เขียนทับงานผู้ใช้ รู้ข้อจำกัด tooling

### REV-001B — Reference evidence
- [x] เปิด browser ตรวจ DOM/computed styles
- [x] ภาพ full-page 1440x900, 390x844, 768x1024 และ menu desktop/mobile
- [x] สำรวจ width 320,375,1024,1280,1920 และ Escape
- [ ] ตรวจ section closeups, hover/focus, scroll และ media loading เพิ่ม
หลักฐานต้องมี URL เวลา viewport state OBSERVED/INFERRED/UNKNOWN และ confidence ห้ามอ้าง library/timing ที่ไม่ทราบ ห้ามส่งแบบฟอร์มหรือทำธุรกรรม

### REV-001C — Specifications before code
- [x] สร้าง REFERENCE_AUDIT, DESIGN_BREAKDOWN, ANIMATION_SPEC, HTML_TREE_AND_SEO, IMPLEMENTATION_PLAN, VERIFICATION_REPORT ภายใต้ docs/reverse-engineering/passalacqua/
- [ ] ปรับเอกสาร design และ tokens ให้ตรงกัน
เกณฑ์: แยกค่าที่วัดจากค่าที่เลือก; ไม่มีการคัดลอก source/brand assets

### REV-001D — Content/media
- [ ] เตรียม hero, introduction, seasons, seasonal features 2 เรื่อง, suites 3 แบบ, stories, journal, related places 2 ส่วน และ footer
- [ ] บันทึก provenance/license, dimensions, alt, focal point และ responsive variants
- [ ] โหลด hero ก่อนและ lazy-load ส่วนล่าง ไม่มี hotlink
เกณฑ์: เนื้อหาใหม่ ไม่มี fake testimonials/รางวัล/ราคาหรือคำกล่าวอ้างโรงแรมจริง

### REV-001E — Semantic architecture
- [ ] Static page/sections/header/footer และ typed content; interactive menu/motion leaves
- [ ] H1 เดียว, heading hierarchy, skip link, anchors จริง
- [ ] เก็บ /services/, ไม่มี API/SSR/ISR/Server Actions
- [ ] Metadata/OG/canonical ของ design study และ noindex
เกณฑ์: ไม่มี JS ก็อ่านเนื้อหาและใช้ navigation ได้; out/index.html มีเนื้อหาครบ

### REV-001F — Responsive layout
- [ ] Hero/editorial/cards/footer ด้วย CSS Modules; fluid type และ image crop
- [ ] ตรวจ 320/375/390/768/1024/1280/1440/1920
เกณฑ์: ไม่ล้นแนวนอน ไม่ตัดข้อความ ไม่มีภาพบิดหรือ CTA ทับเนื้อหา

### REV-001G — Interaction/motion
- [ ] Menu button aria-expanded/controls, modal focus, Escape, restore focus, anchor close, scroll unlock
- [ ] No-JS navigation fallback
- [ ] CSS 180ms hover, 250ms menu, 400ms reveal <=16px ครั้งเดียว
- [ ] IntersectionObserver cleanup; reduced motion ไม่มี reveal/translation/smooth scroll
เกณฑ์: H1/CTA ไม่รอ JS; ไม่มี keyboard trap/scroll lock ค้าง; ไม่เพิ่ม GSAP

### REV-001H — Build/static verification
- [ ] npm.cmd run typecheck
- [ ] npm.cmd run lint
- [ ] npm.cmd run build
- [ ] npm.cmd run verify:html
ตรวจ H1, ทุก section, anchor IDs ไม่ซ้ำ, metadata/canonical/OG, /services/, sitemap/robots ไม่มี canonical ของต้นฉบับ

### REV-001I — Browser/visual
- [ ] Tab/Shift+Tab/Enter/Space/Escape, focus และ anchor
- [ ] JavaScript disabled, reduced motion, slow network, image/font failure
- [ ] Chromium/Firefox/WebKit เมื่อพร้อม; ภาพ local ตรง viewport reference
- [ ] Local screenshot regression baseline
เกณฑ์: ไม่มี P0 (ใช้งาน/build ไม่ได้) หรือ P1 (layout/accessibility หลักเสีย); P2 บันทึกติดตาม ไม่ใช้ pixel-perfect กับภาพคนละชุด

### REV-001J — Lighthouse/SEO
- [ ] Production static server; mobile/desktop อย่างละ 3 รอบ รายงาน median
เป้าหมาย P>=90, A/BP/SEO>=95, LCP<=2.5s, CLS<=0.1; noindex ของ design study ต้องคงไว้แม้ลด SEO score ไม่อ้าง field INP หากไม่มีข้อมูลจริง; NOT RUN พร้อมเหตุผลหากเครื่องมือไม่พร้อม

## Interfaces และ defaults
English UI; Thai task plan. Internal typed navigation/media/editorial content only ไม่มี public API. Brand Villa Luma; self-hosted OFL font และภาพ Unsplash พร้อม provenance. ไม่มี audio/intro blocker, autoplay slider, scroll hijacking หรือ custom cursor. Hero static และ visible; responsive CSS ไม่ใช้ viewport JS.

## Dependency และส่งมอบ
A → B → C → D → E → F → G → H/I/J → handoff
ส่งมอบ task.md, สเปก 6 ไฟล์, asset registry, source, lockfile, static out/, ภาพหลักฐานและรายงานผลจริง ไม่ deploy
จบงานเมื่อทุก section ใช้ได้ ไม่มี P0/P1, review diff แล้ว และอัปเดต log/state พร้อม next action; สิ่งที่ยังตรวจไม่ได้ห้ามทำเครื่องหมายผ่าน

Log: docs/agent-logs/2026-10-28-REV-001-Codex.md
State: docs/PROJECT_STATE.md
