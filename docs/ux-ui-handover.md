# UX / UI handover — myportfolio (2026-05-27)

**Audience:** IA / UX / UI–focused agent (or designer–dev pair)  
**Goal:** Elevate the site to a **modern product-company standard** (Stripe / Apple / Google: clarity, restraint, accessibility, one visual language) while preserving strategic positioning from `docs/strategic-plan.md` and `docs/portfolio-plan.md`.

**Out of scope for this pass:** New case study content, Everest permission gates, production deploy, backend features beyond contact form.

---

## 1. Executive summary

### What works (keep)

- **Strategic positioning** is clear in copy: Product Systems Engineer, operational software, fintech + ERP proof, Dakar, bilingual.
- **Content depth** exists: 3 anchor MDX case studies + 4 supporting + 1 flagship essay.
- **Homepage ledger** is a distinctive pattern (accordion proof rows) — worth refining, not discarding blindly.
- **i18n** (EN/FR), theme toggle, command palette, MDX pipeline, and neo-ledger tokens on the homepage are in place.
- **About modal** (hero “Learn more”) is the right IA move vs a duplicate `/about` page.

### What blocks “modern / memorable / consistent”

| Issue | Impact |
|-------|--------|
| **Two+ visual systems** | Homepage uses `.site-ledger` + bridged tokens; inner routes use `globals.css` (`--color-*`). Writing/contact/forms still reference **undefined** legacy tokens (`--ink-1`, `--line-1`, `.shell`, `.display`). |
| **Homepage overload** | Six conceptual blocks on one scroll (Work, Systems, Join, Writing, Contact) with overlapping “what I build” stories. |
| **Join block** | Still reads like a second work list + availability claim; competes with Systems map and Work ledger. |
| **Interaction complexity** | Hover-peek accordion + GSAP + modal + command palette = high craft surface area, uneven a11y parity. |
| **No real media** | Crosshatch / “available on request” placeholders undermine Stripe-level polish. |
| **Nav fragmentation** | Desktop 5 items + mobile 5 slots; Systems only deep-links on home; About is modal-only (good) but undiscoverable. |

### Target experience (one sentence)

> A founder opens `/en`, understands **who you are**, **what shipped**, and **how to reach you** in under 30 seconds — with one visual language, no duplicate lists, and proof that feels as intentional as the prose.

---

## 2. North star & constraints (do not violate)

Read before designing:

| Doc | Use for |
|-----|---------|
| `docs/strategic-plan.md` | Positioning, anchor cases (Everest, Odoo, BocalBun), audience |
| `docs/portfolio-plan.md` | IA rules, what NOT to build, case study template |
| `AGENTS.md` | Tech stack, design bans (no glassmorphism, gradient text, skills grid) |
| `docs/launch-prerequisites.md` | CEO permissions, media gates |

**Design reference (quality bar, not mimicry):**

- **Stripe:** generous whitespace, one accent, typographic hierarchy, no decorative chrome, fast scan paths.
- **Apple:** few type sizes, confident headlines, photography when present, motion only when it explains.
- **Google Material (light touch):** clear focus rings, 44px targets, predictable elevation — not Material “cards everywhere.”

**Banned (from AGENTS + prior iteration):** glassmorphism defaults, gradient text, CF/dossier metaphor, rainbow per-project colors, fake metrics, `/skills`, `/services`, project grid of 20 cards.

**Foundation-lock (need explicit task to edit):** `app/layout.tsx`, `next.config.ts`, Tailwind/PostCSS config, `proxy.ts`.

---

## 3. Recommended target IA (simplify)

### Routes (keep)

```
/[locale]                 → Home (single scroll, fewer sections)
/[locale]/work            → Index: 3 featured + supporting list
/[locale]/work/[slug]     → Case study MDX
/[locale]/writing         → Essay list
/[locale]/writing/[slug]  → Essay MDX
/[locale]/contact         → Contact (canonical conversion)
/[locale]/about           → Redirect → /[locale]#about (opens modal)
```

### Home sections (proposed — reduce duplication)

| Order | Section | Purpose | Remove / merge |
|-------|---------|---------|----------------|
| 1 | **Hero** | Name + **one** positioning line + 2 CTAs (Work, Contact) + Learn more (modal) | Drop giant display-only name OR demote name to wordmark scale |
| 2 | **Proof** | Work ledger (3 rows only) — primary evidence | — |
| 3 | **Scope** | **Either** Systems map **or** one-line “domains” strip — not both at full weight | Merge Systems + Join into one “Where I operate” block OR move Systems to `/work` intro only |
| 4 | **Writing** | One essay teaser | — |
| 5 | **Contact** | Email + WhatsApp + link to `/contact` | Remove duplicate link row if footer already has them |

