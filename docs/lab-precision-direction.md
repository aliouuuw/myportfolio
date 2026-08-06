# /lab/precision — design direction

Living reference for the precision portfolio direction, prototyped at
`/lab/precision` (EN) and `/fr/lab/precision` (FR chrome). Standalone mock —
not wired into the production Operator Board. Stylesheet:
`src/styles/lab-precision.css`. Data: `src/data/lab-precision.ts`.

Status: **Engagement Console (Direction A) implemented** (2026-08-06).
Background journey / credentials still need craft work before any promotion call.

Target reaction:

> "This person probably writes excellent software."

Brand refs: ElevenLabs (editorial structure only), Polestar, Nomos, Veilance,
Sony — material is soft-UI, not pastel marketing orbs.

---

## Theme

- **Default: light editorial** — cool off-white canvas, warm-near-black ink,
  soft-UI lift on peeks / pills / mode track. No pastel gradient orbs.
- **True dark alternate** — cool graphite soft-UI (full token swap), same
  structure. Toggle persists via `lab-precision-theme`.
- **Palette: Slate Signal** — steel blue accent `#3d6b8c` light / `#7eb3d4` dark;
  canvas `#f4f6f8` / `#0e1114`.
- **Accent**: steel blue for status lamp, peek wash, domain tints only.
  CTAs stay ink pills (ElevenLabs rule: no saturated CTA color).

## Design language

**Take from ElevenLabs:** type ladder (light display / quiet body), ink pill
CTAs, outline secondary pills, voice-row / directory list DNA, ~96px section
rhythm, badge-pill availability, single soft elevation for peeks.

**Keep ours:** Switzer + JetBrains Mono, soft-UI machined lift/well depth,
slate accent for status/peek, product media as brand voltage on hover — not
atmospheric orbs.

**Don't take:** mint/peach/lavender orbs, white card grids, Inter/Waldenburg,
saturated action greens, coding-theatre UI aimed at visitors (import maps,
slug chips as primary labels).

---

## Information architecture

**One page, two views.** Work is the foreground; Background lives as a blurred
layer behind it and sharpens when selected. No separate About page as the
primary path (`/lab/precision/about` redirects to `#background`).

```
/lab/precision  (+ /fr/lab/precision)
  Header island (content-hugging):
    ● Available | Work · Background | EN / FR · theme
  Work (foreground):
    Centered hero — role, name, bio, contact, "Check my background"
    Engagements Console — master-detail: left rail (engagements by recency) → right dossier (surfaces + CTA)
  Background (layer behind → crisp when active):
    Portrait · intro · off the clock
    Journey (git-log experiment — needs refinement)
    Education and certifications (needs refinement)
```

Hash `#background` opens Background; Escape returns to Work. View state is
synced in `lab-precision-view.ts`.

### Header

- No wordmark — name belongs in the hero, not chrome.
- Content-hugging instrument island (centered), not a stretched full-width bar.
- Three zones with hairline rules: status · modes · tools.
- Work | Background is the only soft-UI segmented well.
- Locale is quiet mono `EN / FR`; theme is a Hugeicons sun/moon ghost button.
- Availability is a lamp + short label (full detail in `title`).

### Work — engagements console (Direction A)

**Engagement Console** — master-detail panel replacing the domain directory.

- **Left rail (260px)**: engagements sorted by recency (most recent first). Each row shows engagement name + period in mono. Active row gets left-edge accent bar (3px) + subtle wash.
- **Right dossier**: clicking an engagement reveals its full dossier — name, role/summary, period + domain badge, surfaces (name, blurb, stack, link), and "View case study" CTA.
- **Progressive enhancement**: without JS, all dossiers are visible. With JS, only the first is shown; rail buttons switch panels.
- **Mobile (<760px)**: rail becomes horizontal pill tabs above the dossier; period hidden; dossier stacks with reduced padding.

**Data flow**: `src/lib/work-registry.ts` → `getEngagements()` sorted by period desc → `src/scripts/capability-console.ts` (renamed to `initEngagementConsole`) handles panel switching via `data-eng` attributes.

**Still open / needs work:**

- Surface copy quality (blurbs, stack labels) — some are placeholders
- Case study links — most are TBD
- Video peek integration for Everest (media field exists, not yet wired to preview)
- Whether single-engagement dossiers need a different visual weight

### Background

Portrait + short positioning + contacts + off the clock are in place.

**Still open / needs work:**

- **Journey** — git-log / branch metaphor is an experiment; may stay, soften,
  or be replaced with a clearer visitor-readable timeline
- **Education and certifications** — list exists; presentation needs a polish
  pass to match the Work directory's calm
- Portrait craft (dither / magnetic) still optional

---

## i18n

- EN at `/lab/precision`; FR at `/fr/lab/precision`.
- Header chrome is bilingual (nav labels, availability, locale switch).
- Locale links preserve `#background` when switching.
- Page body copy on the FR route is still largely English until a content pass.

---

## Open questions

1. Journey format (keep git-log, soften, or replace with timeline).
2. Surface copy quality — blurbs need real content, not placeholders.
3. Education / credentials presentation.
4. Portrait craft (dither / magnetic) — optional.
5. Engagement pages that list every build (Everest ×3).
6. Everest/ERGOBIT naming and screenshot permissions.
7. Promotion: Operator Board vs precision — deferred until mock feels shippable
   in the open sections above.

## Non-goals

- Not replacing the operator board yet.
- Not resolving CEO permission blockers.
- Not treating coding metaphors as the primary visitor UI on Work
  (Background may keep light engineering flavour if it earns clarity).

---

*Last updated: 2026-08-06 — Engagement Console (Direction A) implemented; Journey + credentials + surface copy still open.*
