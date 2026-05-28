# Mock → Production migration plan (Synthesis)

**Status:** Mock approved — production migration **not started**  
**Last updated:** 2026-05-28  
**Source of truth (design):** `app/mock/synthesis/page.tsx` → preview at `/mock/synthesis`  
**Production target:** `/[locale]` (replaces current `HomeLedgerPage` neo-ledger homepage)  
**Prior plan:** Sections below supersede the 2026-05-27 neo-ledger / `WorkLedger` migration (P5 complete). That production UI remains live until this plan runs.

---

## 1. Goal

Ship the **Synthesis** homepage on the real locale route with next-intl, MDX-backed case studies, and the same information diet validated on the mock.

Within ~30 seconds, a **founder/CTO (primary)** or **recruiter (secondary)** should answer:

1. What does this person do, and are they available for contract work?
2. What have they shipped (credible systems, not tutorials)?
3. How do I contact them?

### Audience priority (locked 2026-05-28)

| Priority | Audience | Copy emphasis |
| -------- | -------- | ------------- |
| 1 | Remote + local **contract** clients | Availability, scope, proof, direct contact |
| 2 | **Full-time hire** (recruiters) | Role clarity, employers, credentials, GitHub activity |
| 3 | Referrals / network | Short path to case studies + contact |

### Product decisions (locked 2026-05-28)

| Topic | Decision |
| ----- | -------- |
| Homepage direction | **Synthesis** mock (not operator-graph, magnetic-field, etc.) |
| Mamebimo | **Client project** (Everest employee referred it; repo lives under `everest_finance/` for organizational reasons only) |
| Chess | **Humanizing footnote** in Background — not hero-level |
| Proof media, cert links, chess.com | **Deferred** — add when assets/links ready |
| Join block | **Removed** on mock; do not reintroduce on production |
| Systems map | **Replaced** by Worked With (employers + client projects) on mock |
| Glassmorphism | **Not migrating** — solid panels + subtle grain/dot grid |

---

## 2. What the Synthesis mock contains (migrate this)

| Section | Mock anchor | Production notes |
| ------- | ----------- | ---------------- |
| **Profile** | `#profile` | Hero (7 col) + **GitHub activity** (5 col): live heatmap API, year tabs, pinned repos. Below: Background + Credentials + chess footnote |
| **Work history** | `#worked-with` | Employers list (resume-backed) + client projects grid. Hover employer → highlight related case study rows |
| **Focus** | `#capabilities` | Four areas — merge with Approach in v1 if scroll length is a concern |
| **Selected work** | `#work` | Four flagship rows (Everest, ERGOBIT/Odoo, Africa GreenTec, BocalBun) → link to `/[locale]/work/[slug]` |
| **Approach** | `#approach` | Process steps + principles + stack |
| **Writing** | `#writing` | Essay list — wire to `getWritingSlugs()` + real slugs only |
| **Connect** | `#connect` | CTA + email/WhatsApp/copy + channel row (no GitHub block here) |

### Motion & chrome (migrate selectively)

| Feature | Migrate? | Notes |
| ------- | -------- | ----- |
| Scroll progress hairline | Yes | CSS only |
| Section reveal on scroll | Yes | `prefers-reduced-motion` fallback |
| Boot sequence (session) | Optional | Consider skip for LinkedIn referrers; keep sessionStorage key |
| `⌘K` command palette | Optional | Align with existing `CommandPalette` or merge behaviors |
| Left scroll rail (xl+) | Yes | Map to `RAIL_SECTIONS` ids |
| Glow card cursor spotlight | Hero + Connect only | Avoid on long lists |
| Dakar time-of-day ambient tint | Optional | Low priority |

### Explicitly not migrating

- `/mock` route, `MockSwitcher`, other mock variants (`aurora-rail`, etc.)
- Hardcoded English strings in `page.tsx` (→ `messages/{en,fr}.json`)
- Client-side GitHub API from browser on every visit (consider server cache / ISR in production)
- Fake writing entries if MDX does not exist

---

## 3. Current production (before this migration)

| Route | Today | After migration |
| ----- | ----- | ----------------- |
| `/[locale]` | `HomeLedgerPage`: hero, `WorkLedger`, `SystemsMapSection`, writing teaser, contact | **Synthesis layout** (new `HomeSynthesisPage` or refactor `home-ledger-page.tsx`) |
| `/[locale]/work` | Featured + supporting index | Keep; ensure slugs match mock proof rows |
| `/[locale]/work/[slug]` | MDX case studies | Keep template; visual pass optional (Phase 4) |
| `/mock/synthesis` | Approved reference | **Keep until production parity**, then remove mock routes (Phase 6) |