**Delete from homepage:** standalone Join block (§03) unless rewritten as a single availability line under hero.

### Navigation (proposed)

| Item | Behavior |
|------|----------|
| Work | `/[locale]/work` |
| Writing | `/[locale]/writing` |
| About | Opens modal (all pages) |
| Contact | `/[locale]/contact` |
| Systems | **Remove from top nav** — fold into Work index intro or home “Scope” once |

Mobile bottom nav: max 4 items — Work, Writing, About (modal), Contact. No separate Systems tab.

---

## 4. Page-by-page audit

### 4.1 Home (`/` — `HomeLedgerPage`)

| Section | Relevance | Issues | Modern fix direction |
|---------|-----------|--------|----------------------|
| Hero | High | Eyebrow repeats nav identity; `Aliou Wade.` dominates over value prop; 3 CTAs crowded | H1 = positioning sentence; name smaller; 2 CTAs max |
| Work ledger | High | Peek/hover not keyboard-obvious; empty media; proof typewriter gimmick | Real screenshots; simplify to click-to-expand only; respect `prefers-reduced-motion` |
| Systems map | Medium | Re-lists same projects as Work + links | Demote or merge; use diagram only if it adds structure not names |
| Join | Low | Duplicates Everest/Odoo; “two slots Q3 2026” is salesy | One availability sentence in hero or contact |
| Writing | High | Good | Keep teaser only |
| Contact | Medium | Duplicates `/contact` + footer | Single email prominent + one “Full contact form” link |

**User flow gaps:** No skip link; no “back to top”; long scroll without section progress.

### 4.2 Work index (`/work`)

| Aspect | Issues | Fix |
|--------|--------|-----|
| Visual | Uses `.site-ledger` but page chrome (nav) is globals | Unify page shell component |
| IA | Featured vs “More” is correct | Add 1-sentence intro: what “featured” means |
| Order | Supporting order fixed in `lib/work-index-order.ts` | OK |

### 4.3 Case study (`/work/[slug]`)

| Aspect | Issues | Fix |
|--------|--------|-----|
| Header | `CaseStudyHeader` uses globals tokens — OK | Add hero image slot when media exists |
| Body | `mdx-components.tsx` uses `--ink-1`, `--line-1` (**undefined**) | Map to `--color-ink-*` or shared prose class |
| Footer nav | Bordered “cards” for prev/next — inconsistent with ledger | Hairline list rows |
| Nav | Prev/next only among 3 featured | OK strategically |

### 4.4 Writing index (`/writing`)

| Aspect | Issues | Fix |
|--------|--------|-----|
| **Broken styling** | Uses `.shell`, `.display`, `.lede`, `.eyebrow`, `--ink-*`, `--line-*` — **not defined** in `globals.css` | Rewrite page to shared `PageHeader` + list using `--color-*` |
| **i18n bug** | `t("eyebrow")` called but **missing** from `WritingPage` in `messages/*.json` | Add key or remove |
| IA | Fine for 1 essay | When more essays ship, keep date + title list |

### 4.5 Writing article (`/writing/[slug]`)

Audit MDX prose styles same as case study — token debt in `mdx-components.tsx`.

### 4.6 Contact (`/contact`)

| Aspect | Issues | Fix |
|--------|--------|-----|
| Structure | Numbered 01/02 methods — good pattern | Align typography with work pages |
| Form | `contact-form.tsx` uses `--ink-1`, `--surface-raised` | Token migration |
| Duplication | Home + footer + here all show email | OK if contact is canonical |

### 4.7 About (modal)

| Aspect | Issues | Fix |
|--------|--------|-----|
| Pattern | Modal from hero — good | Focus trap: verify `aria-modal`, focus return on close, `aria-describedby` for long bio |
| Portrait | Placeholder dashed box | Replace with photo + subtle entrance when Aliou provides asset |
| Discoverability | Nav “About” opens modal — good | Optional: first visit hint near Learn more |

### 4.8 Global chrome

| Component | Issues | Fix |
|-----------|--------|-----|
| `TopNav` | 5 items crowded on sm; `AW` brand cryptic | Full name on sm+ or tooltip; reduce items |
| `BottomMobileNav` | 5 columns cramped | 4 items per §3 |
| `Footer` | Tagline added — good | Match link order: GitHub, LinkedIn, Email, WhatsApp |
| `CommandPalette` | Power-user feature; case slugs raw | Human labels from frontmatter |
| `ThemeToggle` / `LocaleSwitcher` | Token drift on writing page | Unify |

