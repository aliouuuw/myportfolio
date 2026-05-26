# Portfolio redesign — agent handover

**Last updated:** 2026-05-26  
**Repo:** `myportfolio`  
**Owner intent:** Redesign the portfolio away from “classified dossier / metallic” toward something **modern, elegant, dynamic, tech-forward** — still grounded in **Source of Truth + Execution Ledger** thinking (claims traceable to proof, shipped work as a record). 

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
- **Current active UI:** Single **Instrument (WebGL-enhanced)** client page (`page.tsx` rendering `MockClient.tsx`)
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
| **Awwwards mock (v1)** | WebGL shader, GSAP, horizontal scroll cards, custom cursor, glass panels | Replaced |
| **Instrument (v4)** | Vanilla WebGL wave shader, light-by-default theme, horizontal execution ledger, clean typography, static trackers | **Latest Locked-in Direction**; user-approved |

### User-approved *conceptual* pillars (keep these)

1. **Source of Truth** — every positioning claim links to proof (case study / artifact).  
2. **Execution Ledger** — work shown as a serious record of what shipped (period, status, outcome), not a project grid.  
3. **Software-engineering signal** — fintech ops, ERP, judgment; Dakar, bilingual FR/EN.  
4. **Future product hooks** (not built): attached media, visitor reactions, agency/join + progress.

### User-rejected or tired of

- `CF-001`, `CONFIDENTIAL`, dossier/LARP (Stamps and stamps-metadata **fully dropped** in v4)
- Heavy **metal / brushed panels** as primary metaphor  
- **Generic** particle fields, dot grids, “creative developer” clichés without craft  
- **Brutalist / patent document** direction  
- **Awwwards mock (v1) elements**: `cursor: none` (cursor hijacking dropped), heavy dark-only gradients, weak tie to operator credibility

### Stated target aesthetic (use as north star)

> Modern, elegant, dynamic, **minimal but techy**, sharp motion, scroll/click-triggered transitions, uncommon flow — **Awwwards-level craft** without looking like every WebGL portfolio clone.

Reference *quality bar*, not *copy*: restrained typography + one strong motion system + proof/ledger IA — **not** maximal effects stack.

---

## 4. Current `/mock` implementation map

### Entry

| File | Purpose |
|------|---------|
| `app/[locale]/mock/page.tsx` | Client page: loads `<MockClient />` |
| `app/[locale]/mock/_components/MockClient.tsx` | Main Client Orchestrator: Hero, `ClaimValidator`, `HorizontalLedger`, Static Agency Trackers, and Footer |
| `app/[locale]/mock/instrument.css` | Active styles (premium minimal styling, light default / dark support, smooth transitions) |
| `app/[locale]/mock/layout.tsx` | Preview shell |
| `app/[locale]/mock/mock-shell.css` | Shell tokens (mostly unused by awwwards page) |

### Active components (`MockClient.tsx` imports)

| Component | Role |
|-----------|------|
| `_components/ShaderBackground.tsx` | Native WebGL custom fragment shader drawing a slow, pearlescent wave in light mode and deep graphite in dark mode |
| `_components/KineticText.tsx` | GSAP ScrollTrigger char/word reveal |
| `_components/MagneticButton.tsx` | GSAP magnetic hover |
| `_components/HorizontalLedger.tsx` | Pinned horizontal scroll section for cases with theme-aware cards and corrected entrance animations |
| `_components/ClaimValidator.tsx` | Hover-to-validate claims with theme-aware typography |
| `_components/mock-chrome.tsx` | Exit link + `ThemeToggle` (DK/LN) |
| `_components/mock-config.ts` | Hardcoded `MOCK_COPY`, cases, media slots, social counts, `AGENCY_TEASER` |

### Orphaned from earlier iteration (not imported by `MockClient.tsx`)

Do not assume these are active; safe to delete or repurpose:

- `source-ledger.css`
- `background-layer.tsx`, `ledger-entry.tsx`, `social-feedback.tsx`, `agency-rail.tsx`, `use-in-view.ts`

### Dependencies added for mock only

In root `package.json`:

- `gsap`, `@gsap/react`
- `three`, `@react-three/fiber`, `@react-three/drei`

**Implication:** If mock is deleted, consider removing these unless production redesign adopts them. **AGENTS.md** says avoid heavy 3D on production unless explicitly approved.

---

## 5. Known bugs and tech debt (Resolved)

### Mock / UX

- **HorizontalLedger ScrollTrigger [RESOLVED]:** Added `id: "horizontal"` to the pinned scroll trigger so card entry animations find container correctly.
- **Custom cursor [RESOLVED]:** Custom cursor dropped entirely. Fits user theme toggle and standard interactions natively.
- **Theme on mock [RESOLVED]:** Refactored components to use theme-aware classes (`text-ink-primary`, `bg-canvas-elevated`, etc.) so they look beautiful in both light-by-default and dark-by-toggle states.
- **Placeholder media:** Uses `/window.svg`; no real case images.
- **Social “likes” / trackers:** Clean static presentation as requested.
- **Footer links:** `href="#"` placeholders.

### Production (independent of mock)

- **Missing case study [RESOLVED]:** Wrote full English and French MDX retrospect files for BocalBun at `content/work/bocalbun-retrospective/en.mdx` and `fr.mdx` detailing the framework halt and technical judgment.
- **Extra content:** `content/work/eduplan/` exists but is **not** on homepage/work index (strategic plan: month 2, not v1 hero).
- **Case report components unused:** `ScrollDiagram`, `RedactedArtifact`, `CaseReportSection` not in `mdx-components.tsx` / MDX.
- **Prev/next title keys:** `work/[slug]/page.tsx` uses `t(\`caseFiles.${prevSlug.replace(/-/g, "")}Title\`)` — fragile slug→key mapping.
- **Backlog drift:** T030 marked done with “delete mock” but mock was re-added and expanded.

---

## 6. Content and routing truth table

| Slug | In homepage/work UI | `content/work/` exists |
|------|---------------------|-------------------------|
| `everest-finance` | Yes | Yes (`en.mdx`, `fr.mdx`) |
| `odoo-testing-toolkit` | Yes | Yes (`en.mdx`, `fr.mdx`) |
| `bocalbun-retrospective` | Yes | **Yes** (`en.mdx`, `fr.mdx`) |
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
  page.tsx                 ← active: Awwwards
  awwwards.css               ← active styles
  source-ledger.css          ← orphaned
  layout.tsx
  mock-shell.css
  _components/
    ShaderBackground.tsx
    KineticText.tsx
    MagneticButton.tsx
    HorizontalLedger.tsx
    ClaimValidator.tsx
    mock-chrome.tsx
    mock-config.ts
    … (orphaned: background-layer, ledger-entry, social-feedback, agency-rail)
```

---

## 10. Open questions for the user (resolve before production merge)

1. **Drop CF-xxx and classification stamps** entirely, or keep subtly?  
2. **Light default vs dark default** for the new direction?  
3. **Is WebGL acceptable** on the final site, or CSS/SVG only?  
4. **Horizontal vs vertical** case study flow?  
5. **BocalBun** — write MDX now or swap third card to EduPlan temporarily?  
6. **Social/agency features** — v1 static placeholders vs real backend (Convex/Supabase/etc.)?

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
