# Evidence Loom — Portfolio Handover

**Last updated:** 2026-06-06  
**Status:** Active design exploration in `mock-site-loom/`  
**IA:** Source of Truth / Execution Ledger (claims route to proof)

---

## 1. What this is

A portfolio for **Aliou Wade — Product Systems Engineer** targeting founders, CTOs, and network referrals. The site is a **conversion tool** (30s test: what you do, what shipped, how to contact) wrapped in **Awwwards-level craft** without looking like a template.

**Not a project gallery.** Not a resume scroll. Not a dashboard. It is an **editorial proof machine** where positioning claims connect visibly to evidence.

---

## 2. Visual direction: Two pivots under evaluation

### Pivot A — Soft Structuralism (original)

| Element | Rule |
|---------|------|
| **Base** | Ethereal light (`#fbfaf7`), radial gradients for depth |
| **Typography** | General Sans 400–600, Geist Mono; massive hero |
| **Shadows** | Ultra-soft ambient (0.03–0.08 opacity), inset highlights |
| **Components** | Double-bezel nested cards for premium feel |
| **Accent** | Cool blue (`#496f9f`) for proof/evidence |
| **Signature** | SVG source thread redraws on claim/proof selection |

**File:** `mock-site-loom/index.html` + `loom.css` + `loom.js`

### Pivot B — Gradient Loom (Stripe DNA × Soft Structuralism)

| Element | Rule |
|---------|------|
| **Base** | Navy hero (`#0a2540`) with spectral gradient orbs; light proof stage (`#f6f8fa`) |
| **Typography** | General Sans **300–400** (light weights like Stripe), tight spacing (-0.04em) |
| **Shadows** | Stripe-minimal: 0 2px 5px, 0 3px 8px — no puffy depth |
| **Components** | Low-radius cards (4–8px like Stripe), clean borders |
| **Accent** | Stripe Indigo (`#533afd`) primary; lavender/orange gradient orbs |
| **Signature** | Full-bleed gradient hero with parallax orbs; horizontal claim chips |
| **Motion** | ScrollTrigger orb parallax; staggered load choreography |
| **Spacing** | 8px base grid (Stripe tokens) |

**File:** `mock-site-loom/stripe-pivot.html` + `stripe-pivot.css` + `stripe-pivot.js`

### Pivot C — Operator Board (single-viewport instrument)

| Element | Rule |
|---------|------|
| **Base** | Same light surface as Pivot A, but compressed into a single viewport |
| **Typography** | Manrope 400–700 + JetBrains Mono; utility-focused labels |
| **Layout** | Fixed header → two-column body (proof stage + comms) → footer ledger |
| **Interaction** | Domain tabs → case tabs → anchor card; keyboard arrow nav |
| **Ledger** | Collapsed strip with expand affordance; full expanded grid |

**File:** `mock-site-loom/operator-board.html` + `operator-board.css` + `operator-board.js`

### Key Stripe DNA incorporated into Pivot B

1. **Spectral gradient hero** — indigo → lavender → orange orbs, full-bleed, parallax on scroll
2. **Light-weight typography** — 300–400 weights create editorial elegance unusual in fintech
3. **Low corner radius** — 4–8px (not 26–34px); professional, not chunky
4. **Minimal shadows** — flat-to-minimal; depth is restrained
5. **8px spacing grid** — consistent rhythm from Stripe's token system
6. **Indigo accent** — `#533afd` for primary actions, active states, focus rings
7. **Horizontal claim chips** — pill-shaped, white-on-dark, Stripe's product nav pattern
8. **Intentional motion** — staggered timings, spring curves, purposeful not decorative

**Banned (both pivots):** glassmorphism, gradient text, heavy blur, particle fields, custom cursor, generic Codrops clichés.

---

## 3. IA: Evidence Loom

### Structure

