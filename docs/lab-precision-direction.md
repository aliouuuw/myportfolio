# /lab/precision — design direction

Living reference for the "Precision Minimalism" homepage direction, prototyped at
`src/pages/lab/precision.astro`. This is a **standalone mock**, not wired into the
production board (`/`, `/fr`) or `Base.astro`. It has its own stylesheet
(`src/styles/lab-precision.css`) so it can be iterated on without touching the
shipped operator board.

Status: **IA locked** (2026-07-31). UI craft, portrait treatment, and journey
format are explicitly deferred — see Open questions below.

---

## Why this direction exists

The operator board is the shipped production surface. This mock is a parallel
exploration of a calmer, more restrained visual language — closer to how
Polestar, Porsche, Audi, Nomos, Braun, and Apple communicate competence: through
restraint and precision, not motion or decoration.
Note again:
Polestar, porsche, audi,nomos glaschutte, Theory, Arcteryx Veilance, Lamy, Apple, Sony

Target reaction from a visitor:

> "This person probably writes excellent software."

Not:

> "This person is good at animations."

## Design language (locked)

- **Palette**: near-black graphite (`#0e0d0b` / `#161412`) or near-white paper in
  light mode, single muted olive accent (`#93a25a` dark / `#657439` light). No
  saturated color, no gradients as decoration (gradients only appear inside real
  product screenshots).
- **Typography**: Switzer for display/body, JetBrains Mono for labels and
  metadata. Very few weights (500/600 for emphasis, 400 for body).
- **Structure**: thin hairline borders (`1px`, ~9–18% opacity) instead of
  shadows. Sharp-ish corners, 6–8px radius max.
- **Motion**: 150–250ms fades and opacity/scale only. No bounce, no elastic, no
  parallax, no glow. Mechanical, not playful. `prefers-reduced-motion` disables
  all of it, including video autoplay.
- **Content philosophy**: show the engineering (test counts, CI pipelines,
  architecture decisions, trade-offs) instead of narrating skills.

## Information architecture (locked 2026-07-31)

### Single viewport, two modes

The page is exactly `100dvh`, no scroll, on desktop (≥1100px). Below that it
becomes a normal flowing page. There are two board **modes**, toggled by a
button, not a route:

| | **Work mode** (default) | **About mode** |
|---|---|---|
| Left column | Name, positioning line, contact row, `About me →` entry, media preview pane | Portrait frame, bio, contact row, `← Work` |
| Right column | Domain filters + engagement index (table) | Journey rail, education/certifications, "off the clock" |

Rationale: About was originally a tab inside the work index (a peer of the
project list). That undersold it. About is about *the person*, so it now lives
on the profile side and takes the full board — giving it room for the portrait
treatment and journey storytelling that's still to be designed.

### Index rows are engagements, not individual builds

Early versions listed individual product surfaces as rows (e.g. three separate
Everest rows for the site, savings app, and Formos tool). This hid depth: a
casual scan made it look like there were 13 flat, equally-small projects.

The index now lists **one row per client/employer**, carrying a `builds` count:

```
Everest Finance   Fintech   SGI · site, savings app, campaign tooling   3 builds   2025 - now
```

The row's `href` points at that engagement's case study/detail page. The count
is a promise that the destination shows more — nothing is permanently hidden
behind a single screenshot again. **Follow-up work**: today most `href`s still
point at the existing single-scope `/work/[slug]` case studies. A real
`/work/everest-finance` page needs to actually enumerate all three Everest
surfaces before this promise is fully honest.

### Domain classification: 4 canonical domains, filterable

Consolidated from ~8 ad-hoc per-row labels (Logistics, Retail, Marketplace,
Education, Automotive, Drone/AI, Institution, Operations) down to 4 canonical
domains shown as a filter row with live counts:

- **Fintech**
- **ERP & QA**
- **Systems**
- **Operations** (logistics, retail, education, marketplace, automotive — all
  operational software for non-tech-native businesses)

The filter is the coarse cut (`All / Fintech / ERP & QA / Systems /
Operations`); the original specific label survives as row detail text (e.g.
"Logistics · freight ops, customs"). Default filter is `All`.

## Open questions (not yet decided)

1. **Simpler IA for the soft-UI instrument (especially mobile).** Desktop craft
   (bezel + chin + engagement index) is ahead of the information architecture.
   Phone today is still a stacked scale-down. Target rethink (not yet shipped):
   compact identity → featured instrument → Top 4–5 engagements with “Show all”
   + filter sheet; About = portrait → bio → progressive journey/credentials.
   Touch targets and scroll-to-proof on select are the interim adapt pass.
2. **Journey format in About mode.** Currently a plain chronological rail
   (placeholder). Two real directions on the table:
   - **Storytelling** — narrative prose, chapter-like.
   - **Git-branch model** — journey rendered as commits/branches (what counts
     as a branch? employers? domains? is the BocalBun freeze an abandoned
     branch, a merge, or a tag?). This is a genuinely different IA, not a
     skin — needs its own design pass.
3. **Portrait treatment.** Frame is a labeled placeholder today. Target: dither
   effect, glass/magnetic interaction, subtle animation. Craft work, deferred.
4. **Engagement pages.** Need a page template that lists every build for a
   client (starting with Everest's 3) instead of routing to a single-scope
   case study.
5. **Everest/ERGOBIT naming and screenshot permissions** — same open item as
   production (`docs/launch-prerequisites.md`), applies here too since the mock
   reuses the same case-study media.

## Non-goals for this mock

- Not replacing the operator board yet. No decision has been made to promote
  this direction to production.
- Not the place to resolve Everest/ERGOBIT CEO permission blockers — tracked in
  `docs/launch-prerequisites.md`.
- Full mobile IA rethink (featured tier / filter sheet) — tracked under Open
  questions #1; interim adapt only until that pass.

---

*Last updated: 2026-07-31 — soft-UI instrument shipped; simpler mobile IA pending.*