---

## 5. Copy & content duplication map

| Concept | Appears in | Recommendation |
|---------|------------|----------------|
| Product Systems Engineer | Hero eyebrow, Systems hub, About modal, Footer tagline | **Once** in hero; elsewhere shorten |
| Everest / Odoo / BocalBun | Work ledger, Systems map, Join block, case studies | **Only** in Work ledger + case study pages |
| “Operational systems…” | Hero, Metadata, Footer, Contact subtitle | Pick **one** canonical sentence in `messages` — `HomePage.positioning` |
| Contact email / social | Home contact, Footer, Contact page, About (none) | Footer + Contact canonical; home = one link |
| Availability Q3 2026 | Join, About currently, Contact stamp | **Contact page + About modal only** |
| ERGOBIT / publishing pending | Join Odoo blurb | Move to Odoo case study only |

**Confusing strings to rewrite (UX writer):**

- `workTitle`: “Three systems that shipped.” — BocalBun is retrospective/archived; consider “Three systems that define how I work.”
- `contactTitle`: “What is broken operationally?” — memorable but polarizing; A/B vs “Tell me what you're building.”
- `SystemsMap.lead` — long; cut to one line.
- `JoinBlock.title`: “Collaborate or follow along.” — vague; remove section.

---

## 6. Design system debt (technical)

### Single source of truth (P0)

Create **`docs/DESIGN.md`** (or extend) and implement in `app/globals.css` only:

```text
--color-canvas, --color-ink-*, --color-accent, --color-border
--font-sans, --font-serif, --font-mono
--space-page, --space-section (optional)
```

Then:

1. **Remove** duplicate `--n-*` definitions in `ledger.css` OR make `.site-ledger` a thin alias layer only (already bridged — extend to all routes).
2. **Delete** unused classes: `.metal-panel`, `.magnetic-lift`, `.brushed-texture`, `.diagram-line*` if confirmed unused.
3. **Migrate** all components off `--ink-1`, `--line-1`, `--surface-raised`, `.shell`, `.display`.

### Files with legacy token references (grep targets)

- `app/[locale]/writing/page.tsx`
- `components/mdx-components.tsx`
- `components/contact-form.tsx`
- `components/locale-switcher.tsx`
- `components/theme-toggle.tsx`

### Shared layout primitives (P1)

Introduce (names indicative):

- `PageShell` — max-width, padding, `site-ledger` or global class once unified
- `PageHeader` — eyebrow, title, lede
- `SectionDivider` — hairline
- `Prose` — MDX body

Homepage-only: `WorkLedger`, `SystemsMapSection` (if kept), `AboutModal`.

---

## 7. Accessibility checklist (current gaps)

| WCAG area | Status | Action |
|-----------|--------|--------|
| Focus visible | Partial | Globals have `:focus-visible`; verify modal, accordion, cmdk |
| Keyboard | Partial | Work ledger peek on focus added; accordion needs roving tabindex / arrow keys |
| Modal | Partial | Add focus trap lib or manual; restore focus to “Learn more” on close |
| Color contrast | Unknown | Audit `--color-ink-secondary` on `--color-canvas` (target 4.5:1) |
| Motion | Partial | `prefers-reduced-motion` for GSAP; disable typewriter |
| Landmarks | Partial | Ensure `<main>`, nav labels, one `<h1>` per page |
| Skip link | Missing | Add “Skip to content” |
| Link purpose | Partial | “AW” brand needs accessible name (has `brandAriaLabel` on desktop — verify mobile) |
| Language | OK | `lang` on `<html>` via root layout |

**Testing:** VoiceOver (macOS), Safari iOS, Chrome Android; axe DevTools on each route.

---

## 8. User flows to validate after redesign

```mermaid
flowchart TD
  A[Landing /en] --> B{Goal?}
  B -->|See proof| C[Expand work row]
  C --> D[Case study MDX]
  D --> E[Adjacent case / back to work]
  B -->|Know person| F[Learn more modal]
  F --> G[Close modal]
  B -->|Hire| H[/contact form]
  B -->|Read thinking| I[Writing teaser]
  I --> J[Essay MDX]
  B -->|FR| K[Locale switch]
  K --> A
```

**Critical paths (must be frictionless):**

1. Home → Everest case study → back  
2. Home → Contact form → success state  
3. Any page → About modal → ESC close  
4. `/fr` parity (no English titles in work list)  
5. Mobile: bottom nav → Work → case study (no horizontal overflow)

---

## 9. Prioritized backlog for UX/UI agent

