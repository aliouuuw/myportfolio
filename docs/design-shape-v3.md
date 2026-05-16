# Design Shape v3 — "Classified Operational Record"

Replaces [`design-shape-v2.md`](./design-shape-v2.md).
Companion to [`portfolio-plan.md`](./portfolio-plan.md) and [`strategic-plan.md`](./strategic-plan.md).

**Register:** brand. The portfolio IS the product.
**Built on:** commit `81e1980` — tokens, fonts, MetalPanel, NumericLabel are already wired.

---

## 1. The single governing idea

The portfolio is a **classified operational record** that has been partially declassified for sharing.

Not a gallery. Not a CV. Not a designer's showcase.

A dossier. A file that was created for internal use and is now being released — carefully, selectively — to the right people. Every design decision should reinforce this feeling: this person builds serious operational systems, they know what to show and what to protect, and what you are reading is the real thing, not a pitch deck.

The site must answer these questions within 30 seconds for any of the three audiences:

| Reader | Immediate answer needed |
|---|---|
| Founder / CTO | Can this person own and ship a real system? |
| Network referral (Everest CEO, ERGOBIT) | Is this credible enough to forward to my contact? |
| Odoo / ERP professional | Has this person done real ERP work, not tutorials? |

Every layout decision, copy choice, animation, and visual element must serve one of those three. If it does not, it is cut.

---

## 2. Two directions, fused

**Magnetic Case Files** provided: the materiality (stamped metal file-tabs, redaction reveal, classification labels, magnetic card pull) and the content metaphor (each case study is a file to be opened).

**Declassified Systems Report** provided: the page structure (executive summary → situation → system → result), scroll-driven diagram drawing, and the narrative unlock rhythm (sections reveal as you read down).

The fusion principle:

> The site is organized like a case-file dossier. Each page opens like a report. The visual language is classified-document meets precision metal. The interaction is physical: files are opened, diagrams draw themselves, redacted content reveals on intent.

---

## 3. Anti-references (still applies, refined)

**Do not build:**
- Developer portfolio with project cards and skill bars
- SaaS landing page with features, pricing, testimonials
- "Creative developer" Awwwards-style cinema hero
- Agency portfolio with services page
- Anything that reads "I made a portfolio website" rather than "I built operational systems"

**Avoid these surface-level traps:**
- Glassmorphism, gradient text, animated mesh backgrounds
- Bloomberg Terminal cosplay (dark, neon-green, maximally dense)
- The "secret document" parody (faded paper, typewriter fonts, coffee stain)
- Heavy 3D, WebGL, particle fields
- Identical card grids, bento grids
- Stack/typeface/framework listed in the footer (nobody hires you for Fraunces)

---

## 4. Scene sentence

> A West African founder opens a WhatsApp referral link from the Everest CEO on their phone at a Dakar co-working café mid-morning. They share it with a European CTO contact that evening. The site must feel substantial and trustworthy in both contexts.

**Forced decisions:**
- Light surface default (mid-morning café)
- Night surface available (evening laptop)
- Bilingual FR/EN — both languages feel native, not translated
- Mobile reads identically to desktop in terms of credibility
- No animations that require hover-only; every key interaction has a scroll/tap equivalent

---

## 5. Information architecture

Routes stay the same. The structure inside each route changes significantly.

```
/                     Operational summary + three case files + contact
/work                 All case files (numbered list, not grid)
/work/[slug]          Declassified case report (full narrative)
/writing              Field notes (essays)
/writing/[slug]       Single essay
/about                First-person operator record
/contact              Direct contact — no form above the fold
```

### What the homepage IS

A one-page executive summary of one person's operational record.

Structure (top to bottom):

