# Mock → Production migration plan

**Status:** P5 complete — production is source of truth  
**Last updated:** 2026-05-27  
**Production homepage:** `/[locale]` — neo-ledger (`HomeLedgerPage`, `WorkLedger`, `SystemsMapSection`, `JoinBlock`)  
**Legacy:** `/mock` route removed; design-shape-v3 CF dossier UI retired

---

## 1. Goal

Replace the **design-shape-v3** production UI (CF-xxx dossier, `MetalPanel`, `CaseFileCard`, classification stamps) with the **refined neo-futuristic mock**: editorial hero, execution ledger accordion, restrained OKLCH accent, bilingual copy via next-intl, and real MDX case studies.

Within ~30 seconds, a founder or CTO should answer:

1. What does this person do?
2. What have they shipped (credible systems, not tutorials)?
3. How do I contact them?

Design should feel **crafted and memorable**, not gimmicky. See [mock-redesign-handover.md](./mock-redesign-handover.md) for iteration history and rejected directions.

---

## 2. What we are migrating (locked from mock)


| Pillar               | Mock implementation                                     | Production requirement                                          |
| -------------------- | ------------------------------------------------------- | --------------------------------------------------------------- |
| **Execution ledger** | `WorkLedger` accordion, expand/peek, proof in panel     | Same interaction on homepage; work index can be simplified list |
| **Source of truth**  | `proofClaim` per case + case study link                 | Frontmatter or i18n fields; link to `/work/[slug]`              |
| **Editorial hero**   | Large display name, role line, 2 CTAs                   | Server-rendered; copy from `messages/{locale}.json`             |
| **Restrained color** | Single `--n-accent`, neutrals, green = status only      | Merge into `app/globals.css` tokens (or scoped `ledger.css`)    |
| **Light default**    | `[data-theme="light"]`                                  | Keep `ThemeToggle` + `ThemeInitScript`                          |
| **Motion**           | GSAP entrance + scroll reveal + accordion springs       | Client islands only; respect `prefers-reduced-motion`           |
| **Optional delight** | `LiveSignal` (chrome), `KeyboardHints` (`?`, `g w/j/c`) | Promote only if they survive accessibility review               |


### Explicitly not migrating (yet)

- Mock overlay shell (`mock/layout.tsx` z-index 200, “Exit preview”)
- Hardcoded `MOCK_COPY` / `WORK_LEDGER_META` (replace with MDX + messages)
- Placeholder media crosshatch (replace with `next/image` assets)
- Join block “request seat” without backend (static v1 OK per handover §10)
- `three` / R3F (not used in current mock; do not add for v1 unless user re-opens WebGL)
- CF-001, CONFIDENTIAL stamps, dossier metaphor (drop from production)

### Deferred to v2 (do not block launch)

- Social likes/comments
- Real join-request API + progress dashboard
- View Transitions on case study navigation (nice-to-have in Phase 4)
- Scroll-spy section labels in chrome

---

## 3. Current production (post-migration)

### Routes


| Route                   | File                                | Pattern                                                                 |
| ----------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| `/[locale]`             | `app/[locale]/page.tsx`             | Editorial hero + `WorkLedger` + `SystemsMapSection` + `JoinBlock` + essay + about + contact |
| `/[locale]/work`        | `app/[locale]/work/page.tsx`        | Featured trio + “More work” list from `getWorkSlugs()`                  |
| `/[locale]/work/[slug]` | `app/[locale]/work/[slug]/page.tsx` | `CaseStudyHeader` + MDX body (v2 template)                              |
| Layout                  | `app/[locale]/layout.tsx`           | `TopNav`, `Footer`, `CommandPalette`, `ledger.css`                      |


### Homepage sections (anchors)


| #   | Anchor    | Component              |
| --- | --------- | ---------------------- |
| 01  | `#work`   | `WorkLedger`           |
| 02  | `#systems`| `SystemsMapSection`    |
| 03  | (join)    | `JoinBlock`            |
| 04  | `#writing`| Essay teaser           |
| 05  | `#about`  | About copy + link      |
| 06  | `#contact`| Email + contact CTA    |


