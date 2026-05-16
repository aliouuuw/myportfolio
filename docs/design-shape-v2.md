# Design Shape — Portfolio v2 "Metal Dossier"

Companion to [`portfolio-plan.md`](./portfolio-plan.md) and [`strategic-plan.md`](./strategic-plan.md). This document is the locked design spec for the v2 modernization pass. Every backlog task in phase P4+ is downstream of decisions made here.

Produced via the `impeccable shape` flow on 2026-05-16. Register: **brand** (the portfolio IS the product).

---

## 1. Brief in one paragraph

Modernize the portfolio without abandoning the "premium fintech calm" mandate. Commit to a defended signature: a Swiss-dossier information structure dressed in a metallic banking-card surface treatment, cool-steel palette, restrained but expensive-feeling motion, and bilingual FR/EN treated as a design primitive rather than a toggle. Ship light and dark surfaces from day one. Avoid every 2026 reflex (bento as homepage default, cream-serif SaaS, navy-and-gold fintech, glassmorphism, gradient text, identical card grids).

---

## 2. Anti-references

- SaaS cream + Inter landing pages
- Navy-and-gold "fintech" reflex
- Glassmorphism dashboards
- Generic developer portfolio with project grid
- Vercel/Linear marketing clone
- Awwwards scroll-jacked cinema hero
- Bento grid used as the homepage structural device
- Stripe surface-copying without Stripe discipline

## 3. Reference feel

- AmEx Centurion / Apple Card surface under cold daylight
- A Patek Philippe owner's manual
- A bound Bloomberg Terminal printout
- Geoffrey Litt's writing rigor
- Codrops "Joffrey Spitzer" portfolio motion discipline (Feb 2026)
- Terminal-native operator portfolios trending on X in Q2 2026

---

## 4. Scene sentence (forces theme decisions)

> A founder at a Dakar co-working café in mid-morning daylight opens a WhatsApp referral link on their phone, then later reopens the site on a 14-inch laptop at home that evening.

Implication: cool-light theme by default, optional deep-graphite night surface, both shipped from day one. The site must feel substantial in both contexts.

---

## 5. Lane

**Swiss-dossier structure + metallic-object surface treatment.**

Strict 12-column grid, numbered sections, hairlines, parallel FR/EN where it matters — that is the IA spine. On top of it, the *surface* gets the metal-card treatment: brushed micro-texture on key panels, cool specular highlights that respond to cursor/scroll, embossed-looking display type. The structure stays disciplined; the materiality does the "popping".

This combination is uncommon and defensible. Most dev portfolios pick either rigor (Swiss) or surface flash (Awwwards motion). Combining them with a banking-card reference is the signature.

---

## 6. Color strategy — Committed, cool metallic

OKLCH tokens. Never `#000` or `#fff`. All neutrals tinted toward a cool steel hue with chroma 0.006–0.012.

### Light surface (default)

```
--canvas         oklch(0.96 0.005 240)
--canvas-elev    oklch(0.93 0.006 240)
--canvas-metal   oklch(0.88 0.008 235)
--ink-primary    oklch(0.18 0.012 250)
--ink-secondary  oklch(0.42 0.010 248)
--ink-tertiary   oklch(0.62 0.008 246)
--hairline       oklch(0.78 0.006 244)
--accent         oklch(0.62 0.045 235)
--accent-bright  oklch(0.82 0.060 230)
--emboss-light   oklch(1.00 0 0 / 0.55)
--emboss-dark    oklch(0.20 0.010 250 / 0.35)
```

### Night surface (toggle in left rail)

```
--canvas         oklch(0.16 0.010 248)
--canvas-elev    oklch(0.20 0.012 246)
--canvas-metal   oklch(0.24 0.014 244)
--ink-primary    oklch(0.94 0.006 240)
--ink-secondary  oklch(0.74 0.008 246)
--ink-tertiary   oklch(0.56 0.008 248)
--hairline       oklch(0.34 0.010 246)
--accent         oklch(0.74 0.055 230)
--accent-bright  oklch(0.88 0.070 228)
--emboss-light   oklch(0.55 0.020 246 / 0.45)
--emboss-dark    oklch(0.06 0.008 250 / 0.55)
```

