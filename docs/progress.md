# Progress

Living checkpoint log for myportfolio. Task graph: `docs/backlog.json` (T001–T038 all done — Next.js / ledger era). Production surface is now **Astro 5 + Operator Board**.

---

## 2026-07-31 — checkpoint

### Product state

Production surface unchanged (Astro 5 + Operator Board, see 2026-07-29 entry).
New this session: a standalone exploratory mock, not wired to production.

| Surface | Status |
|---------|--------|
| `/lab/precision` | New "Precision Minimalism" homepage direction — Polestar/Porsche/Apple-inspired. Own stylesheet (`src/styles/lab-precision.css`), not shared with `Base.astro` or the board. |
| IA | **Locked** — single-viewport work/about mode toggle, engagement-level index (client rows with build counts, not flat per-surface rows), 4-domain filter (Fintech / ERP & QA / Systems / Operations). |
| Direction doc | `docs/lab-precision-direction.md` — full rationale, locked decisions, open questions. |

### Recent shipped (this session, uncommitted → about to commit)

- `src/pages/lab/precision.astro` + `src/styles/lab-precision.css` — new mock
- `docs/lab-precision-direction.md` — design direction and IA record

### Open questions (see direction doc for detail)

1. About-mode journey format: storytelling prose vs. git-branch model — undecided, needs its own pass
2. Portrait treatment (dither/glass/magnetic) — placeholder frame only
3. Engagement pages that enumerate all builds per client (Everest has 3, only 1 case study today)
4. Everest/ERGOBIT naming + screenshot permissions — same blocker as production, applies to mock media too

### Backlog

- **P0–P5 (T001–T038):** all `done` — describes pre-Astro work; do not treat as current runnable queue
- **No pending code tasks** in `backlog.json` — `/lab/precision` is exploratory, not tracked as a backlog phase yet

### Blockers (human, not code)

1. Everest CEO — naming / screenshots / redaction
2. ERGOBIT CEO — Odoo publish path + public repo URL
3. Launch ops — domain DNS, Resend prod key, case imagery, LinkedIn FR+EN
4. `/lab/precision` promotion decision — no call made yet on replacing the operator board

---

*Next checkpoint: after journey-format decision, or when `/lab/precision` UI craft pass begins.*

---

## 2026-07-29 — checkpoint

### Product state

| Surface | Status |
|---------|--------|
| Stack | Astro 5, MDX content collections, GSAP via `board-boot.ts`, Vercel adapter |
| Home | Operator board at `/` (EN) and `/fr` — proof tabs, comms, ledger |
| Case studies | `/work/[slug]` + FR — Everest, Odoo toolkit, BocalBun + supporting MDX |
| Writing | Routes live; flagship essay `why-systems-over-frameworks` |
| Contact | Resend API route (`src/pages/api/contact.ts`) |
| Archive | Next.js app on `archive/nextjs-v1` |

### Recent shipped (git `main`)

- Unify proof cards + align panel content with work record (`853a03b`)
- Boot sequence: brand panel + status ticks; boot screen redesign
- Astro migration, FR locale board data, writing routes, case-study CSS

### Working tree (uncommitted)

- Untracked: `docs/profile.md`, `docs/bocal-direction.md` (strategy / living refs — worth committing)
- Deleted mock assets: `mock-site-loom/Aliou.png`, `mock-site-loom/logos/everest-finance.png`

### Backlog

- **P0–P5 (T001–T038):** all `done` — describes pre-Astro work; do not treat as current runnable queue
- **No pending code tasks** in `backlog.json` — next work is launch gates + optional P6 tasks

### Docs drift

- `docs/launch-prerequisites.md` — still Next.js-flavored; human gates still valid
- `docs/operator-board-handover.md` — mock-era; board is production
- `docs/ux-ui-handover.md` — Next.js ledger era

### Blockers (human, not code)

1. Everest CEO — naming / screenshots / redaction
2. ERGOBIT CEO — Odoo publish path + public repo URL
3. Launch ops — domain DNS, Resend prod key, case imagery, LinkedIn FR+EN

---

*Next checkpoint: after launch-ops or when a P6 backlog phase is added.*