### Work slugs (content)


| Tier      | Slugs                                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| Featured  | `everest-finance`, `odoo-testing-toolkit`, `bocalbun-retrospective`                                        |
| Supporting| `eduplan`, `mansour-holding`, `ndouckmane-transit`, `dakar-sport-shop`                                     |


### Remaining gaps (not structural)


| Item              | Action                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------- |
| Case images       | Add under `public/images/case-studies/` after permission gates                            |
| Join “request seat” | Static UI v1; no API                                                                     |
| Live signal / `?` shortcuts | Deferred (launch-prerequisites)                                                    |
| Media polish      | Screenshots, diagrams per case study                                                      |


### Content blockers (fix in Phase 0)


| Issue                            | Action                                                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `**bocalbun-retrospective` 404** | ✅ **Done** — `content/work/bocalbun-retrospective/{en,fr}.mdx` (T031)                                          |
| `**eduplan`**                    | Exists in `content/work/` but not in v1 hero set (`featured: false`). Do not add to homepage trio              |
| **Prev/next i18n keys**          | `work/[slug]/page.tsx` uses fragile `caseFiles.${slug}Title` mapping — refactor in T036                        |
| **Case images**                  | Placeholders — add under `public/images/case-studies/` after permission gates (`docs/launch-prerequisites.md`) |
| **Ledger frontmatter**           | ✅ **Done** — `lib/work-ledger.ts` + anchor MDX fields (T032)                                                   |


---

## 4. Architecture decisions (decide once, then build)

### A. Token strategy

**Recommendation:** Add production ledger tokens to `app/globals.css` under a `.site-ledger` wrapper (or rename to semantic tokens used site-wide).

- Port OKLCH values from `neo-futuristic.css` (`--n-bg`, `--n-accent`, etc.)
- Map or deprecate old `--ink-`* / metal tokens on migrated pages only
- Do **not** edit `tailwind.config` without an explicit backlog task (foundation-lock)

### B. Component placement

**Recommendation:** Promote mock components to shared `components/`:

```
components/
  work-ledger.tsx          ← from mock/_components/work-ledger.tsx
  join-block.tsx           ← from mock (client)
  spectral-atmosphere.tsx  ← optional, homepage only
  live-signal.tsx          ← optional, TopNav slot
  keyboard-hints.tsx       ← optional, layout footer island
```

Keep **server** pages thin: fetch MDX → pass serializable props into client ledger.

### C. Data model for ledger rows

Extend case study frontmatter (or parallel JSON) so rows are not hardcoded:

```yaml
# content/work/everest-finance/en.mdx (proposed fields)
status: active          # active | shipped | archived
period: "2024 — present"
proofClaim: "Can this person own and ship a real fintech stack solo?"
outcome: "One stack across web, CRM, and customer app"
heroImage: "/images/case-studies/everest/crm.webp"  # optional v1
```

Update `CaseStudyFrontmatter` in `lib/mdx.ts` + Zod-style parsers with sensible defaults for missing fields.

**i18n:** `proofClaim`, `outcome` should have EN + FR variants (`proofClaimFr`, `outcomeFr`) or live only in MDX frontmatter per locale file (preferred: per-locale MDX frontmatter).

### D. Homepage IA (recommended)

Single scrolling homepage (mock model), not separate “work grid” as primary:

1. Hero (identity + CTAs)
2. Work ledger (3 featured cases from `featured: true` or fixed slug list)
3. Join / open collaborations (static)
4. Writing teaser (latest essay from `getWritingSlugs()`)
5. About (short)
6. Contact

`/work` becomes a **full index** (all slugs) or redirects to `/#work` — pick one to avoid duplicate maintenance.

### E. Case study template

Replace `MetalPanel` + CF header with **clean report layout**:

- Title, domain, period, status (from frontmatter)
- MDX body (existing)
- Prev/next by slug order (fix i18n keys)
- Optional: shared `view-transition-name` on hero image when Phase 4

Retire or delete unused v3 components after migration: `case-file-card.tsx`, `file-reference-row.tsx`, `metal-panel.tsx`, `classification-stamp.tsx` (when nothing imports them).

