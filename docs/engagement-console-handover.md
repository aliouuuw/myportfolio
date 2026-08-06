# Engagement Console — Handover

**Last updated:** 2026-08-06  
**Status:** Implemented in production site (`src/pages/index.astro`, `/fr/index.astro`)  
**IA:** Direction A — Master-Detail Dossier Console

---

## 1. What this is

The **Engagement Console** replaces the domain-grouped directory with a master-detail panel:

- **Left rail**: 8 engagements sorted by recency (most recent first)
- **Right dossier**: Click an engagement → full dossier with surfaces + case study CTA

This is the primary "Work" view on the production homepage (`/`, `/fr/`).

---

## 2. Files

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | EN homepage — engagement console markup |
| `src/pages/fr/index.astro` | FR homepage — engagement console markup |
| `src/lib/work-registry.ts` | `getEngagements()` sorted by period desc |
| `src/scripts/capability-console.ts` | `initEngagementConsole()` — panel switching (JS) |
| `src/styles/lab-precision.css` | Console styles (lines ~957–1207) |
| `src/data/lab-precision.ts` | Types: `Engagement`, `Surface`, `domainSlug` |

---

## 3. Data flow

```
getEngagements() → sorted by period desc (year)
  → index.astro maps each engagement to:
      • rail button: data-eng={slug}, name + period
      • dossier panel: id="dossier-{slug}", full content
  → initEngagementConsole() hides all but first, wires rail clicks
```

**Engagement shape** (`src/data/lab-precision.ts`):
```ts
interface Engagement {
  name: string;
  slug: string;
  domain: Domain;
  detail: string;        // role/summary
  builds: number;
  period: string;        // "2025 – now"
  href?: string;         // /work/{slug}
  media?: string;        // Everest video peek id
  caption?: string;
  surfaces: Surface[];
}

interface Surface {
  name: string;
  nameFr?: string;
  blurb: string;
  blurbFr?: string;
  url?: string;
  urlLabel?: string;
  urlLabelFr?: string;
  video?: string;
  poster?: string;
  stack: string[];
}
```

---

## 4. Current engagements (8)

| Order | Engagement | Period | Domain | Surfaces |
|-------|------------|--------|--------|----------|
| 1 | Everest Finance | 2025 – now | Fintech | 3 |
| 2 | ERGOBIT | 2024 – 26 | ERP & QA | 2 |
| 3 | BankingBook Analytics | 2023 – 24 | Fintech | 1 |
| 4 | Ndouckmane Transit | 2023 | ERP & QA | 3 |
| 5 | Mansour Holding | 2022 | Systems | 2 |
| 6 | EduPlan | 2022 | Operations | 2 |
| 7 | Dakar Sport Shop | 2021 | Operations | 1 |
| 8 | BocalBun Retrospective | 2020 | Operations | 1 |

---

## 5. Visual spec

### Rail (left, 260px)
- Background: `var(--surface)` (white in light, dark graphite in dark)
- Border-right: 1px `var(--hairline)`
- Buttons: 0.625rem × 0.875rem padding, `var(--sans)` 0.875rem
- Inactive: `var(--ink-soft)` (muted)
- Hover: `var(--ink)` + `var(--surface-muted)` 50% wash
- Active: `var(--ink)` weight 500, **left-edge accent bar 3px** `var(--accent)`, `var(--accent)` 5% wash
- Period: `var(--mono)` 0.625rem, `var(--ink-faint)` (hidden on mobile)

### Dossier (right, 1fr)
- Padding: 2rem × 2.25rem (mobile: 1.25rem × 0.75rem)
- Title: 1.25rem, weight 600, `var(--ink)`
- Subtitle (detail): 0.9375rem, `var(--ink-soft)`, max-width 42rem
- Meta row: period (mono 0.6875rem) + domain badge (pill, domain-tinted)
- Divider: 1px `var(--hairline)` below meta row
- Surfaces: indented with 2px left border `var(--hairline)`, 1rem padding-left
  - Name: 0.875rem weight 500
  - Blurb: 0.8125rem `var(--ink-soft)`
  - Stack: mono 0.6875rem `var(--ink-faint)`
  - Link: `var(--accent)` 0.8125rem weight 500, gap animation on hover
- CTA: "View case study" ink pill, top border `var(--hairline)`, gap animation

### Mobile (<760px)
- Rail becomes horizontal pill tabs (flex-wrap, gap 0.25rem)
- Period hidden on tabs
- Active tab: bottom border 2px `var(--accent)`
- Dossier padding reduced, title 1.125rem, meta row wraps

---

## 6. JS behavior (`initEngagementConsole`)

```ts
// Progressive enhancement
// 1. Hide all dossiers except first
// 2. Mark first rail button .is-active, aria-expanded="true"
// 3. On rail click:
//    - Remove .is-active from all, set aria-expanded="false"
//    - Add .is-active to clicked, aria-expanded="true"
//    - Show matching dossier (id="dossier-{slug}"), hide others
```

**No dependencies** — vanilla ES module, runs after Astro hydration.

---

## 7. Open work (for next agent)

### High priority
- [ ] **Surface copy** — most blurbs are placeholders; need real content per engagement
- [ ] **Case study links** — `surface.url` mostly empty; wire to real URLs when available
- [ ] **Everest video peek** — `engagement.media` exists but not wired to preview controller

### Medium priority
- [ ] **Single-engagement visual weight** — dossiers with 1 surface feel light; consider tighter layout
- [ ] **FR surface copy** — `nameFr`, `blurbFr`, `urlLabelFr` mostly fall back to EN
- [ ] **Domain badge colors** — verify dark mode tints are legible

### Low priority
- [ ] **Keyboard nav** — arrow keys between rail items (currently only click)
- [ ] **Deep link** — `#engagement-{slug}` to open specific dossier on load
- [ ] **Scroll sync** — if dossier is tall, rail should stay sticky (currently not)

---

## 8. Related docs

| Doc | Use for |
|-----|---------|
| `lab-precision-direction.md` | Full design direction context |
| `portfolio-plan.md` | Conversion goals, audience, positioning |
| `strategic-plan.md` | Career direction, network leverage |
| `ux-ui-handover.md` | Production site bar (Stripe clarity) |

---

## 9. Quick verification

```bash
bun run build      # must pass
bun run lint       # astro check (TS + Astro diagnostics)
```

Dev server: `bunx astro dev --port 4322` → `http://localhost:4322`

---

*End of handover.*