### P0 — Consistency & correctness (1–2 days)

- [ ] Unify tokens; fix Writing page + MDX + contact form broken CSS vars  
- [ ] Add missing `WritingPage.eyebrow` or remove usage  
- [ ] One `PageHeader` / `PageShell` used on work, writing, contact  
- [ ] Accessibility pass: modal focus trap, skip link, contrast spot-check  
- [ ] Remove or collapse Join block; dedupe copy per §5  

### P1 — Modern visual language (2–4 days)

- [ ] Hero hierarchy redesign (positioning-led)  
- [ ] Work ledger simplification (media slots OR honest “under NDA” treatment with consistent art direction)  
- [ ] Nav simplification (4 items; Systems demoted)  
- [ ] Case study prev/next → hairline pattern  
- [ ] Command palette labels from i18n titles  
- [ ] About modal polish (photo slot, motion when asset ready)  

### P2 — Delight & memorability (optional, after media)

- [ ] Redacted screenshots + 1 architecture diagram per anchor case  
- [ ] Subtle scroll-linked section progress (home only)  
- [ ] View Transitions on case study navigation (already partially wired)  
- [ ] OG image template per case study  

### P3 — Do not do yet

- Fourth anchor case study  
- `/systems` dedicated route  
- WebGL / heavy animation  
- Blog with many posts  

---

## 10. Suggested deliverables from UX agent

1. **Figma or concise wireframes** — Home (simplified), Work index, Case study, Contact (mobile + desktop).  
2. **`docs/DESIGN.md`** — tokens, type scale, spacing, component specs.  
3. **Copy deck** — single table EN/FR for hero, section titles, CTAs (no duplication).  
4. **Implementation PR(s)** — P0 first, one visual system, screenshot before/after.  
5. **Short audit note** — Lighthouse accessibility + one founder 30-second test script.

---

## 11. Key file map for implementer

| Area | Files |
|------|--------|
| Home | `components/home-ledger-page.tsx`, `work-ledger.tsx`, `systems-map-section.tsx`, `join-block.tsx`, `app/ledger.css` |
| About | `components/about-modal.tsx`, `about-provider.tsx`, `messages/*/AboutPage` |
| Nav | `top-nav.tsx`, `bottom-mobile-nav.tsx`, `command-palette.tsx` |
| Work | `app/[locale]/work/page.tsx`, `work/[slug]/page.tsx`, `case-study-header.tsx` |
| Writing | `app/[locale]/writing/**`, `mdx-components.tsx` |
| Contact | `app/[locale]/contact/page.tsx`, `contact-form.tsx` |
| Tokens | `app/globals.css`, `app/ledger.css` |
| Copy | `messages/en.json`, `messages/fr.json` |
| Content | `content/work/**`, `content/writing/**` |

---

## 12. Open questions for Aliou (block UX until answered)

1. **Hero:** Name-dominant vs positioning-dominant?  
2. **Systems map:** Keep on home, move to `/work`, or remove?  
3. **Join block:** Delete entirely or one-line availability?  
4. **Contact headline:** Keep provocative “What is broken operationally?” or neutral?  
5. **Media:** Which case studies can show redacted UI (Everest permission)?  
6. **Portrait:** Timeline for photo in About modal?  
7. **Target reference:** Stripe-like minimal vs slightly warmer “operator dossier” (current ledger)?

---

## 13. How to brief the next agent (paste-ready)

```text
You are the UX/UI agent for myportfolio (Next.js 16, Tailwind v4, next-intl).

Read first:
- docs/ux-ui-handover.md (this file)
- docs/strategic-plan.md § positioning
- docs/portfolio-plan.md § what NOT to build
- AGENTS.md design bans

Mission:
1. P0: One design system in globals.css; fix broken Writing/MDX/contact tokens.
2. Simplify homepage IA per §3 (remove Join duplication, demote Systems).
3. Stripe/Apple bar: whitespace, hierarchy, a11y, no fake UI.
4. Do not add routes/skills/CMS; do not edit foundation-lock files without permission.

Verify: bun run build && bun run lint
Test: /en, /en/work, /en/work/everest-finance, /en/writing, /en/contact, /fr parity, mobile nav, About modal keyboard.

Deliver: DESIGN.md + implemented P0/P1 + before/after notes.
```

---

## 14. Current git state note

Structural/content work landed in recent commits (`systems map`, `about modal`, token bridge, nav changes). **Uncommitted UX fixes may exist** in the working tree — run `git status` before the UX agent branches.

---

*End of handover. The product is structurally shippable; the next leap is visual/system coherence and information diet, not more features.*