### F. GSAP scroller

Mock uses `use-mock-scroller.ts` → `.mock-shell`. Production ScrollTrigger must use `**window`** or the main document scroller (`document.documentElement`). Refactor hook to `use-site-scroller.ts` and test inside real layout (nav height, `scroll-padding-top`).

---

## 5. Phased execution plan

### Phase 0 — Prerequisites (½ day)

**Goal:** No 404s, backlog aligned, tokens agreed.

- Restore `content/work/bocalbun-retrospective/en.mdx` + `fr.mdx` (T031; links essay `why-systems-over-frameworks`)
- Run `bun run build && bun run lint` on `main`
- Add backlog tasks P5 T031–T038 (see §8)
- Confirm with user: `/work` route = full index vs anchor-only (default: full index — [launch-prerequisites.md](./launch-prerequisites.md))
- Gather 1–3 images per anchor case → `public/images/case-studies/{slug}/` (blocked on Everest/ERGOBIT sijjgn-off)

**Verify:** `/en/work/bocalbun-retrospective` renders; all three homepage slugs resolve.

---

### Phase 1 — Design system port (1 day)

**Goal:** Production can style ledger without mock CSS file.


| Task                                                                   | Files                                                                   |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Extract tokens + base utilities from `neo-futuristic.css`              | `app/globals.css` or `app/ledger.css` imported in `[locale]/layout.tsx` |
| Add layout utilities: `.page-inner`, `.section-block`, `.section-head` | same                                                                    |
| Ensure light default + dark theme parity                               | manual test both themes                                                 |
| Add `scroll-padding-top` for fixed `TopNav`                            | `globals.css`                                                           |


**Do not** import entire `neo-futuristic.css` into global layout (keeps mock isolated). Copy only what production needs.

**Verify:** Story-less check — temporary test page or homepage stub with one ledger row styled correctly.

---

### Phase 2 — Shared components (1–2 days)

**Goal:** Ledger and join work outside `/mock`.


| Task                                                  | Files                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| Move `work-ledger.tsx` → `components/work-ledger.tsx` | update imports, locale-aware links `/${locale}/work/${slug}` |
| Move `join-block.tsx` → `components/join-block.tsx`   | wire i18n                                                    |
| Refactor scroller hook                                | `components/use-site-scroller.ts`                            |
| Optional: `spectral-atmosphere.tsx`                   | homepage wrapper only                                        |
| Extend MDX frontmatter + parser                       | `lib/mdx.ts`, all `content/work/*/en.mdx`                    |
| Add `lib/work-ledger.ts` helper                       | `getFeaturedWorkEntries(locale)` → props for ledger          |


**Verify:** Unit path — render ledger in a throwaway route or Storybook-free manual test on `/en` branch.

---

### Phase 3 — Homepage replacement (1–2 days)

**Goal:** `/[locale]` matches mock IA with real data.


| Task                                                                           | Files                                |
| ------------------------------------------------------------------------------ | ------------------------------------ |
| Rewrite homepage sections                                                      | `app/[locale]/page.tsx`              |
| Replace `CaseFileCard` grid with `<WorkLedger />`                              | client boundary                      |
| Hero copy from `messages/en.json` / `fr.json`                                  | align with mock tone, no CF-xxx      |
| Writing teaser: keep `getWritingSlugs()` pattern                               |                                      |
| About + contact: port mock copy structure                                      | messages namespaces                  |
| GSAP: single client `HomeMotion` wrapper or inline `useEffect` in client child | avoid GSAP in RSC                    |
| Remove CF / classification from `messages`                                     | `HomePage.caseFiles.`* keys refactor |


**Verify:**

- `/en` and `/fr` build statically
- Accordion opens, links go to real case studies
- Lighthouse mobile ≥ 90 (performance budget; no WebGL v1)
- Keyboard nav + focus visible on accordion

---

### Phase 4 — Work index + case template (1–2 days)

**Goal:** Inner pages match new visual system.


