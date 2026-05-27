# Portfolio Rebuild Plan (2026)

Companion document to [`strategic-plan.md`](./strategic-plan.md).

Use this file for **how to build, structure, write, and ship** the portfolio.
Use `strategic-plan.md` for **career direction, network leverage, OSS, and commercial positioning**.

---

## 1. Purpose

The portfolio is not a project gallery.

It is a **conversion tool** that should:

1. Make a founder/CTO trust you with operational systems within 30 seconds
2. Give your network something credible to share (ERGOBIT, Everest, education, business owners)
3. Work in French and English without feeling like a translation afterthought
4. Survive LinkedIn/X sharing without leaking confidential client details

If a page or feature does not serve one of those four goals, cut it.

---

## 2. Relationship to Strategic Plan

| Strategic plan says | Portfolio plan does |
|---|---|
| Everest is the active commercial anchor | Lead with Everest case study (anonymized if needed) |
| Odoo Testing Toolkit stays top-tier OSS | Dedicated `/work` case study in v1; optional **top-level `/opensource`** in v2+ (see §21) |
| BocalBun is frozen, not abandoned | “Why I stopped” retrospective — flagship writing piece |
| Dakar Sport Shop is proof, not a flagship | Optional lightweight case study, not homepage hero |
| Network activation before more building | Contact + shareable case studies for referrals |
| Stop overbuilding | 2-week MVP launch, iterate in public |

**Do not start the portfolio until you have:**

- [x] A one-sentence positioning statement (§3 — in `messages/en.json` + `fr.json`)
- [ ] Permission boundaries for Everest (what can be named, what must be anonymized) — see [launch-prerequisites.md](./launch-prerequisites.md)
- [ ] ERGOBIT conversation outcome for Odoo Testing Toolkit (publish solo vs co-brand) — see [launch-prerequisites.md](./launch-prerequisites.md)

---

## 3. Positioning (copy to use everywhere)

### Primary identity

**Product Systems Engineer** — operational software for fintechs and operations-heavy businesses.

### One-sentence hero (EN)

> I build operational software systems for fintechs and operations-heavy businesses — internal tools, CRMs, admin panels, and domain-specific workflows — from Dakar, bilingual FR/EN.

### One-sentence hero (FR)

> Je conçois des systèmes logiciels opérationnels pour la fintech et les entreprises à forte charge opérationnelle — outils internes, CRM, back-offices et workflows métier — depuis Dakar, bilingue FR/EN.

### Secondary line (optional, under hero)

> Currently consolidating operational systems at a West African finance company. Previously contributed to Odoo 18 ERP localization and acceptance testing.

### What you are NOT positioning as

- Freelance “web developer”
- React/Next.js specialist for hire
- Generic agency
- “I built a Bun framework” (BocalBun is a case study about judgment, not the headline)

---

## 4. Audience

| Reader | They need to see | Kill the deal if |
|---|---|---|
| **Founder / CTO** (remote or local) | End-to-end ownership, real shipped systems, architectural judgment | Tutorial projects, skills grid, buzzwords |
| **Network referral** (Everest CEO, teacher, Mansour, ERGOBIT) | “This person gets our world” + easy link to share | English-only, no FR, looks like a student portfolio |
| **Odoo / ERP professional** | Testing toolkit, localization depth, team-scale work | No OSS link, no Odoo mention |

---

## 5. Information Architecture

Case-study-first. Not project-grid-first.

```
/                      Homepage: hero + work ledger + systems map + join + writing + about + contact
/work                  Featured trio + supporting case studies (MDX index)
/work/[slug]           Long-form case study (MDX, v2 template)
/writing               Technical essays (start with 1, grow to 10)
/writing/[slug]        Single essay
/about                 Operator record, first person
/contact               Form + email + WhatsApp
```

`/systems` and `/opensource` are **not** v1 top-level routes. The **ecosystem map ships as homepage §02** (`#systems`, `SystemsMapSection`). OSS projects live inside `/work` until a dedicated hub is justified.

### Do NOT build (v1)

- `/projects` grid with 20 cards
- `/skills` page with progress bars
- `/services` page (too agency-template)
- `/blog` (use `/writing`)
- Sanity CMS (you are the only author)
- Interactive 3D, glassmorphism hero, animated backgrounds

