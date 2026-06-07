# Operator Board — Design Handover

**Last updated:** 2026-06-06  
**Status:** Active mock in `mock-site-loom/` — **recommended direction** for production IA  
**Audience:** Design / UX / frontend agent tasked with polish, motion refinement, and eventual Next.js port

---

## 1. Executive summary

Portfolio design exploration for **Aliou Wade — Product Systems Engineer** lives in `mock-site-loom/`. The goal is a **conversion tool** (30-second trust test: who you are, what shipped, how to contact), not a project gallery.

After several IA pivots, the team converged on **Operator Board**: a **single-viewport instrument surface** — not a dashboard with sidebar + main, not a horizontal scroll journey, not a long resume scroll.

**Your job:** Polish visual hierarchy, motion, responsive behavior, and accessibility on `operator-board.*` while preserving Soft Structuralism aesthetics and strategic content. Flow Soft / Flow Pivot remain for comparison; do not delete without explicit ask.

---

## 2. Strategic constraints (read first)

| Doc | Use for |
|-----|---------|
| `docs/strategic-plan.md` | Positioning, anchor cases (Everest, Odoo, BocalBun) |
| `docs/portfolio-plan.md` | IA rules, 30s test, what NOT to build |
| `docs/ux-ui-handover.md` | Production site gaps, token unification |
| `docs/evidence-loom-handover.md` | Earlier Evidence Loom pivot (vertical claim→proof) |
| `AGENTS.md` | Tech stack, design bans for production |

**Banned everywhere:** glassmorphism, gradient text, skills grid, `/services`, fake metrics, generic SaaS dashboard chrome, heavy particle fields.

**Preserve:** Premium fintech calm, hairline borders, General Sans + Geist Mono, indigo CTAs, double-bezel cards (soft theme), first-person copy.

---

## 3. Mock lineup in `mock-site-loom/`

| Files | Name | IA model | Status |
|-------|------|----------|--------|
| `index.html` + `loom.*` | Evidence Loom | Vertical claim → proof thread, SVG source line | Reference / alternate |
| `stripe-pivot.html` + `stripe-pivot.*` | Gradient Loom | Navy hero + Stripe tokens | Reference / alternate |
| `flow-pivot.html` + `flow-pivot.*` | Flow Pivot (dark) | Hero + pinned horizontal scroll, 6 panels | Superseded IA |
| `flow-soft.html` + `flow-soft.*` + shared `flow-pivot.js` | Flow Soft (light) | Same horizontal IA, Soft Structuralism | Superseded IA; aesthetics liked |
| **`operator-board.html` + `operator-board.*`** | **Operator Board** | **Single viewport board** | **Active — polish here** |
| `flow-data.js` | Shared content | MDX / plan-derived copy | Extend, don't fork |
| `index-finder.html` | Diagnostic bento | Bottleneck picker | Separate experiment |

**Preview:** Serve `mock-site-loom/` statically (e.g. `npx serve mock-site-loom`) → open `operator-board.html`.

---

## 4. Evolution arc (why Operator Board exists)

1. **Evidence Loom** — Strong editorial claim→proof, but still vertical scroll literacy.
2. **Flow Pivot / Flow Soft** — Horizontal pinned journey; user liked Flow Soft **aesthetics** but found **navigation complex** (hero act + hidden panels + progress chrome).
3. **Impeccable critique** (`.impeccable/critique/2026-06-06T15-04-04Z__mock-site-loom-flow-soft-html.md`) — IA score ~26/40; recommended proof-first order, hero CTAs, real links, trim Record panel, deep links. Many fixes landed in Flow Soft.
4. **Operator Board proposal** — Replace journey with one asymmetric board: live proof center, comms always armed, ledger compressed.
5. **Operator Board built** — Functional MVP; needs design polish.

---

## 5. Operator Board — intended mental model

> “This is Aliou’s **current console**. The big center card is what he’s running now. Tabs change proof. Email is always on the right. The bottom strip is the ledger.”

**No tutorial. No sideways scroll. No separate hero page.**

### Layout (desktop, `100dvh`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ STATUS RAIL — name · role · LIVE·Everest chip · location · availability │
├────────────────────────────────────────────┬─────────────────────────────┤
│ DOMAIN TABS — Fintech | ERP | Systems      │ COMMS STRIP (navy inset)    │
│ PROOF STAGE — anchor case (double bezel)   │ Email · WhatsApp            │
│ PROOF PEEKS — 2 compact secondary cases    │ Principles (3 lines)        │
│                                            │ Availability note           │
├────────────────────────────────────────────┴─────────────────────────────┤
│ LEDGER BAR — collapsed employers + clients preview · Expand record        │
└──────────────────────────────────────────────────────────────────────────┘
```

### Interaction types (only three)

| Action | Result |
|--------|--------|
| Domain tab (or ←/→, keys 1–3) | Swap proof stage in place; URL hash updates (`#fintech`, `#erp`, `#systems`) |
| Peek card click | Promote secondary case to anchor (swap within domain) |
| Ledger expand | Board grid grows; full employers, clients, essay, GitHub, chess; Esc closes |