| Task                                                                           | Files                                                           |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Redesign `app/[locale]/work/page.tsx`                                          | simple ledger list or table, no CF-xxx                          |
| Redesign `app/[locale]/work/[slug]/page.tsx`                                   | drop `MetalPanel`, new header component `case-study-header.tsx` |
| Update `messages` WorkPage strings                                             |                                                                 |
| Optional: View Transitions API on “Read case study”                            | `work-ledger.tsx` + slug layout                                 |
| Wire `ScrollDiagram` / `RedactedArtifact` in MDX **only if** content uses them | `components/mdx-components.tsx`                                 |


**Verify:** Full journey: home → expand row → case study → back. FR parity.

---

### Phase 5 — Nav, footer, i18n cleanup (½ day)


| Task                                                                 | Files                                  |
| -------------------------------------------------------------------- | -------------------------------------- |
| `TopNav` links match homepage anchors (`#work`, `#join`, `#contact`) | `components/top-nav.tsx`               |
| Optional `LiveSignal` in nav                                         |                                        |
| `Footer` copy matches new positioning                                | `components/footer.tsx`                |
| Command palette routes still valid                                   |                                        |
| Remove dead message keys (CF-xxx)                                    | `messages/en.json`, `messages/fr.json` |


---

### Phase 6 — Delete legacy + mock wind-down (½ day)


| Task                                                                     | Notes                     |
| ------------------------------------------------------------------------ | ------------------------- |
| Delete unused components                                                 | See §9                    |
| `/mock` route + mock-only components                                     | **Done** (T038)           |
| Prune `three` / R3F from `package.json` if unused                        | **Done**                  |
| Update `docs/mock-redesign-handover.md` → “Promoted to production”       |                           |
| Update `docs/progress.md` one line                                       | per orchestrator rules    |


**Verify:** `bun run build && bun run lint`; no imports of deleted components.

---

## 6. i18n mapping (mock → messages)

Create or extend namespaces (example):


| Mock string        | Suggested key                                       |
| ------------------ | --------------------------------------------------- |
| Hero role line     | `HomePage.hero.role`                                |
| CTAs               | `HomePage.hero.ctaWork`, `HomePage.hero.ctaContact` |
| Work section title | `HomePage.work.title`                               |
| Work section lead  | `HomePage.work.lead`                                |
| Join block         | `HomePage.join.`* or `JoinPage.*`                   |
| Status labels      | `WorkLedger.status.active` / `shipped` / `archived` |
| Accordion CTA      | `WorkLedger.readCaseStudy`                          |
| Peek hint          | `WorkLedger.openFullEntry`                          |


Remove: `fileRef`, `classification`, CF-* keys from `HomePage.caseFiles` and `WorkPage.caseFiles`.

---

## 7. Foundation-lock boundaries

Do **not** change without explicit backlog `files` permission:

- `app/layout.tsx` (root providers only)
- `next.config.ts`
- Tailwind / PostCSS config
- `proxy.ts`
- `tsconfig.json`, `eslint.config.mjs`

`app/[locale]/layout.tsx` may wrap children with atmosphere **only if** task allows; prefer homepage-local wrapper.

---

## 8. Backlog tasks (orchestrator)

Added to `docs/backlog.json` phase **P5**:


| ID   | Title                                            | Status  |
| ---- | ------------------------------------------------ | ------- |
| T031 | content: bocalbun retrospective MDX EN+FR        | done    |
| T032 | content: ledger frontmatter + work-ledger helper | done    |
| T033 | design: port ledger tokens to globals            | done    |
| T034 | feat: work-ledger component + site scroller      | done    |
| T035 | feat: homepage neo-ledger IA                     | done    |
| T036 | feat: case study template v2                     | done |
| T037 | feat: work index v2                              | done |
| T038 | chore: remove v3 components + retire mock        | done |


Human gates: [launch-prerequisites.md](./launch-prerequisites.md)

---

## 9. Component retention matrix