### Locale routing

- **v1:** `next-intl` with `/en/...` and `/fr/...` (or locale prefix on all routes)
- **v1 content:** Same structure, translated case study summaries; full MDX translation for homepage + about + top 3 case studies
- **Later:** Consider audience-split content (FR = West Africa clients, EN = remote/international) only if analytics justify it

---

## 6. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 16 App Router** (Turbopack default) | Already initialized; SSG/ISR for content |
| Request interception | **`proxy.ts`** (not `middleware.ts`) | Next.js 16 convention; Node runtime only |
| Content | **MDX in repo** (`content/work`, `content/writing`) | Version with git; write in Cursor; no CMS overhead |
| Styling | Tailwind CSS v4 + shadcn/ui | Consistent with dakar-sport-shop, eduplan |
| i18n | next-intl (wire into `proxy.ts` + `i18n/request.ts`) | Real bilingual site |
| Hosting | Vercel (or Cloudflare Pages) | Preview deploys per PR |
| Analytics | Plausible or Vercel Analytics | No cookie banner circus |
| Contact | Resend + Route Handler | Already used elsewhere |
| Diagrams | Mermaid in MDX or Excalidraw PNG exports | No custom diagram builder in v1 |

### Next.js 16 reminders

- Dynamic params are async: `const { locale, slug } = await props.params`
- `cookies()`, `headers()`, `draftMode()` must be awaited
- `sitemap` and OG image generators receive `id` as a `Promise`
- `next lint` is removed — use `npm run lint`; `next build` does not lint
- Use top-level `turbopack` in `next.config.ts` (not `experimental.turbopack`)
- Run `npx next typegen` after adding routes to keep `PageProps<'/…'>` accurate

### Repo decision

- **New repo** (recommended): `aliou-wade-portfolio` or `portfolio-v2`
- **Do not** extend `~/Documents/portfolio` (Sanity + half-finished `.next` — wrong foundation)

### Folder structure (suggested)

```text
app/
  [locale]/
    page.tsx
    work/
    writing/
    about/
    contact/
proxy.ts
i18n/
  request.ts
content/
  work/
    everest-finance/{en,fr}.mdx
    odoo-testing-toolkit/{en,fr}.mdx
    bocalbun-retrospective/{en,fr}.mdx
    eduplan/{en,fr}.mdx
    mansour-holding/{en,fr}.mdx
    ndouckmane-transit/{en,fr}.mdx
    dakar-sport-shop/{en,fr}.mdx
  writing/
    why-systems-over-frameworks/{en,fr}.mdx
components/
  home-ledger-page.tsx
  work-ledger.tsx
  systems-map-section.tsx
  join-block.tsx
  case-study-header.tsx
  locale-switcher.tsx
  mdx-components.tsx
app/
  ledger.css
public/
  images/case-studies/
messages/
  en.json
  fr.json
```

---

## 7. Visual Direction

**Shipped feel:** Neo-ledger homepage — editorial hero, accordion work rows, OKLCH accent (`app/ledger.css`), spectral atmosphere, restrained motion (GSAP + `prefers-reduced-motion`).

**Rules:**

- Sans + mono + serif (Fraunces) via root layout; ledger scoped under `.site-ledger`
- Single accent hue; green for status only
- Real UI screenshots (blur/redact client data) — placeholders until launch gates clear
- Architecture diagrams > abstract hero illustrations
- Theme toggle: light default, dark supported
- **Avoid:** CF dossier metaphor, glassmorphism defaults, gradient text, rainbow per-project colors

---

## 8. Content Plan

### Launch MVP (ship within 2 weeks)

| Asset | Slug | Role on site |
|---|---|---|
| Homepage | `/` | Hero + work ledger + systems map + join + essay + about + contact |
| Everest case study | `everest-finance` | **#1** — active commercial proof (homepage ledger) |
| Odoo Testing Toolkit | `odoo-testing-toolkit` | **#2** — differentiation + OSS |
| BocalBun retrospective | `bocalbun-retrospective` | **#3** — judgment + systems thinking |
| Essay | `why-systems-over-frameworks` | Flagship writing; cross-links BocalBun |
| About | `/about` | Operator record |
| Contact | `/contact` | Email, WhatsApp, form (Resend) |
| Systems map | `#systems` on homepage | Ecosystem graph; links to work where published |
| Supporting work | `eduplan`, `mansour-holding`, `ndouckmane-transit`, `dakar-sport-shop` | `/work` index only, not homepage trio |