```
01  Identity block
    — Name, role (mono), positioning sentence (serif)
    — "Currently:" line with live pulse dot
    — Two text links (View record / Get in touch)

02  Case files (3)
    — Everest Finance         [ACTIVE · Fintech Operations · 2024–present]
    — Odoo Testing Toolkit    [SHIPPED · ERP Systems · 2023]
    — BocalBun Retrospective  [ARCHIVED · Systems Judgment · 2022]

03  Field note (single essay teaser, hairline, no card chrome)

04  Contact line
    — One sentence. Email + WhatsApp. No CTA section with a big button.
```

**No:** systems diagram, "How I work" section, colophon footer, left-rail numbered index, separate theme toggle page section.

### What the homepage is NOT

- A feature list of what you can do
- A gallery of every project
- A "I am available for freelance" pitch

### Case file cards (homepage)

Each card is a `MetalPanel` with:
- Classification stamp (CONFIDENTIAL, OPEN SOURCE, RETROSPECTIVE)
- File reference number (CF-001, CF-002, CF-003)
- Title in serif
- One-line domain + date in mono
- One-sentence summary
- Status chip (ACTIVE / SHIPPED / ARCHIVED)
- The entire card is the link — no "View case study →" button

The three cards sit in a **staggered list**, not a grid. Desktop: each card is full-width but inset at different left margins (creating rhythm without bento). Mobile: stacked, full-width.

### `/work` index

A numbered file cabinet list. Not a grid.

```
CF-001   Everest Finance          Fintech Ops    2024–present   ACTIVE   →
CF-002   Odoo Testing Toolkit     ERP Systems    2023           SHIPPED  →
CF-003   BocalBun Retrospective   Judgment       2022           ARCHIVED →
```

Each row is a full-width link. Hover: an accent hairline slides in from the left (magnetic glow). No thumbnail on hover — that adds noise for this audience.

### `/work/[slug]` case report

This is where the "Declassified Systems Report" structure lives:

```
[Classification header]
FILE: CF-001 · CLASSIFICATION: CONFIDENTIAL · STATUS: ACTIVE

[Title — large serif]

[Summary block — two columns at lg+, stacked at sm]
Left: EN summary
Right: FR summary

[Section 01 — Situation]
[Section 02 — Constraints]
[Section 03 — System (diagram draws on scroll)]
[Section 04 — What shipped]
[Section 05 — Outcome]
[Section 06 — What I would do differently]

[Redacted artifact]
[Prev / Next case files — two MetalPanel rows]
```

**The scroll-driven diagram** in Section 03 is an SVG that draws its connection lines progressively as the user scrolls into it. Lines are hairline weight, steel-blue accent on key connections. Not decorative — it represents the actual system architecture (anonymized where needed).

**Redacted artifact:** A screenshot or wireframe with specific regions blurred or replaced with `[REDACTED]` blocks. A small "Declassified:" label above it. The redaction is honest, not theatrical.

### `/about`

Not a biography. An operational record.

```
[Name + role in serif]
[First-person paragraph: who you are as an operator]
[Operator context: bakery, carpooling, chess — shows judgment, not just code]
[Currently: what you are doing right now]
[Languages: FR (native), EN (fluent), Wolof (native)]
[Contact links: email, WhatsApp, LinkedIn]
```

Single column. No parallel FR/EN columns — the about page IS already bilingual because the user picked their locale. The parallel display was adding length without value.

### `/contact`

One screen. No form above the fold.

```
[Large serif: "Let's work together."]
[One-line positioning reminder]

01  Email     wadealiou00@gmail.com
02  WhatsApp  +221 77 722 88 45
03  Calendar  [Calendly/Cal.com link]

[Contact form — below, for async context]
```

---

## 6. Navigation

### Desktop (lg+)

A minimal **top bar**, not a left rail. The left rail was stealing 128px of horizontal space and creating a layout that felt like an application, not a document.

```
[AW]  ·  Work  Writing  About  ·  [FR/EN]  [LN/DK]
```

- `AW` is the home link in small serif.
- Section links are plain text, no numbers in the nav itself.
- FR/EN toggle and LN/DK theme toggle sit quietly on the right.
- Active section: a hairline underline in `--color-accent`, 1px, only under the current section label.
- Height: 56px. Transparent background, becomes `--canvas` on scroll past 80px.

