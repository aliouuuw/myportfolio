# Lab Precision — design direction

Living reference for the precision portfolio home at `/` (EN) and `/fr` (FR).
Stylesheet: `src/styles/lab-precision.css`. Data: `src/data/lab-precision.ts`
+ Content Collections via `src/lib/work-registry.ts`.

Status: **Engagement Console (Direction A) is production home** (board retired).
Background journey / credentials softened to match Work calm (2026-08-06).

Target reaction:

> "This person probably writes excellent software."

Brand refs: ElevenLabs (editorial structure only), Polestar, Nomos, Veilance,
Sony — material is soft-UI, not pastel marketing orbs.

---

## Theme

- **Default: light editorial** — ElevenLabs off-white canvas (`#f5f5f5`),
  warm near-black ink (`#292524`), soft-UI lift on peeks / pills / mode track.
  No pastel orbs.
- **True dark alternate** — stone-black soft-UI (`#0c0a09`), same structure.
  Toggle persists via `portfolio-theme` localStorage.
- **Palette: Editorial + Ember Trace** — cool editorial grey + sparse ember.
  - Canvas: `#f5f5f5` / `#0c0a09`
  - Ink: `#292524` / `#f5f5f4`
  - Accent: `#c2410c` light / `#fb923c` dark
  - Ink CTAs: `#292524` on off-white / `#f5f5f4` on stone
- **Accent discipline:** ember is for status lamp, active signal, links, peek
  wash, domain tint — never primary CTA fills, never full-panel washes.
  Voltage stays rare on purpose (instrument heat, not alert chrome).
- **Token aliases:** case-study `tokens.css` exposes `--bg`/`--cta`/`--lift`
  aliases aligned with home vocabulary (full merge still optional).

## Design language

**Take from ElevenLabs:** type ladder (light display / quiet body), ink pill
CTAs, outline secondary pills, voice-row / directory list DNA, ~96px section
rhythm, badge-pill availability, single soft elevation for peeks, warm
near-black ink on quiet off-white (`#f5f5f5`).

**Accent (ours):** Ember Trace — neo-futurist heat without browser blue or
AI-purple. Sparse use only.

**Keep ours:** Switzer + JetBrains Mono, soft-UI machined lift/well depth,
Engagement Console instrument panel — not atmospheric orbs.

**Don't take:** mint/peach/lavender orbs, white card grids, Inter/Waldenburg,
saturated action greens, coding-theatre UI, blue-filled CTAs, Arc cream,
Arc royal blue as brand voltage.

---

## Information architecture

**One page, two views.** Work is the foreground; Background lives as a blurred
layer behind it and sharpens when selected. No separate About page.

```
/  (+ /fr)
  Header island (content-hugging):
    ● Available | Work · Background | EN / FR · theme
  Work (foreground):
    Centered hero — role, name, bio, contact, background CTA
    Engagements Console — master-detail: left rail → right dossier
  Background (layer behind → crisp when active):
    Portrait · intro · off the clock
    Journey (quiet git-log timeline)
    Education and certifications (soft-UI cards)
```

Hash `#background` opens Background; `#engagement-{slug}` deep-links a
dossier. Returning from Background restores the last engagement hash.
Escape returns to Work. View state: `lab-precision-controller.ts`.

### Header

- No wordmark — name belongs in the hero, not chrome.
- Content-hugging instrument island (centered), not a stretched full-width bar.
- Three zones with hairline rules: status · modes · tools.
- Work | Background is the only soft-UI segmented well.
- Locale is quiet mono `EN / FR`; theme is a Hugeicons sun/moon ghost button.
- Availability is a lamp + short label (full detail in `title`).

### Work — engagements console (Direction A)

**Engagement Console** — master-detail panel.

- **Left rail (~272px)**: engagements (anchors first, then by period). Each row
  shows name + period in mono. Active row uses soft-UI raised pill (mode-track
  language), not a left accent bar.
- **Right dossier**: name, summary, period + domain badge, surfaces, case-study CTA.
- **Progressive enhancement**: without JS, all dossiers visible.
- **Mobile (<760px)**: rail becomes horizontal pill tabs; period hidden.

**Data flow**: `getEngagements()` → `initEngagementConsole`.

**Still open / needs work:**

- Surface copy quality (blurbs, stack labels) — some still thin
- Everest video peek — media exists; preview shell removed until wired

### Background

Portrait + positioning + contacts + off the clock are localized EN/FR.

Journey uses a quiet timeline metaphor (branch chips in ink, not ember wash).
Credentials use the same soft-UI card lift as console surfaces.

---

## i18n

- EN at `/`; FR at `/fr`.
- Header chrome is bilingual (nav, availability, locale, theme aria).
- Locale links preserve `#background` when switching.
- Background body copy is localized (hero, journey, credentials).
- Work FR section title: Mandats; domain badges localized (Systèmes / Opérations).

---

## Open questions

- Whether Journey keeps the git-log metaphor long-term or becomes a plain timeline
- When (if) to wire Everest video peek into the console
- Whether dual token files should fully merge into one shared sheet
