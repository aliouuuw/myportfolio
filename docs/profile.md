# Aliou Wade — profile (living reference)

**Last updated:** June 2026  
**Purpose:** Current facts about who I am, what I ship, and what I am working on now. Use this for portfolio copy, agent context, and network intros. For build/IA strategy see `portfolio-plan.md`; for career direction see `strategic-plan.md`.

---

## Identity

| Field | Value |
|-------|--------|
| **Name** | Aliou Wade |
| **Role** | Product Systems Engineer |
| **Current engagement** | Senior technical operator · Everest Finance (solo) |
| **Location** | Dakar, Senegal (WAT) |
| **Arc** | Ottawa → Dakar |
| **Languages** | French / English — bilingual site and client work |
| **Availability** | Selective — two client slots from Q3 2026 |
| **Best fit** | Founders and teams replacing spreadsheet operations with focused internal software |

**Positioning (one line):** I build operational software for fintechs and operations-heavy businesses — internal tools, workflows, ERP modules, and domain-specific systems — from Dakar, bilingual FR/EN.

**What I am not selling:** generic web dev, React/Next.js for hire, agency retainers, or “I built a framework” as the headline.

---

## Contact

| Channel | |
|---------|--|
| Email | wadealiou00@gmail.com |
| WhatsApp | +221 777 228 845 · [wa.me/221777228845](https://wa.me/221777228845) |
| LinkedIn | [linkedin.com/in/aliouuuw](https://www.linkedin.com/in/aliouuuw) |
| GitHub | [github.com/aliouuuw](https://github.com/aliouuuw) |

I reply within 48h, Monday–Friday.

---

## What I am doing now (2025 → present)

### Everest Finance — solo technical operator

Senegalese SGI in the UEMOA zone. No engineering team — I own the full stack across **three products**:

| Product | Status | Stack (summary) |
|---------|--------|-----------------|
| **Public site + CMS** | Live | Vite, TanStack Router, Convex (publications, media, Everest Profiler leads) |
| **Sama Naffa** — savings app + admin | Production | Next.js 16, Drizzle, Neon Postgres, Didit KYC, Intouch deposits |
| **Formos** — internal campaign capture | Demo (not deployed) | TanStack Start, oRPC, Drizzle, Inngest, Better Auth |

**Operating model:** Right-sized backend per surface (Convex for editorial speed; Postgres where money and KYC matter). Incremental delivery — site/CMS first, savings ops next, Formos for internal intake without blocking the roadmap.

**Public URLs (staging/dev as of June 2026):**

- Site: [dev-everest-new.vercel.app](https://dev-everest-new.vercel.app/)
- Sama Naffa: [dev.samanaffa.com](https://dev.samanaffa.com/)

**Case study:** `/work/everest-finance` — includes surface proof videos on the operator board.

**Publication gate:** CEO sign-off still needed on naming, screenshots, and redaction rules before full public launch.

---

## Recent professional work

### ERGOBIT — software engineer (2024 → Q1 2026)

Odoo integrator in Dakar. Two tracks:

1. **Client modules** — e.g. accounting automation for **Africa GreenTec** (~80% less manual entry, 10,000+ records/day in production).
2. **Odoo 18 migrations** — exposed lack of acceptance-test discipline; I built the **Odoo 18 Acceptance Testing Kit** (Robot Framework + Playwright, Azure DevOps CI).

**Toolkit outcomes:** 39 tests, 9 suites; smoke under ~2 minutes; validation cycle from ~1 day to under 15 minutes.

**Case study:** `/work/odoo-testing-toolkit`  
**Publication gate:** ERGOBIT conversation on solo vs co-brand publish path and public GitHub URL.

### BankingBook Analytics — contract engineer (2023 → Q2 2024)

Open-banking API layer for cloud-native ALM in UEMOA; bilingual product surfaces; web and corporate mail migration to [bbafintech.com](https://bbafintech.com). Contract engineering — APIs and domain cutover, not a marketing-site project.

### Purolator Digital Lab — COOP + part-time contractor (2023 · Ottawa)

University of Ottawa COOP at Purolator Digital Lab:

- Azure DevOps CI/CD across **three** logistics codebases
- Power Automate approval tooling
- Package-sorter SDK integration for warehouse operations

Proof type on portfolio: **COOP report** (18-page dossier), not a live product URL.

### Earlier employers

| Period | Employer | Proof line |
|--------|----------|------------|
| 2022 | Orange Digital Lab | React Native fitness community app — 1,000+ members (COOP report) |
| 2019 | ITech Solutions Afrique | Azure geolocation IoT; planning rework cut system costs ~20% (internship report) |

---

## Anchor portfolio cases (depth, not breadth)

These three are the conversion proof on the site homepage (operator board):

| # | Case | Claim it answers |
|---|------|------------------|
| 1 | **Everest Finance** | Can I own and ship a real fintech stack solo? |
| 2 | **Odoo 18 Acceptance Testing Kit** | Have I done real ERP work, not tutorials? |
| 3 | **BocalBun retrospective** | Do I know when to stop? |

**Flagship essay:** [Why I stopped building frameworks and started shipping systems](/writing/why-systems-over-frameworks) — cross-links BocalBun.

**BocalBun (2022 → stopped):** Bun-native toolkit with entity engine, RLS, audit trails. Frozen with zero external users; lessons applied to Everest repo structure and agent-ready conventions. Repo: [github.com/aliouuuw/bocalbun](https://github.com/aliouuuw/bocalbun).

---

## Secondary proof (domain panels on homepage)

| Domain tab | Secondary case | Proof type |
|------------|----------------|------------|
| Fintech | BankingBook Analytics | Live migrated site + API narrative |
| ERP / QA | Africa GreenTec accounting | Module work → linked from Odoo case study |
| Systems | Purolator Digital Lab | COOP report (doc mock) |

---

## Client & side builds (work record)

Supporting evidence — not homepage anchors:

| Client | Domain | Scope |
|--------|--------|--------|
| Ndouckmane Transit | Logistics | Freight ops: shipments, customs, dashboards (MVP in progress) |
| EduPlan | Education | K-12: courses, schedule, grading |
| Gerpain | Operations | Multi-bakery: inventory, deliveries, RBAC |
| Mansour Motors | Automotive | Dealership site + vehicle inventory — [mansourmotors.sn](https://mansourmotors.sn) |
| Mamebimo | Marketplace | Home-services booking (Everest-adjacent product) — [mamebimo.com](https://mamebimo.com) |
| Asaaman | Drone / AI | Semantic video search — [asaaman.com](https://asaaman.com) |
| Les Hirondelles | Institution | School site + Convex CMS |
| Dakar Sport | Retail | Retail and community surfaces |

Case study MDX exists for several of these under `content/work/`; not all are featured on the homepage trio.

---

## How I work

1. **Workflow first** — process, people, and handoffs before stack choice.
2. **Ship small, ship real** — production increments over slide decks.
3. **Leave it runnable** — docs, admin tools, logs, edge cases.

**Experience:** ~six years across fintech, ERP, logistics, mobile, IoT, and education.

**Education:**

- B.Sc. Software Engineering — University of Ottawa
- B.Sc. Computer Science — DAUST

**Certifications:** Odoo 18 Functional · Meta Front-End Developer Professional · Datacamp Python Data Science

**Stack I reach for often:** TypeScript, Python, Next.js, PostgreSQL, Convex, Odoo 18, Robot Framework, Playwright, Azure DevOps, Vite, TanStack (Router / Start), Drizzle, React Native

**Off the clock:** Competitive chess (~2043 bullet online) — same discipline as shipping under deadline.

---

## This portfolio site (June 2026)

| Item | Detail |
|------|--------|
| **Framework** | Astro 5 — static pages + selective server routes (contact API) |
| **Homepage** | Operator board — domain tabs, proof stage, comms strip, expandable work record |
| **Content** | MDX in `content/work/` and `content/writing/` (EN + FR) |
| **Archive** | Previous Next.js 16 app on branch/tag `archive/nextjs-v1` |
| **Hosting** | Vercel |

Routes live today: `/`, `/fr`, `/work/[slug]`, `/writing/[slug]`, `/api/contact`. No separate `/about` or `/contact` pages — those live on the board (Operate + Connect zones).

---

## Strategic relationships (high leverage)

Not a client list — people who shape next opportunities:

- **Everest CEO** — current anchor client; scope expansion; public case-study permissions
- **ERGOBIT CEO** — Odoo toolkit distribution; past ERP credibility
- **BBA CEO** — finance network; BankingBook lineage
- **Education contact** — Les Hirondelles, EduPlan pilot channel
- **Mansour Holding** — multi-vertical ops cluster (logistics, automotive, real estate, retail)
- **Bakery / Gerpain track** — owner-operator vertical; validate before productizing

---

## Open before public launch

- [ ] Everest CEO — name, screenshots, redaction
- [ ] ERGOBIT CEO — Odoo toolkit publish path + GitHub
- [ ] Wire COOP PDFs (Purolator, Orange, ITech) from work-record CTAs
- [ ] Production domain DNS (`aliouwade.com`)
- [ ] Resend production key for contact form

---

## Quick links in repo

| Need | File |
|------|------|
| Board copy + work record data | `public/board/flow-data.js`, `flow-data-fr.js` |
| Case studies | `content/work/<slug>/{en,fr}.mdx` |
| Agent/build conventions | `AGENTS.md` |
| Launch gates | `docs/launch-prerequisites.md` |

---

*Refresh this file when employment, Everest products, or anchor case narratives change materially.*