```
┌─────────────────────────────────────────────────────────┐
│ Floating nav (identity, contact)                        │
├─────────────────────────────────────────────────────────┤
│ Hero panel                                              │
│ - Positioning claim (h1)                                │
│ - Claim board (4 clickable pills)                       │
├─────────────────────────────────────────────────────────┤
│ Loom stage (3-column grid)                              │
│ - Left: Proof index (4 tabs)                            │
│ - Center: Proof card (dynamic content)                  │
│ - Right: Context rail (availability, arc, contact)     │
│ - Overlay: Source thread (SVG path, claim → proof)     │
├─────────────────────────────────────────────────────────┤
│ Record strip (4-column ledger)                          │
│ - Compressed execution record (2021–now)               │
├─────────────────────────────────────────────────────────┤
│ Closing panel (call to action)                          │
└─────────────────────────────────────────────────────────┘
```

### Key interaction

1. **Claim pills** (4 options): "Builds operational systems," "Ships fintech workflows," "Hardens ERP behavior," "Stops wrong abstractions"
2. **Proof tabs** (4 options): Everest Finance, Odoo 18 kit, BocalBun retrospective, Shipped record
3. **Claim-to-proof mapping:** Each claim routes to one proof surface
4. **Source thread:** Visible SVG path redraws from selected claim to proof card on interaction
5. **Proof card:** Master-detail panel showing kicker, title, summary, meta, outcome, actions

### Success criteria

- [x] Visitor clicks a claim within 3 seconds (claim board above fold, keyboard hints)
- [x] Thread animation feels premium, not gimmicky (spring ease, endpoint nodes, ResizeObserver)
- [x] Proof card content is scannable (hierarchy, whitespace, typography)
- [x] Mobile fallback: proof index becomes 2-column grid; thread hidden; mobile hint on interaction
- [x] 30s test passes: what Aliou does, what shipped, how to contact
- [ ] Feels Awwwards-level craft (not template-y) — pending visual proof assets (Sprint 4)

---

## 4. Content (locked)

### Anchor cases (3)

| Case | Claim | Summary |
|------|-------|---------|
| **Everest Finance** | fintech | CRM + public site + Sama Naffa foundations consolidated into one spine |
| **Odoo 18 kit** | erp | 39 acceptance tests, 9 suites, Robot + Playwright for ERP localization |
| **BocalBun** | judgment | Frozen framework; retrospective as judgment asset |

### Supporting record

8 entries (2021–2026): Everest, GreenTec, Purolator, BankingBook, Orange, Asaaman, BocalBun, Odoo.

### Profile context

- **Availability:** Selective Q3 (best fit: founders replacing spreadsheet ops)
- **Arc:** Ottawa → Dakar (logistics in Canada, fintech/ops in West Africa)
- **Contact:** `wadealiou00@gmail.com`, WhatsApp `https://wa.me/221777228845`

### Positioning (hero copy)

> I build the operational systems founders eventually wish existed sooner.

> CRMs, ERP modules, acceptance tests, customer workflows — shipped as narrow tools that real teams run every day.

---

## 5. Files and structure

```
mock-site-loom/
  index.html          ← Pivot A: Soft Structuralism (original)
  loom.css            ← Pivot A styles
  loom.js             ← Pivot A interactions
  stripe-pivot.html   ← Pivot B: Gradient Loom (Stripe DNA)
  stripe-pivot.css    ← Pivot B styles
  stripe-pivot.js     ← Pivot B interactions
  operator-board.html  ← Pivot C: single-viewport instrument surface
  operator-board.css   ← Pivot C styles
  operator-board.js    ← Pivot C interactions
  index-finder.html   ← Archived Bottleneck Finder
  styles.css          ← Archived (finder CSS)
  app.js              ← Archived (finder JS)
```

**Preview Pivot A:** `http://localhost:5050`  
**Preview Pivot B:** `http://localhost:5050/stripe-pivot.html`

---

## 6. Polish status (2026-06-06 merge-fix)

### Done (Sprints 1–3 + UX gate)