### Accent usage rules
- Surface coverage under 6%.
- Allowed on: section numeric prefixes, the "Currently —" pulse dot, hover underlines, focus rings, the ⌘K keyboard hint.
- Never as gradient text, never as a button fill wider than 40px, never on body text.

---

## 7. Typography

Two families. Both variable. Both should hold character at very large sizes.

- **Display / serif:** Fraunces (free, variable, opsz axis) or GT Sectra Fine / Tiempos Headline if licensed. Hero sentence and case-study titles use `clamp(56px, 8vw, 112px)`, weight 380, tracking -0.02em. Engraved feel at scale.
- **Sans / body / labels:** Geist or Inter Tight (free). Söhne if licensed. Weights 400 / 500 / 600.
- **Mono:** Geist Mono or JetBrains Mono. Numerical labels, "Currently —" line, colophon, ⌘K hints, code blocks, margin notes. Tracking +0.01em at small sizes.

### Scale
- Ratio 1.333 between steps.
- Body 16px / line-height 1.65 / max width 68ch.
- Micro-labels 11px ALL CAPS tracking 0.12em, always preceded by a numeric prefix and a hairline.

---

## 8. Layout system

- 12-column grid. Faint vertical hairlines visible at viewport edges on lg+ — the dossier signal.
- Gutters 80px at xl, 24px at sm.
- **Persistent left rail on lg+:** numbered index (01–05), vertical FR/EN toggle, light/dark toggle, current section highlighted with accent hairline.
- No top nav on desktop. Mobile collapses to a top bar with the numeric index inline.
- 8px spacing base, deliberate variation: 160px between sections, 64px between sub-blocks, 24px between related items. Never uniform `py-24` everywhere.

---

## 9. The metallic-card treatment (signature)

Applied selectively to: hero name plate, case-study cards on `/work`, the "Currently —" badge, the contact CTA, the colophon footer.

Pure CSS, no image assets. Each metal panel layers:

1. **Base.** `--canvas-metal` solid fill.
2. **Brushed micro-texture.** A 0.5px repeating linear-gradient at 90deg, alternating lightness ±0.5%, applied at 8% opacity.
3. **Edge emboss.** 1px top border in `--emboss-light`, 1px bottom border in `--emboss-dark`. The card looks die-cut from sheet metal.
4. **Specular highlight.** Single radial-gradient centered at CSS custom properties `--mx` / `--my`, low alpha, 220px radius. Cursor-tracked via rAF-throttled mouse-move handler. On scroll-only contexts, position eases toward scroll progress instead.
5. **Hairline interior rules** for dividers. Never side-stripe borders.

Corner radius **6px**. Metal cards have a tight chamfer, not a soft pillow shape.

---

## 10. Motion — restrained, expensive-feeling

Three primitives only.

1. **Specular drift.** Cursor-following highlight (above). 600ms ease-out-expo on transform. Disabled under `prefers-reduced-motion`.
2. **Word-by-word reveal on H1/H2** entering viewport. 40ms stagger, 600ms ease-out-quart, translate-Y 8px + opacity. One per page. Do not stagger every paragraph.
3. **Shared-element transition** between `/work` row title and `/work/[slug]` header using the View Transitions API (Next.js 16 native). ~480ms ease-out-expo. One transition, used everywhere.

### Rules
- Only `transform` and `opacity`. Never width / height / top / left.
- No bounce, no elastic, no spring overshoot. Banking metal does not bounce.
- Respect `prefers-reduced-motion` everywhere.

### Allowed micro-decorations
- 6px filled circle in `--accent` next to "Currently —", 2-second ease-in-out opacity pulse between 0.55 and 1.0. Pauses on hover.
- Locale toggle: inactive language renders in `--ink-tertiary` at 70% opacity, snaps to full ink on switch with no slide.
- ⌘K palette: input hairline gains accent color on focus. No glow, no shadow.

---

## 11. Information architecture