**LIVE · Everest** chip → jumps to Fintech tab.

---

## 6. What's implemented (files)

### `operator-board.html`

- Skip link to `#board`
- SVG grid lines (boot draw animation)
- Static shell: status rail, proof zone, comms aside, ledger footer
- Loads `flow-data.js`, GSAP, `operator-board.js`

### `operator-board.css`

- Soft Structuralism tokens (shared with Flow Soft): `--paper`, `--indigo`, `--navy`, 8px grid, double-bezel trays
- CSS grid: `rail | body | ledger` rows; body = `proof-zone | comms-zone` columns
- `.board--ledger-open` — grid row grows, body scales to 0.985 + dims
- Boot animations: grid line stroke, fade-up zones, live-dot pulse
- Domain tab sliding pill indicator (positioned via JS/GSAP)
- Responsive `@860px`: stack comms below proof; allow page scroll on small screens

### `operator-board.js`

- State: `{ domain, anchorIndex, ledgerOpen }`
- Data: `sectionsSoft` filtered to `fintech | erp | systems`
- Renders: tabs, anchor case, peeks, comms, principles, ledger preview + expanded
- Links: `/en/work/{slug}`, `/en/writing/{slug}` (404 on static-only server unless Next dev runs)
- Motion: GSAP crossfade on domain switch; boot scale on proof tray
- A11y: `role="tablist"`, `aria-selected`, `aria-live` on proof stage, Esc closes ledger

### `flow-data.js` (shared)

Rich content from MDX / `messages/en.json` / strategic docs:

- `profile` — identity, contact, availability, hero copy, `domains[]` with `sectionId`
- `principles`, `credentials`, `stack`, `employers`, `clients` (8)
- `writing`, `githubRepos`, `chess`
- `sections` — 6-panel order for dark Flow Pivot
- `sectionsSoft` — proof-first order for Flow Soft / Operator Board
- `paths.work`, `paths.writing`, `recordFeaturedClients: 4`

Anchor cases include `caseStudySlug`; BocalBun has `essaySlug`.

---

## 7. Flow Soft (context — superseded IA, kept for aesthetics reference)

`flow-soft.html` sets `window.FLOW_THEME = 'soft'` and reuses `flow-pivot.js`.

Implemented fixes from IA critique:

- `sectionsSoft` proof-first panel order
- Hero CTAs, clickable domain chips, progress label, mobile swipe hint
- Case study + essay links, Record expand for clients
- Deep links `#panel` / `#fintech`

**User feedback:** Still too complex (two-act hero + horizontal pin). Aesthetics approved; IA abandoned in favor of Operator Board.

---

## 8. Design direction to preserve

| Element | Rule |
|---------|------|
| Base | Light paper `#f4f5f8`, subtle radial gradients, grain overlay |
| Typography | General Sans 300–500, Geist Mono for labels/meta |
| Accent | Indigo `#533afd` CTAs; blue `#496f9f` for proof labels |
| Comms | Navy `#0a2540` inset bezel (Stripe-informed) |
| Cards | Outer tray + inner core (double bezel) on proof anchor |
| Shadows | Minimal: `0 2px 5px`, `0 12px 40px` at low opacity |
| Radius | Outer ~24–28px, inner ~18–20px, pills 999px |
| Motion | Purposeful only; respect `prefers-reduced-motion` |

---

## 9. Known gaps — polish opportunities for next agent

### Polish completed recently

- [x] **Two-level navigation hierarchy** — Structured `.domain-tabs` and `.case-tabs` inside `.proof-nav`. Added elegant, fixed-width `.nav-label` labels (`Domain` and `↳ Proof`) with hairline "circuit path" connector lines for a premium, aligned, Soft Structuralism feel.
- [x] **Editorial Domain Context** — Enabled and custom-styled the `.proof-domain-desc` block. When a domain is selected, it presents the core operational problem (e.g. Fintech surfaces, ERP acceptance, systems velocity judgment) in a beautifully subtle console-styled readout with a vertical accent left border and theme tint.
- [x] **Mobile Responsiveness** — Added stacking and fluid vertical layout for `.nav-row` and `.nav-label` on screens below 600px width to prevent overflow and maintain perfect legibility on mobile.

### Visual / layout