### Mobile (sm)

A **bottom bar** (not a hamburger). This is the 2026 pattern for document/reader apps on mobile.

```
[Home] [Work] [Writing] [About] [Contact]
```

- Icon-free. Text-only, mono, 10px ALL CAPS.
- Active: accent hairline above the active item.
- Fixed at bottom, z-50, full width.

### Command palette (⌘K)

Kept. It is genuinely useful for power users who arrive via LinkedIn or referral links and want to navigate fast.

---

## 7. Visual language

### The classification stamp

This is the visual signature unique to this direction. A small, capsule-shaped label that appears on:
- Every case file card (CONFIDENTIAL / OPEN SOURCE / RETROSPECTIVE)
- Every case report header
- The about page (OPERATOR RECORD)
- The contact page (OPEN TO ENGAGEMENTS · Q3 2026)

Implementation: a `<ClassificationStamp>` component. Dark fill (`--ink-primary`), canvas text, mono 9px ALL CAPS, tight letter-spacing. Never color-coded — always the same dark stamp. The color carries meaning only in the STATUS chip (ACTIVE = accent, SHIPPED = muted, ARCHIVED = tertiary).

### File reference numbers

Every case file has a reference: `CF-001`, `CF-002`, `CF-003`. These appear in:
- The case file card (small mono, top-left)
- The `/work` list row
- The case report header
- The prev/next navigation at bottom of case reports

This number is the thread that ties the whole site together. It is not decoration. It is how a real operational system would track its files.

### Redaction

Where client details must be protected:
- Specific names, product URLs, internal metrics → `[REDACTED]`
- Screenshots → specific regions blurred with CSS `filter: blur(8px)` + a `[SENSITIVE]` label overlay
- System diagrams → anonymized node labels, but real topology preserved

A small note at the top of any redacted section: "This content has been partially declassified. Full details available under NDA."

This turns a limitation (confidentiality) into a trust signal.

### MetalPanel usage — restrained

Apply to:
- The identity block on the homepage (the one "card" you hold)
- Each case file card
- Prev/Next navigation rows at bottom of case reports

Do NOT apply to:
- Navigation bar
- Footer
- Section headers
- The essay teaser
- The contact block

The metal surface is valuable because it is rare. Three or four metal objects per page maximum.

### Specular highlight

Keep the cursor-tracked radial gradient on case file cards. It is the single best "magnetic" interaction. Limit it to the `interactive` prop on MetalPanel — only cards get it, not the identity block.

---

## 8. Color strategy (unchanged from v2 tokens)

The OKLCH tokens are already in `globals.css` and are correct. Do not change them.

Light surface (default), night surface (via `data-theme="dark"`), system preference fallback — all already wired.

**One adjustment needed:** The accent `oklch(0.62 0.045 235)` is too desaturated. It reads as gray. Raise chroma to `0.10` for the accent. `oklch(0.62 0.10 235)` — this is the difference between a visible signal and wallpaper.

---

## 9. Typography

Already wired: Fraunces (serif display), Inter (sans), JetBrains Mono. No changes.

**Usage rules:**

| Context | Font | Size | Weight |
|---|---|---|---|
| Hero name | Fraunces | clamp(2.5rem, 6vw, 4rem) | 380 |
| Section headings | Fraunces | clamp(1.75rem, 3vw, 2.5rem) | 380 |
| Case file title on card | Fraunces | 1.25rem | 380 |
| Case report title | Fraunces | clamp(2rem, 5vw, 3.5rem) | 380 |
| Body text | Inter | 1rem / 1.65 lh / 68ch max | 400 |
| Metadata, mono labels | JetBrains Mono | 0.6875rem / 11px | 500 |
| Classification stamps | JetBrains Mono | 0.5625rem / 9px | 600 |
| Navigation | Inter | 0.875rem | 400 |

