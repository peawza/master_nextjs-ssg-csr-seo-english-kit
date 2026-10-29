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

Log: docs/agent-logs/2026-10-28-REV-001-Codex.md, docs/agent-logs/2026-10-29-REV-001-KIRO.md, docs/agent-logs/2026-10-29-REV-002-KIRO.md
State: docs/PROJECT_STATE.md