- [ ] **Status rail** feels utilitarian — consider stronger typographic hierarchy or wordmark treatment
- [ ] **Grid lines** are decorative but don't align to actual column grid (33/66% vs 8/4 body split) — align or remove
- [ ] **Proof stage** may overflow on short laptops — tune `max-height`, type scale, peek row density
- [ ] **Peek cards** are dashed-border placeholders — could feel more integrated with anchor tray
- [ ] **Comms zone** competes with proof for weight — tune proportions (`--comms-w`, headline size)
- [ ] **Principles block** is dense three paragraphs — could be single-line chips or collapsible
- [ ] **Ledger collapsed** ellipsis chips are hard to scan — consider micro-timeline visual
- [ ] **Ledger expanded** 3-column grid may feel cramped — typography and spacing pass needed
- [ ] **No FR locale** — production needs `next-intl`; mock is EN-only
- [ ] **No photography / case imagery** — crosshatch or abstract system diagrams would raise polish (see `ux-ui-handover.md`)

### Motion

- [ ] Boot sequence is basic — consider orchestrated stagger (rail → tabs → anchor → comms → ledger)
- [ ] Domain switch uses opacity+y — peek **promote** has no FLIP (attempted, removed due to DOM replace) — worth redoing with stable nodes or View Transitions API
- [ ] Ledger expand/collapse could use height animation + focus trap
- [ ] Live chip pulse runs once — could be subtler or removed if distracting
- [ ] Tab indicator jank on first paint before `positionTabIndicator` runs — ensure sync on load

### UX / IA

- [ ] **Operate** content (credentials, stack) not on board — intentional compression; decide if stack strip belongs in ledger expanded
- [ ] **Connect** is comms strip only — no contact form (production `/contact` has form)
- [ ] **Domain highlight** on ledger clients (`highlightLedgerForDomain`) uses keyword heuristics — fragile, low visual impact
- [ ] Mobile stacks to scrollable page — verify 30s test still passes (Everest + Email above fold)
- [ ] Case study links 404 on static server — add mock disclaimer or relative fallback

### Accessibility

- [ ] Tab panel `aria-labelledby` points to tablist id, not active tab — fix association
- [ ] Ledger expand should trap focus when open
- [ ] Contrast pass on `--ink-faint` (#6e727b) on paper
- [ ] Keyboard: peek cards need visible focus states beyond box-shadow

### Engineering / port path

- [ ] Extract tokens to shared CSS or Tailwind theme for Next port
- [ ] Componentize: `StatusRail`, `ProofStage`, `CommsStrip`, `LedgerBar`
- [ ] Replace imperative DOM render with React state (or keep vanilla for mock iteration)
- [ ] Wire to real `/en/work/[slug]` routes in App Router
- [ ] Do not edit foundation-lock files without backlog task (`app/layout.tsx`, `next.config.ts`, etc.)

---

## 10. Verification checklist

```bash
# Static preview
npx serve mock-site-loom
# Open http://localhost:3000/operator-board.html
```

Manual tests:

- [ ] Land → Everest anchor visible, Email in comms strip, no horizontal scroll
- [ ] Tab ERP → Odoo kit; Tab Systems → BocalBun
- [ ] Click BankingBook peek → promotes to anchor on Fintech
- [ ] `#erp` in URL → loads ERP tab on refresh
- [ ] Expand ledger → employers + 8 clients + essay; Esc closes
- [ ] Keys 1–3 switch tabs; ←/→ switch tabs
- [ ] `prefers-reduced-motion` → no animations, all content visible
- [ ] 375px width → stacked layout, comms reachable

---

## 11. What NOT to do

- Do not reintroduce horizontal pinned scroll as primary IA
- Do not add sidebar + main dashboard layout
- Do not add skills grid, services page, or project card gallery
- Do not redesign with glassmorphism, gradient text, or neon SaaS tropes
- Do not add a fourth anchor case study before three are production-live (strategic plan)
- Do not commit unless user asks

---

## 12. Suggested polish sequence

1. **Layout pass** — align grid, fix overflow, tighten type scale on proof anchor
2. **Comms + hierarchy** — ensure Email is the obvious primary CTA within 2 seconds
3. **Motion pass** — boot choreography, promote FLIP or View Transition, ledger height tween
4. **Mobile pass** — one-screen trust test on iPhone SE / 13
5. **A11y pass** — tabs, focus trap, contrast
6. **Content** — add stack/credentials to ledger if missing for CTO audience
7. **Port spike** — single Next.js page under `app/[locale]/` or homepage replacement proposal

---

## 13. Related conversation

Full build context in agent transcript: search for `operator-board`, `flow-soft`, `sectionsSoft` in session `1f4c4cb5-6879-40a5-b9ac-0a9646a2de79`.
