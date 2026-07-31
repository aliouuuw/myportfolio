# Launch prerequisites

Human and content gates before treating the portfolio as **public launch ready**.

**Stack note (2026-07):** Production site is **Astro 5 + Operator Board** (`main`). Next.js ledger migration (backlog P5 / T031–T038) is complete and archived on `archive/nextjs-v1`. See `docs/progress.md` for the current product checkpoint.

---

## Resolved (repo)

| Item | Status |
|------|--------|
| Astro migration + operator board home | Done — `/`, `/fr`, board runtime in `public/board/` |
| Writing routes EN+FR | Done |
| Case study pages + MDX collections | Done — `content/work/` |
| BocalBun case study MDX EN+FR | Done — `content/work/bocalbun-retrospective/` |
| Essay ↔ BocalBun cross-links | Done — slug `why-systems-over-frameworks` |
| Next.js backlog P0–P5 (T001–T038) | Done — historical; no pending tasks |
| Next.js app archived | Done — branch/tag `archive/nextjs-v1` |
| Contact API (Resend) | Done — `src/pages/api/contact.ts` (needs prod key) |

---

## Open — resolve before launch

### Permissions

- [ ] **Everest CEO** — company name on site, anonymization level, screenshot redaction rules
- [ ] **ERGOBIT CEO** — Odoo toolkit publish path (solo vs co-brand), public GitHub URL for case study CTA

### Product decisions (mock-to-production §13)

| # | Question | Recommendation |
|---|----------|----------------|
| 1 | `/work` route | Keep **full index** (portfolio-plan §5); homepage ledger is primary |
| 2 | Join block on homepage | **Static placeholders v1** or cut — do not block on API |
| 3 | Live signal + keyboard hints | **Defer** until a11y review; mock-only for now |
| 4 | Case images | Gather per `public/images/case-studies/README.md` after CEO sign-off |
| 5 | EduPlan in v1 nav | **Exclude** (month 2 per strategic plan) |

### Portfolio plan §19

| Decision | Options | Chosen |
|----------|---------|--------|
| Production domain | `aliouwade.com` / `aliou.dev` / Vercel default | `aliouwade.com` (code default) — confirm DNS |
| Everest naming | Full name / anonymized | **Full name** in MDX today — confirm with CEO |
| Odoo toolkit repo | Personal / ERGOBIT org | Pending ERGOBIT conversation |
| Calendly vs email-only | Both / email only | **Email + WhatsApp v1**; calendar in v1.1 |
| Dakar Sport Shop in v1 | Yes / No | **Not homepage hero** — case study on `/work` only |

### Launch ops (portfolio-plan §16)

- [ ] Production URL + site URL env (`SITE_URL` / Astro site config — not `NEXT_PUBLIC_*`)
- [ ] Resend production key for contact form
- [ ] Case study imagery / media under `public/media/case-studies/` (after CEO sign-off)
- [ ] LinkedIn posts FR + EN; share with Everest CEO, ERGOBIT CEO, education contact
- [ ] Resume alignment: site uses **Product Systems Engineer**; update PDF separately
- [ ] Commit living refs: `docs/profile.md`, `docs/bocal-direction.md`

### Strategic parallel track (not code)

- Phase 1.5 network conversations — `strategic-plan.md`
- GitHub repo hygiene (push/archive) — `strategic-plan.md` Phase 1
- Bocal / Gerpain substrate direction — `docs/bocal-direction.md` (build docs live in gerpain repo)

---

*Last updated: 2026-07-29*
