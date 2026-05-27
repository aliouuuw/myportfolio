# Portfolio redesign — agent handover

**Last updated:** 2026-05-27 (v4 iteration)  
**Repo:** `myportfolio`  
**Owner intent:** Redesign the portfolio away from “classified dossier / metallic” toward something **modern, elegant, dynamic, tech-forward** — still grounded in **Source of Truth + Execution Ledger** thinking (claims traceable to proof, shipped work as a record). User was **not satisfied** with mock iterations so far; use this doc to continue without re-discovering context.

---

## 1. Read these first

| Doc | Role |
|-----|------|
| [docs/portfolio-plan.md](./portfolio-plan.md) | Product goal: conversion for founders/CTOs/referrals; 3 anchor case studies; bilingual FR/EN |
| [docs/design-shape-v3.md](./design-shape-v3.md) | **Shipped production direction** (classified record, CF-xxx, MetalPanel) — user wants to **move away** from this visually, not necessarily from IA |
| [docs/strategic-plan.md](./strategic-plan.md) | Career positioning, Everest/Odoo/BocalBun anchors |
| [AGENTS.md](../AGENTS.md) | Next.js 16, no `middleware.ts`, foundation-lock files, verification commands |
| [docs/backlog.json](./backlog.json) | Task graph; note **T030 says delete `/mock`** but `/mock` still exists (see §6) |

**Conversation anchor (user):** [Prior redesign thread](9ddc0410-48d8-45ec-9185-6a1ef3d9013c) — critiques of CF-xxx, metallic direction, amateur feel; preference for **minimal + techy + Awwwards-level motion** (not generic grids/particles); hone **Source of Truth + Execution Ledger**; future **media per project**, **social feedback** (likes/comments), **open agency / join + progress tracking**.

---

## 2. Two layers in the repo (do not confuse them)

### A. Production site (`/en`, `/fr`, …)

Implemented per **design-shape-v3** (mostly complete in backlog through T029):

- **Home:** identity block → 3 `CaseFileCard` (metal, CF-001…) → essay teaser → contact line  
- **Work index:** `FileReferenceRow` list  
- **Work slug:** `CaseReportHeader` + MDX body; components `ScrollDiagram`, `RedactedArtifact`, `CaseReportSection` exist but **MDX does not use them** (plain `##` headings)  
- **Nav:** `TopNav` + `BottomMobileNav`, `CommandPalette`, theme via `ThemeProvider` + `ThemeInitScript`  
- **Tokens:** OKLCH in `app/globals.css`, accent chroma `0.10`

**Verify:** `bun run build && bun run lint`

### B. Design preview (`/en/mock`, `/fr/mock`)

**Isolated** under `app/[locale]/mock/`:

- `layout.tsx` — full-viewport shell (`fixed inset-0 z-[200]`) so site chrome is covered but still mounted underneath  
- **Current active UI:** **Neo-Futuristic** client page (`page.tsx` + `neo-futuristic.css`)  
- **Not wired to production** routes, i18n copy, or real MDX

**Preview URL:** `http://localhost:3000/en/mock` (run `bun dev`)

---

## 3. Design direction evolution (what was tried)

| Iteration | Feel | Status |
|-----------|------|--------|
| **design-shape-v3** (production) | Classified dossier, MetalPanel, CF-xxx, stamps | Live on main routes; user finds metaphor confusing / amateur |
| **Living Spine** mock | Organic vertical line, mouse bend | Replaced |
| **5 direction mocks** | Control Room, Source of Truth, Execution Ledger, Systems Console, Field Engineer | Removed |
| **Source + Ledger (warm)** | Amber/cyan proof, dependency graph, ledger rail, agency sidebar | Replaced; CSS still in repo (`source-ledger.css`) |
| **Awwwards mock** | WebGL shader, GSAP, horizontal scroll cards, custom cursor, glass panels | Removed |
| **Neo-Futuristic mock v1** | Work ledger with boxed metadata, grid-heavy detail | Replaced |
| **Neo-Futuristic mock v3** | Sticky scroll layout: text scrolls naturally on left, media stays pinned on right | Replaced |
| **Neo-Futuristic mock v4 (current)** | Accordion ledger: vertical list of expandable entries, details open in place | **Latest**; full reading flow, no empty space |