### Month 2 additions

| Asset | Notes |
|---|---|
| Case study media | Screenshots + diagrams per `public/images/case-studies/` |
| EduPlan pilot narrative | Deepen after school-network conversation |
| Full `/systems` route | Promote homepage block to dedicated URL when diagram warrants it |
| 2 more essays | From strategic plan topic list |

### Month 3+ (gated by conversations)

| Asset | Gate |
|---|---|
| Prescriptos | Revive conversation with client first |
| Mansour Holding | Discovery conversation first |
| Gerpain / bakery | Real operator pain validated |
| Everest public product URLs | CEO permission |

### Never put on portfolio (v1)

- `shoot_words`, `deno-fresh`, `xamtuai` (unless XamtuAI gets a real product push)
- Anything in `drafts/` except as private labs
- Tutorial README boilerplate as “project description”
- Client logos without permission

---

## 9. Case Study Template

Every `/work/[slug]` page should follow this structure (EN + FR frontmatter).

```yaml
---
title: ""
titleFr: ""
summary: ""
summaryFr: ""
role: ""          # e.g. Solo technical operator
domain: ""        # e.g. Fintech operations
stack: []
date: "2026-05"
featured: true
confidential: true  # if anonymized
---
```

### Sections (in order)

1. **Context** — Who, what business problem, constraints (time, team, regulation)
2. **Problem** — What was broken or missing operationally (not “they needed a website”)
3. **Approach** — Architecture choices and tradeoffs (bullet list OK)
4. **System diagram** — One diagram (Mermaid or image)
5. **What shipped** — Concrete deliverables (CRM, app, test suites, modules)
6. **Technical depth** — 2–3 paragraphs only; link to `/writing` for long form
7. **Outcome** — Honest: deployed / in progress / paused and why
8. **Lessons** — What you’d do differently (especially for BocalBun)

**Length target:** 1,200–2,500 words for anchor cases; 600–900 for supporting cases.

---

## 10. Pre-Writing Checklist (per case study)

### Everest

- [ ] List deliverables: website, internal CRM, Sama Naffa app
- [ ] Confirm anonymization rules with CEO
- [ ] Collect 3–5 screenshots (redacted)
- [ ] One architecture diagram (boxes: public site, CRM, app, data stores)

### Odoo Acceptance Testing Toolkit

- [ ] Confirm with ERGOBIT CEO: publish path, attribution, license
- [ ] Screenshot: Robot report, suite structure, selector guidelines doc
- [ ] Link to GitHub repo (public or org repo)
- [ ] Metrics if safe: 39 tests, 9 suites, smoke vs full validation status

### BocalBun retrospective

- [ ] Link to frozen repo (public or private with public README)
- [ ] Diagram: entity engine, RLS, hooks, audit (from AGENTS.md)
- [ ] Explicit “why stopped” section — tie to strategic plan
- [ ] No apology tone; judgment tone

### Dakar Sport Shop (optional, month 2)

- [ ] Live URL: dakarsport.net
- [ ] Focus: e-commerce stack, R2 migration, admin Excel upload — not brand story
- [ ] One paragraph on “low-budget client, high execution discipline” if you want honesty

---

## 11. Homepage Wireframe (shipped IA)

```text
[Nav: Work | Writing | About | Contact | EN/FR | theme]

[01 Hero]
  Display name + role lines (EN/FR via next-intl)
  CTA: #work | /contact

[02 Work — #work]
  WorkLedger accordion: everest-finance | odoo-testing-toolkit | bocalbun-retrospective
  Expand → proof, stack, link to /work/[slug]

[03 Systems — #systems]
  Hub: Product Systems Engineer
  Four spokes: Fintech | ERP | Commerce | Education
  Linked nodes → /work/[slug] where case study exists

[04 Open — JoinBlock]
  Static “request seat” placeholders (no API v1)

[05 Writing — #writing]
  Latest essay teaser → /writing/why-systems-over-frameworks

[06 About — #about]
  Short operator copy + link to /about

[07 Contact — #contact]
  Email, LinkedIn, GitHub, WhatsApp + /contact CTA

[Footer: GitHub | LinkedIn | Email | WhatsApp]
```