Body line-length hard cap at 68ch everywhere. Case report prose is the most critical — never full-width.

---

## 10. Motion

Three motion types. All respect `prefers-reduced-motion`.

### 1. Magnetic card lift (on case file cards)

On hover: `translateY(-2px)` + `box-shadow` depth increase. Duration 400ms ease-out-expo. Not the specular highlight (which is separate) — this is the physical lift.

On click: `translateY(0)` + slight shadow reduction (the "press" before navigation). 120ms ease-in.

### 2. Scroll-driven diagram drawing

In case reports, Section 03 (System). An SVG with paths. Use `stroke-dasharray` + `stroke-dashoffset` driven by an `IntersectionObserver` entry ratio or scroll position within the diagram container. Lines draw from left to right as the section enters view. Duration: matched to the time it takes the average reader to read Section 02.

No JavaScript animation libraries needed — pure CSS transitions on the SVG attributes, triggered by a class added via IntersectionObserver.

### 3. Section reveal (case report only)

Each of the 6 report sections (Situation, Constraints, System, Shipped, Outcome, Lessons) enters with `opacity: 0 → 1` + `translateY(6px → 0)`. Not a global animation — only in case reports. Duration 500ms ease-out-quart. Stagger 80ms between sections that are simultaneously in view.

This replaces "word-by-word reveal" from v2 — it was too fussy and hard to execute correctly across multiple contexts.

### What is NOT animated

- Navigation transitions (page loads are instant; no page transition layer)
- The hero identity block (it is static; it is there when you arrive)
- The `/work` list rows (they are instantly visible; they do not fade in)
- Footer

---

## 11. Accessibility

This section is non-negotiable. The "classified document" aesthetic should not compromise usability.

- **Color contrast:** All text meets WCAG AA minimum. Mono labels at 11px must meet 4.5:1 ratio. If OKLCH tertiary ink on canvas does not pass, lighten the canvas slightly, not the text.
- **Focus states:** Every interactive element has a visible focus ring using `--color-accent` at 1px offset. This is more visible than the `--ink-primary` ring from v2.
- **Reduced motion:** Every transition/animation is wrapped in `@media (prefers-reduced-motion: reduce)` or checked via `window.matchMedia`. The diagram does not draw; it appears at full opacity immediately. The card lift does not animate; the shadow changes instantly.
- **Screen reader:** Classification stamps use `aria-label` with the full text (e.g., `aria-label="Classification: Confidential"`). File reference numbers are not read as content (`aria-hidden="true"`). Case file cards use `<article>` semantics.
- **Keyboard navigation:** Every case file card is focusable and activatable by Enter/Space. The `/work` list rows are `<a>` elements, not `<div onClick>`. The command palette trap-focuses correctly.
- **Mobile touch targets:** Every interactive element is minimum 44×44px. Classification stamps are display-only (not tappable). Row hover states degrade gracefully to tap states.

---

## 12. Copy direction

The tone is: **precise, first-person, operator-grade**. Not humble, not boastful. Operational.

**Hero sentence (EN):**
> I build operational software systems for fintechs and operations-heavy businesses — internal tools, CRMs, admin panels, and domain-specific workflows — from Dakar, bilingual FR/EN.

This is already in `portfolio-plan.md`. Use it verbatim.

**Hero sentence (FR):**
> Je conçois des systèmes logiciels opérationnels pour la fintech et les entreprises à forte charge opérationnelle — outils internes, CRM, back-offices et workflows métier — depuis Dakar, bilingue FR/EN.

**Currently line:**
> Currently: Senior Technical Operator at Everest Finance. Open to two engagements, Q3 2026.

**Case file summaries (one sentence each, under 15 words):**
- Everest: Consolidating CRM, website, and customer app into one operational system.
- Odoo Toolkit: Acceptance testing infrastructure for Odoo 18 ERP migration teams.
- BocalBun: Why I stopped building a framework and what it cost me.