| Component                  | Action                                   |
| -------------------------- | ---------------------------------------- |
| `work-ledger.tsx`          | **Promote** → `components/`              |
| `join-block.tsx`           | **Promote** (i18n)                       |
| `spectral-atmosphere.tsx`  | **Promote** (homepage optional)          |
| `live-signal.tsx`          | **Optional** in TopNav                   |
| `keyboard-hints.tsx`       | **Optional** in layout                   |
| `mock-chrome.tsx`          | **Delete** with mock route               |
| `mock-config.ts`           | **Delete** after MDX wired               |
| `use-mock-scroller.ts`     | **Replace** → `use-site-scroller.ts`     |
| `system-artifact.tsx`      | **Defer** or delete if unused            |
| `case-file-card.tsx`       | **Remove** after homepage migration      |
| `file-reference-row.tsx`   | **Remove** after work index migration    |
| `metal-panel.tsx`          | **Remove** from case template            |
| `classification-stamp.tsx` | **Remove**                               |
| `case-report-header.tsx`   | **Replace** with `case-study-header.tsx` |


---

## 10. Anti-patterns (do not reintroduce)

From [AGENTS.md](../AGENTS.md) and mock iteration lessons:

- CF-xxx, CONFIDENTIAL, dossier LARP
- Glassmorphism as default, gradient text, rainbow per-project colors
- Heavy WebGL / particles on v1 homepage
- `cursor: none`, bounce/elastic GSAP easings everywhere
- Hardcoded case arrays in page files (use `getWorkSlugs()` + frontmatter)
- Fourth anchor case study before three are excellent
- Editing root layout / next config without task permission

---

## 11. Success criteria (launch gate)

### Functional

- All linked work slugs return 200 (EN + FR)
- Homepage accordion → case study → back works
- Contact email and nav links work
- Theme toggle: light default, dark usable
- `prefers-reduced-motion`: no essential info hidden

### Strategic (user test)

- Founder/CTO can answer the three questions in §1 in < 30s on mobile
- No “AI portfolio” or agency-template vibe
- Bilingual FR does not read like translated EN

### Technical

- `bun run build && bun run lint` green
- Lighthouse mobile performance ≥ 90 (document exceptions)
- No new secrets committed; images use `next/image`

---

## 12. Session start checklist (next agent)

1. Read this doc + [portfolio-plan.md](./portfolio-plan.md) §3 positioning + §11 homepage IA
2. Open `/en` (production) — verify ledger, systems map, work index
3. `bun run build && bun run lint` before any content or polish change
4. Remaining work is **media + polish**, not IA migration — see §3 remaining gaps
5. Human gates: [launch-prerequisites.md](./launch-prerequisites.md)

---

## 13. Resolved product decisions

| # | Question | Decision |
|---|----------|----------|
| 1 | `/work` route | **Full index** at `/[locale]/work`; homepage `#work` is primary showcase |
| 2 | Join block | **Static placeholders v1** on homepage |
| 3 | Live signal + keyboard hints | **Defer** until a11y review |
| 4 | Case images | Pending CEO / ERGOBIT sign-off |
| 5 | EduPlan in featured set | **Excluded** from homepage trio; listed in systems map + “More work” |
| 6 | Systems map | **Homepage §02** (`#systems`); full `/systems` page remains v2+ |

---

## 14. Reference links


| Doc                                                      | Use                                          |
| -------------------------------------------------------- | -------------------------------------------- |
| [mock-redesign-handover.md](./mock-redesign-handover.md) | Mock file map, rejected directions           |
| [portfolio-plan.md](./portfolio-plan.md)                 | Positioning, content strategy                |
| [design-shape-v3.md](./design-shape-v3.md)               | **Legacy** production spec (being replaced)  |
| [strategic-plan.md](./strategic-plan.md)                 | Anchor cases, BocalBun framing               |
| [backlog.json](./backlog.json)                           | Task graph (P5 migration)                    |
| [launch-prerequisites.md](./launch-prerequisites.md)     | Permissions, decisions, launch ops           |
| [AGENTS.md](../AGENTS.md)                                | Next.js 16, foundation-lock, verify commands |


---

*End of plan. Start with Phase 0 (BocalBun MDX + images), then Phase 1–2 (tokens + components), then Phase 3 (homepage).*