**Recent production prep (already on `main`, uncommitted):** token unification (`globals.css`), writing/contact pages, nav without Systems tab, about modal a11y, `proxy.ts` excludes `/mock`.

---

## 4. Architecture decisions (decide once at session start)

### A. Component strategy

**Recommendation:** New homepage module, do not grow `home-ledger-page.tsx` in place.

```
components/
  home-synthesis-page.tsx      ← server shell + section composition
  synthesis-hero.tsx           ← client: boot, stagger, time
  synthesis-github-activity.tsx  ← client: chart + year fetch
  synthesis-worked-with.tsx    ← client: team hover → work highlight
  synthesis-work-row.tsx
  lib/
  synthesis-data.ts            ← TEAMS, FREELANCE, WORK metadata (or split worked-with-data.ts)
```

Keep shared: `TopNav`, `Footer`, `AboutModal`, `CommandPalette`, `ThemeToggle`, `LocaleSwitcher`.

### B. Data strategy

| Data | Source |
| ---- | ------ |
| Case study rows | `lib/work-ledger.ts` or extend `getFeaturedWorkEntries(locale)` |
| Employers | `lib/worked-with-data.ts` (new) — EN/FR fields |
| Client projects | Same file, `FREELANCE` array with `note?: "Concept"` |
| Credentials, chess, hero | `messages` namespaces: `HomePage`, `HomePage.credentials`, `HomePage.chess` |
| GitHub heatmap | Client fetch to `github-contributions-api.jogruber.de` v1; **Phase 2b:** Route Handler cache |

### C. Visual system

- Port synthesis **CSS variables / utilities** into `app/ledger.css` or scoped `.site-synthesis` wrapper
- Dark-first mock → align with `ThemeToggle` (mock is dark; ensure light theme is acceptable or scope dark to homepage only for v1)
- No glassmorphism; grain + dot grid optional and subtle

### D. i18n

All user-facing strings in `messages/en.json` and `messages/fr.json`.  
Mock copy deck reference: `docs/ux-ui-handover.md` §15–17 + latest session (GitHub in hero, Connect slimmed).

### E. Foundation-lock

Unchanged — see [AGENTS.md](../AGENTS.md). Homepage work allowed in `app/[locale]/page.tsx`, `components/*`, `messages/*`, `app/ledger.css`, `app/globals.css` only if tasked.

---

## 5. Phased execution plan (next sessions)

### Phase 0 — Prep (½ day)

- [ ] Commit mock + docs baseline (this session)
- [ ] Run `bun run build && bun run lint` on `main`
- [ ] Extract `lib/synthesis-data.ts` from mock (employers, clients, pinned repos)
- [ ] Add `HomePage.*` keys for hero, background, credentials, chess, worked-with, connect (EN first)
- [ ] Confirm featured work slugs: `everest-finance`, `odoo-testing-toolkit` (or ERGOBIT slug), `bocalbun-retrospective`, Africa GreenTec slug name in content/

**Verify:** Data file imported by mock and production stub without duplication drift.

---

### Phase 1 — Homepage shell (1–2 days)

| Task | Files |
| ---- | ----- |
| Create `HomeSynthesisPage` with section order matching mock | `components/home-synthesis-page.tsx`, `app/[locale]/page.tsx` |
| Wire locale + `page-shell` / nav scroll margins | `app/[locale]/layout.tsx` (if needed), `ledger.css` |
| Port profile grid: hero + GitHub column | `synthesis-hero.tsx`, `synthesis-github-activity.tsx` |
| FR messages for hero + credentials | `messages/fr.json` |

**Verify:** `/en` renders new homepage; `/fr` keys present; mock and production visually comparable.

---

### Phase 2 — Work history + case study links (1 day)

| Task | Files |
| ---- | ----- |
| Worked-with section with employer + client tiers | `synthesis-worked-with.tsx` |
| Selected work rows → `/${locale}/work/${slug}` | reuse `WORK` from data or MDX |
| Hover highlight linked work ids | same |
| Remove or deprecate `SystemsMapSection`, `JoinBlock` from homepage | `home-ledger-page.tsx` delete path |

**Verify:** Everest hover highlights case 01; full click path to MDX case study.

---

### Phase 3 — Remaining sections + motion (1 day)

