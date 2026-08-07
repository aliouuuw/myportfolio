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

- **Default: light editorial** — Material grey canvas (`#f8f9fa`),
  Google ink (`#202124`), soft-UI lift on peeks / pills / mode track.
  No pastel orbs.
- **True dark alternate** — Material grey-900 soft-UI (`#202124`), same structure.
  Toggle persists via `portfolio-theme` localStorage.
- **Palette: Editorial + Google Blue** — Google brand, restrained.
  - Canvas: `#f8f9fa` / `#202124`
  - Ink: `#202124` / `#e8eaed`
  - Accent: `#4285f4` light / `#8ab4f8` dark (Google Blue)
  - Status green on lamp; dossier surfaces use soft blue tint
  - CTAs: Google Blue pills (`#4285f4` / `#8ab4f8`)
  - Chips: shared muted language (not rainbow)
- **Accent discipline:** polished roles, one system.
  - Green (`--status`): availability lamp only
  - Blue (`--accent` / `--cta`): primary CTAs, links, focus, soft console selection
  - Blue wash (`--surface-tint`): dossier surface cards for panel contrast
  - Chips (`--chip-*`): one quiet muted language for roster counts + domain badges
  - Selection chrome: soft-UI lift (modes/locales) — no side bars, no chip rainbow
  Skipped: yellow meta chips, domain color taxonomy, multi-corner washes.
- **Mobile:** stacked console shows ~2⅔ client rows with a bottom fade/blur
  cue (fade clears at end); intrinsic CTA pills; journey cards share
  `--surface-tint`; safe-area + coarse-pointer targets on chrome.
- **Token aliases:** case-study `tokens.css` exposes `--bg`/`--cta`/`--lift`
  aliases aligned with home vocabulary (full merge still optional).

## Design language

**Take from ElevenLabs:** type ladder (light display / quiet body), pill
CTAs, outline secondary pills, voice-row / directory list DNA, ~96px section
rhythm, badge-pill availability, single soft elevation for peeks, Google
ink on Material grey canvas (`#f8f9fa`).

**Accent (ours):** Google Blue for action and surface tint; green for live
status. Chips stay quiet and consistent. Red/yellow stay off chrome.

**Keep ours:** Switzer + JetBrains Mono, soft-UI machined lift/well depth,
Engagement Console instrument panel — not atmospheric orbs.

**Don't take:** mint/peach/lavender orbs, white card grids, Inter/Waldenburg,
red as CTA fills, Material four-color rainbow chrome, coding-theatre UI,
Arc cream, yellow as global brand voltage.

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

Journey uses a quiet timeline metaphor (branch chips in ink, not accent wash).
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
