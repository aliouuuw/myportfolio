# Launch prerequisites

Human and content gates before treating the portfolio as **public launch ready**.

**Stack note (2026-08):** Production site is **Astro 5 + Lab Precision** (Engagement Console on `/` / `/fr`). Operator Board and Next.js ledger are archived (`/board` 301s home; `archive/nextjs-v1`). See `docs/progress.md` for the current product checkpoint.

---

## Resolved (repo)

| Item | Status |
|------|--------|
| Astro migration + Lab Precision home | Done — `/`, `/fr`, Work / Background views |
| Engagement Console + featured filter | Done — `#engagement-<slug>` deep links |
| Writing routes EN+FR | Done |
| Work MDX collections (dossier data) | Done — `content/work/` feeds console via registry |
| Soft-deprecate long-form `/work/[slug]` | Done — redirects to `/#engagement-<slug>` |
| Essay ↔ BocalBun cross-links | Done — points at Engagement Console hash |
| Next.js backlog P0–P5 (T001–T038) | Done — historical; archived on `archive/nextjs-v1` |
| Contact API (Resend) | Done — `src/pages/api/contact.ts` (needs prod key) |
| Journey career graph (2-lane, orthogonal) | Done — Background Journey |

---

## Open — resolve before launch

### Permissions

- [ ] **Everest CEO** — company name on site, anonymization level, screenshot redaction rules
- [ ] **ERGOBIT CEO** — Odoo toolkit publish path (solo vs co-brand), public GitHub URL for console surface link

### Product decisions

| # | Question | Current choice |
|---|----------|----------------|
| 1 | `/work` long-form routes | **Soft-deprecated** — redirect to Engagement Console; MDX kept as data |
| 2 | Proof CTAs on home | Console = surface URLs only; Journey contracts = `#engagement-…`; COOP = `reportHref` |
| 3 | Everest video peek | Defer until wired in console |
| 4 | Case images / media | Gather under `public/media/case-studies/` after CEO sign-off |
| 5 | EduPlan in featured filter | Supporting only (not an anchor) |

### Portfolio plan §19

| Decision | Options | Chosen |
|----------|---------|--------|
| Production domain | `aliouwade.com` / `aliou.dev` / Vercel default | `aliouwade.com` (code default) — confirm DNS |
| Everest naming | Full name / anonymized | **Full name** in MDX today — confirm with CEO |
| Odoo toolkit repo | Personal / ERGOBIT org | Pending ERGOBIT conversation |
| Calendly vs email-only | Both / email only | **Email + WhatsApp v1**; calendar in v1.1 |
| Dakar Sport Shop in v1 | Yes / No | **Not homepage hero** — supporting engagement only |

### Content wiring

- [ ] COOP Google Drive reports — Orange, ERGOBIT FE, Purolator (`reportHref` in `lab-precision.ts`; still `#` placeholders). DAUST / ITech: no Journey CTA.
- [ ] Replace remaining `*` surface URLs (Formos, EduPlan, Ndouckmane, Mansour ops/API, …)

### Launch ops

- [ ] Production URL + site URL env (`SITE_URL` / Astro site config)
- [ ] Resend production key for contact form
- [ ] Case study imagery / media under `public/media/case-studies/` (after CEO sign-off)
- [ ] LinkedIn posts FR + EN; share with Everest CEO, ERGOBIT CEO, education contact
- [ ] Resume alignment: site uses **Software Engineer** / solo operator framing; update PDF separately

### Strategic parallel track (not code)

- Phase 1.5 network conversations — `strategic-plan.md`
- GitHub repo hygiene (push/archive) — `strategic-plan.md` Phase 1
- Bocal / Gerpain substrate direction — `docs/bocal-direction.md` (build docs live in gerpain repo)

---

*Last updated: 2026-08-08*