| Task | Files |
| ---- | ----- |
| Capabilities + Approach + Writing + Connect | compose in `home-synthesis-page.tsx` |
| Scroll rail + nav active section | extract hook `use-active-section.ts` |
| `prefers-reduced-motion`, boot session skip | hero client component |
| Writing: only published slugs from `getWritingSlugs()` | server |

**Verify:** 7-section scroll spy; reduced motion disables boot/reveals.

---

### Phase 4 — Inner routes polish (optional, 1 day)

- Work index visual alignment (hairline list, not CF cards)
- Case study header consistency with synthesis tokens
- Proof strip under work (one line: 80% / 10k records / 39 tests) — **not** hero metrics

**Verify:** Home → work → case → back; FR parity.

---

### Phase 5 — Deferred assets (human / later)

| Item | Owner |
| ---- | ----- |
| Case study screenshots / diagrams | Aliou + launch-prerequisites |
| Odoo 18 Functional cert link | Aliou |
| chess.com / Lichess profile link | Aliou |
| GitHub chart server-side cache | Dev task when API rate limits matter |
| Resume PDF download CTA | Optional Connect enhancement |

---

### Phase 6 — Mock wind-down (½ day)

- Remove `/mock/*` routes and `MockSwitcher` when production approved
- Update `proxy.ts` matcher if needed
- Archive other mock variants or delete
- Update `docs/ux-ui-handover.md` → “Synthesis live on /[locale]”

---

## 6. Content inventory (client projects — production copy)

Resume-backed employers: Everest, ERGOBIT, BankingBook Analytics, Purolator, Orange, ITech, DAUST.

Client projects (mock list — confirm EN/FR before ship):

| Name | Domain | Notes |
| ---- | ------ | ----- |
| Ndouckmane Transit | Logistics | Freight forwarder ops |
| EduPlan | Education | School operations dashboard |
| Gerpain | Operations | Multi-bakery platform |
| Mansour Motors | Automotive | Operating company only (not holding) |
| Mamebimo | Marketplace | Client work; Everest-adjacent referral |
| Prescriptos | Health | Pharmacy workflow |
| Asaaman | Drone / AI | **Semantic video search**, surveillance, reporting |
| Bocal Tontine | Fintech | Concept badge |
| Dakar Sport | Retail | |
| Les Hirondelles | Institution | Convex CMS |

---

## 7. i18n namespace sketch

```
HomePage.hero.*
HomePage.background.*
HomePage.credentials.*     # experience, education, certifications (incl. Odoo 18 Functional)
HomePage.chess.*           # footnote only
HomePage.workedWith.*      # employers + clients section titles
HomePage.capabilities.*
HomePage.work.*
HomePage.approach.*
HomePage.writing.*
HomePage.connect.*
```

Remove or stop using: `HomePage.join.*`, `SystemsMap.*` (if unused elsewhere).

---

## 8. Success criteria

### Functional

- `/en` and `/fr` build statically
- GitHub chart loads or degrades gracefully
- All work row links return 200
- Contact email, WhatsApp, copy-to-clipboard work
- Theme + reduced motion OK

### Strategic

- **Contract-first** message above the fold (availability, scope, Dakar + remote)
- Recruiter can scan credentials + GitHub without scrolling to footer
- No duplicate “operating across” verticals lists
- Chess reads as human detail, not core skill

### Technical

- `bun run build && bun run lint` green
- No new secrets; GitHub API is public
- Prefer `next/image` when case media added

---

## 9. Session start checklist (next agent)

1. Read this doc + [ux-ui-handover.md](./ux-ui-handover.md) §15–17 (Synthesis changelog)
2. Open `/mock/synthesis` and `/en` side by side
3. `git pull` — confirm mock commit on `main`
4. Start **Phase 0** → **Phase 1** (do not edit foundation-lock files)
5. Human gates: [launch-prerequisites.md](./launch-prerequisites.md) for case images

---

## 10. Reference links

| Doc | Use |
| --- | --- |
| [ux-ui-handover.md](./ux-ui-handover.md) | Synthesis iteration history, copy decisions |
| [portfolio-plan.md](./portfolio-plan.md) | Positioning, anchor cases |
| [strategic-plan.md](./strategic-plan.md) | Everest, Odoo, BocalBun rules |
| [AGENTS.md](../AGENTS.md) | Next.js 16, verify commands |
| [backlog.json](./backlog.json) | Add P6 tasks T039+ when orchestrator runs |

---

*End of plan. Production migration starts with Phase 0–1: extract data, wire `HomeSynthesisPage`, replace `/[locale]` homepage.*