### User-approved *conceptual* pillars (keep these)

1. **Source of Truth** — every positioning claim links to proof (case study / artifact).  
2. **Execution Ledger** — work shown as a serious record of what shipped (period, status, outcome), not a project grid.  
3. **Software-engineering signal** — fintech ops, ERP, judgment; Dakar, bilingual FR/EN.  
4. **Future product hooks** (not built): attached media, visitor reactions, agency/join + progress.

### User-rejected or tired of

- `CF-001`, `CONFIDENTIAL`, dossier/LARP  
- Heavy **metal / brushed panels** as primary metaphor  
- **Generic** particle fields, dot grids, “creative developer” clichés without craft  
- **Brutalist / patent document** direction (user wanted the *opposite*: dynamic, fresh)  
- Current **Awwwards mock** as-is: reads as template-y, `cursor: none`, gradient/glass tropes, weak tie to operator credibility

### Stated target aesthetic (use as north star)

> Modern, elegant, dynamic, **minimal but techy**, sharp motion, scroll/click-triggered transitions, uncommon flow — **Awwwards-level craft** without looking like every WebGL portfolio clone.

Reference *quality bar*, not *copy*: restrained typography + one strong motion system + proof/ledger IA — **not** maximal effects stack.

---

## 4. Current `/mock` implementation map

### Entry

| File | Purpose |
|------|---------|
| `app/[locale]/mock/page.tsx` | Client page: hero, `WorkLedger`, `JoinBlock`, writing/about/contact |
| `app/[locale]/mock/neo-futuristic.css` | Active styles (OKLCH tokens, work ledger, terminal bar) |
| `app/[locale]/mock/layout.tsx` | Preview shell |
| `app/[locale]/mock/mock-shell.css` | Shell tokens (mostly unused by awwwards page) |

### Active components (`page.tsx` imports)

| Component | Role |
|-----------|------|
| `_components/work-ledger.tsx` | Accordion ledger — expandable rows with smooth height animation |
| `_components/JoinBlock.tsx` | Open agency / seat requests (static) |
| `_components/system-artifact.tsx` | Terminal-style KV panel (optional; not in ledger v1) |
| `_components/mock-chrome.tsx` | Exit link + `ThemeToggle` + section nav |
| `_components/mock-config.ts` | `MOCK_COPY`, `WORK_LEDGER_META` |
| `_components/use-mock-scroller.ts` | GSAP ScrollTrigger scroller = `.mock-shell` |

### Orphaned from earlier iteration (not imported by `page.tsx`)

Do not assume these are active; safe to delete or repurpose:

- `source-ledger.css`
- `background-layer.tsx`, `ledger-entry.tsx`, `social-feedback.tsx`, `agency-rail.tsx`, `use-in-view.ts`

### Dependencies added for mock only

In root `package.json`:

- `gsap`, `@gsap/react`
- `three`, `@react-three/fiber`, `@react-three/drei`

**Implication:** If mock is deleted, consider removing these unless production redesign adopts them. **AGENTS.md** says avoid heavy 3D on production unless explicitly approved.

---

## 5. Known bugs and tech debt

### Mock / UX

