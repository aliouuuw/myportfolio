# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: founders, CTOs, and network referrals evaluating whether to hire or
contract Aliou Wade for operational software work.

Situation: they need someone who can own real systems (fintech, ERP, logistics,
ops-heavy businesses), not a generic frontend freelancer or agency pitch.

Job: decide quickly whether Aliou is credible enough to start a conversation,
then convert that into a contractor engagement or job.

Secondary audiences (same surface, lower priority): peers and warm intros who
may pass the site onward.

## Product Purpose

A bilingual (EN/FR) portfolio and case-study site that converts capability into
career leverage. It is a conversion tool, not a project gallery.

Success (ranked):

1. Land a contractor gig or job
2. Start a direct conversation (email, WhatsApp, LinkedIn)
3. Earn a warm intro onward

Visitor reaction to earn: “This person probably writes excellent software.”

## Positioning

Operational systems for fintechs and ops-heavy businesses — internal tools,
workflows, ERP modules, and domain-specific systems — shipped from Dakar,
bilingual FR/EN. Public one-liner: solo operator for production systems
(fintech, ERP migrations, ops software).

Not selling: generic web/React-for-hire, agency retainers, or “I built a
framework” as the headline.

Canonical role title on the product: **Software Engineer**.

## Operating Context

- Home is a one-page, two-view instrument surface (Work / Background), not a
  separate About route.
- Work centers an Engagement Console (master–detail client dossiers → case
  studies).
- Proof lives as MDX case studies under `content/work/` plus a flagship essay
  under writing.
- Contact is direct channels (email, LinkedIn, GitHub, WhatsApp); replies within
  48h weekdays.
- Author works from Dakar (WAT); currently solo technical operator at Everest
  Finance; selective availability (limited client capacity).
- Surface URLs ending in `*` are placeholders until the public link is known —
  rendered as non-clickable “coming soon” labels.

## Capabilities and Constraints

- Astro 5 static site + selective server routes; Bun toolchain; Vercel hosting.
- No CMS, auth, or database — content is in-repo MDX validated by Zod.
- Bilingual routing: EN at `/`, FR at `/fr`.
- Contact API via Resend (`src/pages/api/contact.ts`).
- Operator Board is retired (`/board` 301s home).
- Do not add a fourth homepage anchor case before the first three are solid.
- Some case studies still have publication gates (naming, screenshots, client
  sign-off) — do not invent cleared public claims.
- Undecided: exact public launch packaging for gated Everest/ERGOBIT assets.

## Brand Commitments

- Name: Aliou Wade
- Voice: first person; serious, operational, calm — not agency-template or
  third-person biography
- Live home identity: Lab Precision Engagement Console (soft-UI instrument
  panel)
- Binding product docs: `docs/profile.md`, `docs/lab-precision-direction.md`,
  `AGENTS.md`
- Visual system details belong in design docs / CSS — not redefined here

## Evidence on Hand

- Anchor cases: Everest Finance, Odoo 18 Acceptance Testing Kit, BocalBun
  retrospective (`content/work/`)
- Flagship essay: why systems over frameworks (`content` writing)
- Secondary client/work records and journey history in `docs/profile.md`
- Public contact channels listed on the home surface
- Must not fabricate testimonials, revenue, cleared screenshots, or client
  quotes that are not in the repo

## Product Principles

1. Depth over breadth — few proofs that answer hard questions beat a card grid.
2. Conversion over decoration — every surface should help a decision-maker act.
3. Operational credibility — show shipped systems judgment, not stack theatre.
4. Bilingual by default — FR and EN are first-class, not an afterthought.
5. Preserve truth — do not invent claims, clients, or metrics.

## Accessibility & Inclusion

Sensible defaults: readable contrast, visible focus, usable touch targets,
keyboard-reachable controls, and bilingual content parity. No stricter WCAG
mandate was set for this product.