Routes unchanged. Hierarchy changes.

### Homepage
1. Name plate (metal panel, serif display, mono role line, "Currently —" line with pulse dot)
2. Three case-study metal cards in an asymmetric 60/40 split, not equal thirds
3. Systems map (real diagram, one viewport tall)
4. Writing teaser (single essay block, no card chrome)
5. Contact line (one sentence, one link, no CTA button)

### `/work` index
Numbered list view, not grid. Each row: number, title in serif, domain in mono, year right-aligned, hairline. Hover reveals a thumbnail in the right margin (shared-element prep).

### `/work/[slug]`
Full-bleed redacted screenshot with hairline annotations → parallel FR/EN summary columns at lg+ → prose body in 68ch column with mono margin notes for stack, role, constraints → next/prev as two metal panels at the bottom.

### `/about`
Parallel FR/EN columns at lg+, single column on mobile. First-person operator details (bakery, carpooling, chess, Dakar). No headshot at top; one black-and-white photograph at the bottom, intentionally small.

### `/contact`
One-screen page. Mono email, WhatsApp, Calendar link, each on its own line preceded by a numeric label. Form lives below the fold, not at top. (Form already exists, keep it but de-emphasize.)

---

## 12. Copy direction

- Sweep `messages/en.json` and `messages/fr.json` to remove every em dash. Use commas, colons, semicolons, periods, parentheses.
- Hero sentence loses the "I build... for..." structure. Replacement direction:
  > Operational software for fintechs and operations-heavy businesses. Built from Dakar, in French and English.
- Section labels get numeric prefixes: `01 — SELECTED WORK`, `02 — HOW I WORK`, `03 — WRITING`, `04 — CONTACT`. Mono, ALL CAPS, tracking 0.12em.
- Every case-study card carries one mono metadata line: `Fintech ops · 2024–present · Senior technical operator`. No "Read more →" button; the whole card is the link.
- Add a single "Currently —" line below the hero, e.g. `Currently — May 2026 / Everest Finance / Dakar / accepting two engagements in Q3`.

---

## 13. New components to introduce

| Component | Purpose |
|---|---|
| `<MetalPanel>` | Base metallic surface, optional `interactive` prop enables specular drift |
| `<NumericLabel>` | Mono uppercase prefix + hairline, used at every section header |
| `<ParallelText>` | Two-column EN/FR block, stacks below md |
| `<SystemMap>` | Wraps a Mermaid/SVG diagram in the dossier frame (hairline, numeric caption, FR/EN caption) |
| `<CommandPalette>` | `cmdk`-based ⌘K with locale switch, navigation, "copy email", "open latest essay" |
| `<SpecularHighlight>` | Cursor-tracking layer, isolated for easy disable |
| `<LeftRailIndex>` | Numbered nav, locale toggle, theme toggle, current-section indicator |
| `<Colophon>` | Footer: stack, type, built-from, source |

---

## 14. Foundation files affected

These require explicit task permission per [`.cursor/rules/orchestrator.mdc`](../.cursor/rules/orchestrator.mdc).

- `app/globals.css` — OKLCH token rewrite, brushed-texture utilities, motion primitives, light + dark surfaces.
- Tailwind tokens (CSS-vars-only in v4) — register new color tokens.
- `app/[locale]/layout.tsx` — host the left-rail nav and the global `<SpecularHighlight>` portal.

All other work introduces new files (components, routes, content edits) and stays outside foundation lock.

---

## 15. Verification gates per task

- `bun run build && bun run lint` (standard).
- Lighthouse on `/en` and `/fr`: perf ≥ 95 mobile, accessibility 100.
- Specular handler must be cancelable and gated on `prefers-reduced-motion`.
- Visual check: at default zoom, can a founder identify positioning + one case study within 30 seconds?
- Both light and dark surfaces shipped on every component; visual regression check at both themes.

---

## 16. Backlog tasks generated by this shape

Added under phase P4 in [`backlog.json`](./backlog.json). Tasks are sized to a single builder subagent and respect foundation-lock unless explicitly noted.