| Issue | Detail |
|-------|--------|
| **HorizontalLedger ScrollTrigger** | `containerAnimation: gsap.getById("horizontal")` — ID never assigned on tween; card entrance animations likely broken |
| **Custom cursor** | `cursor: none` on desktop in `awwwards.css`; hurts usability, fights site `ThemeToggle` styling |
| **Theme on mock** | Dark-first mock vs `ThemeToggle` toggles `data-theme` on `<html>` — shader/colors may not fully respect light mode |
| **Violates project design rules** | Glassmorphism, gradient text class in CSS, heavy WebGL — fine for experiment, **not** aligned with `AGENTS.md` / design-shape anti-patterns |
| **Placeholder media** | Uses `/window.svg`; no real case images |
| **Social “likes”** | Client-only toggle; no API |
| **Footer links** | `href="#"` placeholders |

### Production (independent of mock)

| Issue | Detail |
|-------|--------|
| **Missing case study** | UI links to `/work/bocalbun-retrospective` but `content/work/bocalbun-retrospective/` **does not exist** → 404 |
| **Extra content** | `content/work/eduplan/` exists but is **not** on homepage/work index (strategic plan: month 2, not v1 hero) |
| **Case report components unused** | `ScrollDiagram`, `RedactedArtifact`, `CaseReportSection` not in `mdx-components.tsx` / MDX |
| **Prev/next title keys** | `work/[slug]/page.tsx` uses `t(\`caseFiles.${prevSlug.replace(/-/g, "")}Title\`)` — fragile slug→key mapping |
| **Backlog drift** | T030 marked done with “delete mock” but mock was re-added and expanded |

---

## 6. Content and routing truth table

| Slug | In homepage/work UI | `content/work/` exists |
|------|---------------------|-------------------------|
| `everest-finance` | Yes | Yes (`en.mdx`, `fr.mdx`) |
| `odoo-testing-toolkit` | Yes | Yes |
| `bocalbun-retrospective` | Yes | **No** — fix before launch |
| `eduplan` | No | Yes |

Writing: `content/writing/why-systems-over-frameworks/` (check slugs via `getWritingSlugs()`).

---

## 7. Recommended next direction (for the next agent)

Do **not** iterate blindly on the current Awwwards mock. Suggested approach:

### Phase 1 — Decide visual lane (1 mock, not five)

Pick **one** lane and build `/mock` only:

**Option A — “Instrument” (recommended)**  
- Light or dark **paper** base, single accent (cool cyan or copper — one only)  
- **No WebGL** on v1; CSS + GSAP only  
- **Proof graph**: thin SVG lines that **draw on scroll** connecting hero claims → case rows (Source of Truth)  
- **Ledger**: vertical index with scroll-spy + sharp row transitions (Execution Ledger) — not horizontal pin unless perfected  
- Micro: underline draw, row highlight, monospace tick animation — **no** `cursor: none`

**Option B — “Spatial ledger”**  
- Keep horizontal case journey **only if** ScrollTrigger is debugged and performance is good on mobile  
- Reduce: no custom cursor, no shader, max 1 glass panel

**Option C — Promote mock patterns to production**  
- Only after user sign-off; requires backlog task, foundation-lock awareness, Lighthouse ≥ 90 mobile

### Phase 2 — Wire real content

- Add `content/work/bocalbun-retrospective/` or change slugs to match reality  
- Drive case list from `getWorkSlugs()` + frontmatter, not hardcoded `mock-config.ts`  
- Media: `next/image` + `public/images/case-studies/`

### Phase 3 — Future features (explicitly out of scope until design locked)

- Social feedback API + persistence  
- Agency join requests + progress dashboard  
- Do not block redesign on these; use static placeholders as now

---

## 8. How to work in this repo

### Commands

```bash
bun dev
bun run build && bun run lint
```

### Foundation lock (do not edit without task permission)

- `app/layout.tsx`, `next.config.ts`, PostCSS/Tailwind config, `proxy.ts`, `tsconfig.json`, `eslint.config.mjs`

### Mock conventions

- Keep mock under `app/[locale]/mock/` until user approves promotion  
- Prefer **scoped CSS file** per direction (e.g. `instrument.css`) or prefixed classes (`.mock-*`)  
- Reuse `ThemeToggle` + `ThemeInitScript` for theme tests  
- `mock/layout.tsx` overlay z-index: `200`