---

## 12. `/systems` Page (ecosystem map)

**v1 (done):** Homepage block `SystemsMapSection` at `#systems` — four-column ledger layout, hub + spoke labels, case study links. Data: `lib/systems-map-data.ts`; copy: `messages` namespace `SystemsMap`.

**v2+:** Dedicated `/[locale]/systems` route when the diagram deserves its own URL (reuse same data component).

Current nodes (2026-05):

```text
                    [Product Systems Engineer]
                              |
     +------------+------------+------------+------------+
     | Fintech    | ERP/QA     | Commerce   | Education  |
     | Everest    | Odoo kit   | Dakar Sport| EduPlan    |
     | Acct open  | ERGOBIT    | Ndouckmane | Hirondelles|
     | Sama Naffa | BocalBun   | Mansour    |            |
```

No interactive graph library; CSS ledger grid only.

---

## 13. `/opensource` Page — **v2+**

Deferred from v1: OSS is covered by `/work` entries and links from case studies until multiple repos justify a dedicated hub.

| Project | Status | CTA |
|---|---|---|
| Odoo 18 Acceptance Testing Kit | Publish after ERGOBIT OK | GitHub + README excerpt |
| agent-ready-repo | Phase 3 strategic plan | “Coming soon” or link if shipped |
| manifest-drift-check | Later | Optional stub |

Each entry: 2-sentence pitch, stack badges, link, “used in” case study link.

---

## 14. SEO & Sharing

- `metadata` per page: title, description, `og:image` (generate one default OG template)
- `sitemap.ts` + `robots.ts` (copy pattern from dakar-sport-shop)
- Canonical URLs on Vercel production domain
- LinkedIn launch post (FR + EN versions) — link to homepage + BocalBun essay

---

## 15. Build Schedule

### Week 1 — Foundation + narrative

| Day | Task | Done |
|---|---|---|
| 1 | Finalize positioning sentences (EN/FR). Create new repo. Next.js + Tailwind + next-intl + MDX. Deploy “coming soon” with hero copy. | [ ] |
| 2 | MDX case study template + layout for `/work/[slug]`. Homepage shell. | [ ] |
| 3 | Write + publish BocalBun retrospective MDX (+ essay if separate). | [ ] |
| 4 | Write Everest case study (anonymized). Gather screenshots. | [ ] |
| 5 | Write Odoo Testing Toolkit case study. Confirm ERGOBIT publish path. | [ ] |
| 6 | Homepage: 3 cards, about draft, contact form (Resend). | [ ] |
| 7 | Polish, lighthouse pass, ship v0.1 to production domain. | [ ] |

### Week 2 — Bilingual + launch

| Day | Task | Done |
|---|---|---|
| 8 | FR translations: homepage, about, summaries for 3 case studies. | [ ] |
| 9 | Expand homepage **systems** block (or prep v2 `/systems`); keep full `/opensource` + nav item for **v2+** unless scope allows earlier. | [x] |
| 10 | OG images, favicon, about page final, WhatsApp link. | [ ] |
| 11 | Proofread. Test mobile. Fix i18n switcher. | [ ] |
| 12 | LinkedIn + X launch post. Send link to Everest CEO, ERGOBIT CEO, teacher. | [ ] |
| 13–14 | Buffer: fixes from feedback only — **no new features**. | [ ] |

---

## 16. Launch Checklist

- [ ] Production URL live (custom domain if ready)
- [ ] All 3 anchor case studies published
- [ ] At least 1 essay on `/writing`
- [ ] FR + EN on homepage and about
- [ ] Contact form delivers to your inbox
- [ ] GitHub linked; OSS repo public (if ERGOBIT approved)
- [ ] No confidential client data in screenshots
- [ ] Google/Lighthouse: reasonable performance (no 3D assets)
- [ ] Shared with 3 network contacts for feedback

