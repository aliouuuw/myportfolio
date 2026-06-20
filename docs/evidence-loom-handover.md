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

### Pivot C — Hardware UI (Current)

| Element | Rule |
|---------|------|
| **Base** | Dotted light-grey background (`#E8E8E8` / `#d1d1d1` grid), solid white surfaces |
| **Typography** | Space Grotesk (headings/mono) + Inter (body) |
| **Shadows** | Hard brutalist shadow blocks (`2px 2px 0px #111`, no blur) |
| **Components** | Flat panels, 2px solid black borders, rounded corners (8-12px) |
| **Accent** | Vivid Hardware Orange (`#FF4A00`) |
| **Signature** | Utilitarian layout, high-contrast states, physical button feel |
| **Motion** | Fast snappy movement, physical scale changes on click |
| **Spacing** | Compact, tabular |

**File:** `mock-site-loom/operator-board.html` + `operator-board.css` + `operator-board.js`

### Key Hardware UI DNA incorporated

1. **Lightweight brutalism** — 2px solid black borders with hard block shadows.
2. **Typography pairing** — Space Grotesk for bold robotic headings, Inter for high legibility body.
3. **Hardware color strategy** — Neutral base `#f2f2f2` with stark orange accent `#FF4A00`.
4. **Physical buttons** — Active states sink components down to match shadow (e.g. `transform: translate(2px, 2px)`).
5. **No thread** — The SVG thread has been removed in favor of direct active states.

**Banned (all pivots):** glassmorphism, gradient text, heavy blur, particle fields, custom cursor, generic Codrops clichés.

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
4. **Hardware focus states:** Active tabs are highlighted with high-contrast borders and colors, no decorative svg thread.
5. **Proof card:** Master-detail panel showing kicker, title, summary, meta, outcome, actions

### Success criteria

- [x] Visitor clicks a claim within 3 seconds (claim board above fold, keyboard hints)
- [x] Hardware theme implemented (Rabbit R1 / TE style)
- [x] Thread animation removed for direct state changes
- [x] Proof card content is scannable (hierarchy, whitespace, typography)
- [x] Mobile fallback: proof index becomes 2-column grid; mobile hint on interaction
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