- [x] Claim/proof sync on load; `#proof-{slug}` deep links
- [x] Em-dash cleanup; section numbers removed; locale moved to context rail
- [x] Single contact CTA label (`Email`); WhatsApp secondary in context rail
- [x] Solid nav (no blur); proof tab accent without side-stripe
- [x] Thread: ResizeObserver redraw, endpoint nodes, mobile hint
- [x] Double-bezel shells on loom panels; ledger rows (not card grid)
- [x] Hero 2-line headline; claim board above fold
- [x] Accent-locked blue on active/hover states
- [x] Button-in-button on nav, closing, and proof CTAs
- [x] Full load choreography + scroll reveal on record/closing
- [x] Spring GSAP ease (`CustomEase`); 250ms micro / 400ms panel timing
- [x] ARIA tab pattern, focus-visible, skip link, 44px targets, 12px label floor
- [x] Ledger disclosure (3 featured + expand); SR summary on record strip
- [x] Mobile loom order: crumb → proof → index → context

### Deferred (Sprint 4 — visual proof)

- [ ] Everest workflow diagram
- [ ] Odoo test architecture visual
- [ ] Record cell tint/image variation (2–3 cells)
- [ ] Font self-hosting (preconnect added; CDN fonts remain for mock iteration)
- [ ] Dark mode (light-only by decision)

### Operator Board polish (2026-06-07)

- [x] Eyebrow labels on both tab rows (`Domain: what kind of problem?` / `Proof: which project shows it?`)
- [x] Domain description text surfaced under active domain tab (was hidden with `display: none`)
- [x] Anchor card label changed to `Selected proof · {label}` to connect case tab → card
- [x] Footer ledger caption (`Full record — everything, not just the proofs above`)
- [x] Expanded ledger subtitle distinguishing curated proofs from full history
- [x] Case row hides entirely when a domain has only one case
- [x] Responsive: eyebrow questions hidden on tablet, both labels stacked on mobile

---

## 7. Technical constraints

| Rule | Reason |
|------|--------|
| Static HTML + GSAP CDN | No build step; fast iteration |
| `prefers-reduced-motion` respected | Accessibility mandate |
| No custom cursor | User explicit |
| No glassmorphism / gradient text | Design ban |
| Responsive to 320px | Mobile-first |
| Lighthouse ≥ 90 (when promoted) | Performance gate |

---

## 8. Success definition (user-approved)

Within 30 seconds on mobile or desktop, a founder/CTO should answer:

1. **What does this person do?** → Operational software for fintechs and ops-heavy businesses
2. **What have they shipped?** → Everest Finance, Odoo 18 kit, BocalBun (judgment)
3. **How do I contact them?** → Email or WhatsApp (visible in nav + closing panel)

**Design feel:** Memorable, crafted, premium. Not gimmicky. Not AI portfolio. Not agency template.

---

## 9. Handoff checklist

- [ ] Read §1–3 and preview `mock-site-loom/` in browser
- [ ] Run `bun run build && bun run lint` (production site, separate concern)
- [ ] Confirm Evidence Loom loads without errors
- [ ] Test claim/proof interaction on desktop and mobile
- [ ] Verify thread animation is smooth (no jank on resize)
- [ ] Apply UX polish from §6
- [ ] Get user sign-off before promoting to production

---

## 10. Related docs (production only)

| Doc | Use for |
|-----|---------|
| `portfolio-plan.md` | Conversion goals, audience, positioning (read once, reference rarely) |
| `strategic-plan.md` | Career direction, network leverage (read once, reference rarely) |
| `ux-ui-handover.md` | Production site bar (Stripe clarity, different from mock) |
| `AGENTS.md` | Next.js 16 rules, foundation-lock files (production only) |

**Deleted:** `creative-dev-handover.md`, `experience-pivot-handover.md`, `mock-redesign-handover.md` (superseded by this doc).

---

*End of handover.*