---

## 17. Anti-Patterns (read before every coding session)

1. **Do not add a fourth anchor case study before the first three are live.**
2. **Do not integrate Sanity “because it might scale”** — you are the only author.
3. **Do not redesign the homepage more than once in week 1.**
4. **Do not list 15 projects** — depth beats breadth.
5. **Do not write about in third person.**
6. **If build time > 2 weeks, cut scope, not deadline.**

---

## 18. Success Metrics (portfolio-specific)

Align with `strategic-plan.md` 6-month goals:

| Metric | Target (3 months post-launch) |
|---|---|
| Portfolio live with custom domain | Yes |
| Anchor case studies | 3 minimum |
| Essays on `/writing` | 3+ |
| Inbound messages citing portfolio | Track qualitatively |
| Referrals from network (“I sent them your site”) | ≥ 2 |
| Time spent on portfolio build after launch | < 20% of dev time |

---

## 19. Open Decisions (fill in as you go)

| Decision | Options | Chosen |
|---|---|---|
| Production domain | `aliouwade.com` / `aliou.dev` / Vercel default | `aliouwade.com` (code default) — confirm DNS |
| Everest naming | Full name / “West African fintech” / anonymized | Full name in MDX — **confirm with CEO** |
| Odoo toolkit repo | Personal GitHub / ERGOBIT org / joint | Pending ERGOBIT conversation |
| Calendly vs email-only contact | Both / email only | Email + WhatsApp v1 |
| Include Dakar Sport Shop in v1 | Yes / No (recommend: No, month 2) | **No** |

---

## 20. Quick Reference — File Pairing

| Question | Read |
|---|---|
| What should my career focus on? | `strategic-plan.md` |
| What pages should the site have? | This doc §5 |
| Deferred / future work? | This doc §21 |
| What do I write first? | This doc §8, §15 |
| What case study structure? | This doc §9 |
| What not to build? | This doc §5, §17 |
| Who do I send the link to first? | `strategic-plan.md` Phase 1.5 |

---

## 21. Future versions (roadmap)

Use this backlog when v1 is live and stable. **Do not** expand scope into these tracks until the three anchor case studies ship and bilingual surfaces are credible.

### v1.1 — polish after launch

- Per-page OG images beyond the default template
- Case study tagging or simple filters on `/work` (domain, stack)
- Newsletter or RSS for `/writing` (only if posting cadence stays real)
- Calendly (or booking link) on `/contact` if inbound justifies it
- Performance pass: lazy MDX bundles, image audit, lighthouse targets

### v2 — information architecture expansion

Promote deferred top-level destinations when each earns a permanent URL:

- **`/systems`** — full ecosystem map page (reuse §12 diagram; deepen copy as anchors grow)
- **`/opensource`** — hub for Odoo toolkit, agent-ready repo, manifest-drift tooling (reuse §13)
- **Nav update** — add `Systems` and/or `Open source` only if both pages exist and nav stays under ~6 items
- **Fourth+ anchor case studies** — EduPlan/Les Hirondelles, Dakar Sport Shop as supporting proof, gated by conversations in `strategic-plan.md`

### v2.5–v3 — content and audience splitting (analytics-gated)

- Audience-split tuning (e.g. FR emphasis for WA networks vs EN for remote CTOs): only after traffic or referral data proves it matters
- Deeper bilingual MDX parity (every essay translated, not only summaries)
- Optional `/now`-style strip or footer “currently” line (still avoid one-off hobby pages unless they tie to positioning)

### Product / infra (orthogonal to UX version)

Tracked mainly in **`strategic-plan.md`**, but affects the site when ready:

- Public Odoo Acceptance Testing Kit repo + README embeds from `/opensource`
- Deployed demos (EduPlan, sport shop, Everest-facing surfaces where permitted)
- Optional migration to MDX authoring workflow improvements (esbuild plugin bumps, excerpt generation), still **no** headless CMS unless author count changes

---

*Last updated: May 2026 — revise when ERGOBIT publish path and Everest anonymization rules are confirmed.*