**What to sweep:**
- All em dashes (—) → colons, commas, or nothing
- Every "I build..." construction → prefer noun-first: "Operational software for..."
- Never "Full-stack developer", "React specialist", "freelancer"
- Never "passion", "love", "excited to" in any sentence

---

## 13. Components to build (fresh from v2 revert state)

These are the net-new components. `MetalPanel`, `SpecularHighlight`, `NumericLabel`, `SectionHeader` are already built.

| Component | What it does | Used on |
|---|---|---|
| `<ClassificationStamp>` | Dark capsule label, mono 9px ALL CAPS | Case cards, case reports, about, contact |
| `<CaseFileCard>` | MetalPanel + file number + stamp + title + summary + status | Homepage, /work grid |
| `<FileReferenceRow>` | Full-width link row for /work list | /work |
| `<CaseReportHeader>` | Classification header, large serif title, FR/EN summary | /work/[slug] |
| `<ScrollDiagram>` | SVG with scroll-driven line drawing | /work/[slug] Section 03 |
| `<RedactedArtifact>` | Screenshot/image with blur regions + [REDACTED] overlays | /work/[slug] |
| `<CommandPalette>` | ⌘K palette with cmdk | Global |
| `<TopNav>` | Minimal top bar with AW, links, locale/theme toggles | Global layout |
| `<BottomMobileNav>` | Bottom tab bar for mobile | Global layout (sm only) |
| `<ContactBlock>` | Numbered contact methods, no form above fold | /contact, homepage |

---

## 14. What we keep from existing code

| Already built | Keep? | Notes |
|---|---|---|
| OKLCH token system in `globals.css` | Yes | Raise accent chroma to 0.10 |
| Fraunces + Inter + JetBrains Mono | Yes | Correct |
| `<MetalPanel>` + `<SpecularHighlight>` | Yes | Limit interactive prop to case cards only |
| `<NumericLabel>` + `<SectionHeader>` | Yes | Use in case reports |
| `/mock` route | Keep temporarily | Delete after direction is confirmed |

---

## 15. What we rebuild or replace

| Was in v2 | What to do now |
|---|---|
| Left-rail numbered index | Replace with minimal top bar + mobile bottom bar |
| Colophon footer (stack/type/built-from) | Replace with contact + copyright only |
| Parallel FR/EN columns everywhere | Only on case report summary block; nowhere else |
| SystemMap fake diagram | Replace with real scroll-driven SVG per case study |
| "How I Work" three-card grid | Delete entirely |
| Hero wrapped in MetalPanel | Identity block — not inside a panel; the panel IS one of the cards below |
| "Currently —" inside the hero | Keep, but make it a standalone line, not inside a metal panel |

---

## 16. Verification gates per task

Every task must pass before the next starts:

1. `bun run build && bun run lint` — no errors, warnings addressed or documented
2. Lighthouse `/en` and `/fr`: **Performance ≥ 90 mobile**, Accessibility 100, Best Practices 100
3. Manual check at 375px width (iPhone SE) — classification stamps legible, case cards tappable, bottom nav functional
4. Manual check at 1440px width — no layout overflow, nav transparent scroll behavior works
5. `prefers-reduced-motion: reduce` — all animations disabled, content immediately visible
6. Screen reader check (VoiceOver/Mac): case file cards announce their title and classification; report sections announce their headings; diagram described with `aria-describedby`
7. **30-second trust test:** Show the homepage to someone unfamiliar. Can they answer: "What does this person do? What have they shipped? How do I contact them?" without scrolling below the case files.

---

## 17. Implementation order

This is the recommended task sequence. Each task is independently shippable and verifiable.

### Phase A — Navigation & Shell (foundation)

**A1:** Replace layout with minimal top nav + mobile bottom bar. Remove left-rail and colophon footer.
Files: `app/[locale]/layout.tsx`, `components/top-nav.tsx`, `components/bottom-mobile-nav.tsx`, `components/footer.tsx`