### If replacing the Awwwards mock

1. Archive or delete unused `_components/*` and `awwwards.css`  
2. Consider removing `gsap` / `three` from `package.json` if unused  
3. Update this handover doc with the new lane name and file list  

### If promoting to production

1. New backlog tasks (orchestrator): replace homepage, work index, case template  
2. Remove CF-xxx / stamps per user direction; migrate copy in `messages/en.json`, `messages/fr.json`  
3. Wire `CaseReportSection` / `ScrollDiagram` in MDX or remove dead components  
4. Run Lighthouse gates from design-shape-v3 §16  
5. Delete `/mock` when done (per original T030 intent)

---

## 9. File quick reference

### Production components (design-shape-v3)

```
components/
  case-file-card.tsx
  case-report-header.tsx
  case-report-section.tsx
  classification-stamp.tsx
  file-reference-row.tsx
  metal-panel.tsx
  scroll-diagram.tsx
  redacted-artifact.tsx
  top-nav.tsx
  bottom-mobile-nav.tsx
  command-palette.tsx
  theme-provider.tsx
  theme-init-script.tsx
```

### Mock (current)

```
app/[locale]/mock/
  page.tsx
  neo-futuristic.css         ← active styles
  layout.tsx
  mock-shell.css
  _components/
    work-ledger.tsx
    join-block.tsx
    mock-chrome.tsx
    mock-config.ts
    system-artifact.tsx
    use-mock-scroller.ts
```

---

## 10. Resolved direction (user decisions, 2026-05-26)

1. **CF-xxx + classification stamps:** **Drop entirely.** Remove from production copy, components, and messages.
2. **Theme default:** **Light default.** Dark mode remains via `ThemeToggle`.
3. **WebGL:** **Acceptable** on final site (keep `three` / R3F), provided performance + Lighthouse gates pass on mobile.
4. **Case study flow:** **Horizontal.** Commit to horizontal pinned scroll — must debug `HorizontalLedger` ScrollTrigger and validate mobile fallback.
5. **BocalBun:** **Write MDX now** (`content/work/bocalbun-retrospective/{en,fr}.mdx`) before launch; do not swap to EduPlan.
6. **Social / agency features:** **Static placeholders for v1.** No backend yet.

### Implications for next agent

- Visual lane: closer to **Option B (Spatial ledger)** with WebGL allowed, light-first.
- Strip CF-xxx / `classification-stamp.tsx` / dossier copy from production migration plan.
- Fix `HorizontalLedger` (`gsap.getById("horizontal")` bug) before promoting.
- `/mock` light theme must be first-class, not an afterthought (current `awwwards.css` is dark-first).
- Add `content/work/bocalbun-retrospective/` to backlog as a blocker for launch.

---

## 11. Success criteria (user-defined, paraphrased)

Within ~30 seconds on mobile (WhatsApp link) or desktop, a founder/CTO should answer:

1. What does this person do?  
2. What have they shipped (credible systems, not tutorials)?  
3. How do I contact them?

Design should feel **memorable and crafted**, not gimmicky, not “AI portfolio,” not agency template. Bilingual FR/EN must feel native when promoted to production.

---

## 12. Handoff checklist for a new agent

- [ ] Read §1–3 and skim production homepage + `/en/mock` in browser  
- [ ] Run `bun run build && bun run lint`  
- [ ] Confirm 404 on `/en/work/bocalbun-retrospective`  
- [ ] List orphan mock files vs active imports (`page.tsx`)  
- [ ] Agree visual lane with user (§7) before large rewrite  
- [ ] Update `docs/mock-redesign-handover.md` when direction changes  
- [ ] Do **not** mark T030 complete again unless `/mock` is actually deleted or intentionally kept with backlog updated  

---

*End of handover.*
