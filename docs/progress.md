# Progress

Living checkpoint log for myportfolio. Task graph: `docs/backlog.json` (T001–T038 all done — Next.js / ledger era). Production surface is now **Astro 5 + Operator Board**.

---

## 2026-07-31 (afternoon) — checkpoint

### Product state

Production home still **Operator Board** (`/`, `/fr`). Parallel mock at `/lab/precision` is the active design track.

| Surface | Status |
|---------|--------|
| `/lab/precision` | IA locked + craft pass in progress (~580 / ~687 lines astro/css) |
| Direction | `docs/lab-precision-direction.md` — palette, type, motion, engagement index, 4 domains |
| Living refs | `docs/profile.md`, `docs/bocal-direction.md` committed in `860317e` |

### Shipped (committed)

- `860317e` — lock lab/precision IA, direction doc, progress + living refs

### Working tree (uncommitted)

- **Craft:** dither portrait canvas (pointer-reactive accent core), magnetic engagement rows, preview-frame tilt, theme material crossfade, ink-faint contrast tweak
- **Leftover:** deleted mock assets `mock-site-loom/Aliou.png`, `everest-finance.png` (still unstaged)

### Grill decisions still in force (2026-07-29)

| Decision | Call |
|----------|------|
| Judge | You + one non-designer; 30s protocol |
| First judge | **Aug 1** |
| Hard stop | **Aug 4** (one 3-day iteration max), then board stays / CEO conversation |
| Material | Real product UI, synthetic data as default |
| Motion | CSS + IntersectionObserver; no GSAP in mock; quiet page-in only |

### Open (design)

1. Journey format (storytelling vs git-branch) — still undecided
2. Portrait: dither field landed as craft experiment; real photo / dither-of-photo not yet
3. Engagement pages that list all builds per client (Everest ×3 promise)
4. Promotion: board vs precision — no call until Aug 1 judge

### Backlog

- P0–P5 done; `/lab/precision` not yet a backlog phase
- Human launch gates unchanged (Everest/ERGOBIT CEOs, DNS, Resend, LinkedIn)

---

*Next: commit craft pass if stable → Aug 1 30s judge → either promote craft or one more iteration (cap Aug 4).*

---

## 2026-07-31 (morning) — checkpoint

### Product state

Production surface unchanged (Astro 5 + Operator Board).
New: standalone exploratory mock at `/lab/precision`.

| Surface | Status |
|---------|--------|
| `/lab/precision` | Precision Minimalism homepage direction. Own stylesheet. |
| IA | **Locked** — work/about mode toggle, engagement-level index, 4-domain filter. |
| Direction doc | `docs/lab-precision-direction.md` |

### Open questions (see direction doc)

1. About-mode journey format
2. Portrait treatment (was placeholder at this checkpoint)
3. Engagement pages for multi-build clients
4. Everest/ERGOBIT permissions

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