**A2:** Fix `not-found.tsx` crash (params undefined — use `getLocale()` instead). 
Files: `app/[locale]/not-found.tsx`

**A3:** Wire `<CommandPalette>` (⌘K) with cmdk.
Files: `components/command-palette.tsx`, `app/[locale]/layout.tsx`

### Phase B — Homepage (the referral surface)

**B1:** Build `<ClassificationStamp>` component.
Files: `components/classification-stamp.tsx`

**B2:** Build `<CaseFileCard>` using existing `MetalPanel` + new `ClassificationStamp`.
Files: `components/case-file-card.tsx`

**B3:** Rewrite homepage with new IA: identity block → 3 case file cards → essay teaser → contact line.
Files: `app/[locale]/page.tsx`, `messages/en.json`, `messages/fr.json`

### Phase C — Case report pages

**C1:** Build `<CaseReportHeader>` (classification header + serif title + FR/EN summary).
Files: `components/case-report-header.tsx`

**C2:** Build `<ScrollDiagram>` (SVG + IntersectionObserver-driven stroke drawing).
Files: `components/scroll-diagram.tsx`

**C3:** Build `<RedactedArtifact>` (image with blur regions + REDACTED overlays).
Files: `components/redacted-artifact.tsx`

**C4:** Rewrite `/work/[slug]` page with report structure (6 sections, scroll diagram, redacted artifact, prev/next metal rows).
Files: `app/[locale]/work/[slug]/page.tsx`

### Phase D — Secondary pages

**D1:** Rewrite `/work` index as file list with `<FileReferenceRow>` rows.
Files: `app/[locale]/work/page.tsx`, `components/file-reference-row.tsx`

**D2:** Rewrite `/about` as single-column operator record.
Files: `app/[locale]/about/page.tsx`, `messages/en.json`, `messages/fr.json`

**D3:** Rewrite `/contact` with numbered contact methods above form.
Files: `app/[locale]/contact/page.tsx`, `messages/en.json`, `messages/fr.json`

### Phase E — Polish

**E1:** Raise accent chroma in `globals.css` from 0.045 to 0.10. Verify contrast.
Files: `app/globals.css`

**E2:** Add magnetic lift animation to `CaseFileCard`.
Files: `components/case-file-card.tsx`, `app/globals.css`

**E3:** Wire section reveal animation in `/work/[slug]` (IntersectionObserver + CSS transitions).
Files: `components/case-report-section.tsx`, `app/globals.css`

**E4:** Accessibility pass — aria labels, focus rings, reduced motion, touch targets.
Files: All components from B–D

**E5:** Delete `/mock` route.
Files: `app/[locale]/mock/` (entire directory)

---

## 18. Decision log

| Decision | Rationale |
|---|---|
| Drop left rail | Took 128px of horizontal space, made site feel like an app, not a document. Top bar serves the same function in 56px. |
| Drop colophon footer | Nobody hires based on your font choice or framework. Footer is a contact surface, not a tech showcase. |
| Drop parallel FR/EN everywhere | Redundant for monolingual readers. Bilingualism is served by locale routing, not by showing everything twice. |
| Drop SystemMap on homepage | It was fabricated content with invented labels. Only show real artifacts. Diagrams live inside case reports, not on the homepage. |
| Drop "How I work" section | The case studies ARE the answer to "how do you work." A separate section double-counts and dilutes. |
| Keep MetalPanel for cards only | Rarity makes the material feel premium. Metal everywhere = metal nowhere. |
| Bottom nav on mobile | Document/reader app pattern. Reaches thumbs. Consistent with "dossier you read on your phone." |
| Scroll-drawn diagrams in case reports | Earns the scroll. Makes the system architecture feel alive without fake SaaS metrics. Only in case reports, not on homepage. |
| Redaction as trust signal | Confidentiality handled visually = the reader trusts you know what to protect. |
| File reference numbers as connective tissue | Ties homepage cards → /work list → case reports into one coherent filing system. |
