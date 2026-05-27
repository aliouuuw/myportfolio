# Launch prerequisites

Human and content gates before treating the portfolio as **public launch ready**.  
Technical migration tasks live in `docs/backlog.json` phase **P5** and `docs/mock-to-production-plan.md`.

---

## Resolved (repo)

| Item | Status |
|------|--------|
| BocalBun case study MDX EN+FR | Done — `content/work/bocalbun-retrospective/` |
| Essay ↔ BocalBun cross-links | Done — slug `why-systems-over-frameworks` |
| Ledger frontmatter + `lib/work-ledger.ts` | Done — T032 |
| EduPlan excluded from v1 featured set | Done — `featured: false` |
| Migration backlog P5 (T031–T038) | Done |
| Post-migration review fixes | Done — ScrollTrigger, join CTA, i18n status, client nav |

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
| Dakar Sport Shop in v1 | Yes / No | **No** (month 2) |

### Launch ops (portfolio-plan §16)

- [ ] Production URL + `NEXT_PUBLIC_SITE_URL`
- [ ] Resend production key for contact form
- [ ] Case study images in `public/images/case-studies/`
- [ ] LinkedIn posts FR + EN; share with Everest CEO, ERGOBIT CEO, education contact
- [ ] Resume alignment: site uses **Product Systems Engineer**; update PDF separately

### Strategic parallel track (not code)

- Phase 1.5 network conversations — `strategic-plan.md`
- GitHub repo hygiene (push/archive) — `strategic-plan.md` Phase 1

---

*Last updated: 2026-05-27*
