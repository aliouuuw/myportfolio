# Engagement Console — Handover

**Last updated:** 2026-08-08  
**Status:** Production home (`src/pages/index.astro`, `/fr/index.astro`)  
**IA:** Direction A — Master-Detail Dossier Console

---

## 1. What this is

The **Engagement Console** is the primary Work view:

- **Left rail**: engagements (featured filter + “See all”), anchors first then supporting by year
- **Right dossier**: selected engagement — summary, outcome, domain, **surface links only**

There is **no** “View case study” CTA to `/work/<slug>`. Long-form `/work` routes soft-redirect to `/#engagement-<slug>`.

---

## 2. Files

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | EN homepage |
| `src/pages/fr/index.astro` | FR homepage |
| `src/components/lab-precision/EngagementConsole.astro` | Rail + dossiers |
| `src/lib/work-registry.ts` | `getEngagements()` / sort / locale |
| `src/scripts/capability-console.ts` | Open/close, filter, `#engagement-{slug}` |
| `src/scripts/lab-precision-controller.ts` | Work / Background view + hash restore |
| `src/styles/lab-precision.css` | Console styles |
| `src/data/lab-precision.ts` | Types + Journey stints (`caseSlug` → console slug) |

---

## 3. Data flow

```
content/work/<slug>/{en,fr}.mdx
  → getEngagements(locale)
  → EngagementConsole (rail + dossier surfaces)
  → initEngagementConsole() — filter, deep links, accordion
```

**Engagement shape** (abbrev.): `name`, `slug`, `domain`, `detail`, `outcome?`, `period`, `featured`, `surfaces[]`.  
`href` to `/work` is deprecated and no longer set by the registry.

**Surfaces:** live `url` (or pending when `url` contains `*`), optional `video` / `poster` (media assets; peek UI not wired).

---

## 4. Deep links & Journey

| From | Target |
|------|--------|
| Direct / share | `/#engagement-<slug>` (FR: `/fr/#engagement-<slug>`) |
| Background Journey — contracts | **Open proof** → same hash (when `caseSlug` matches a work entry) |
| Background Journey — COOP | **Open case study** → `reportHref` (Google Drive; placeholder `#` until wired) |
| Soft-deprecated `/work/<slug>` | Client redirect → `/#engagement-<slug>` |

---

## 5. Open work (for next agent)

### High priority
- [ ] Paste COOP Drive URLs into Journey `reportHref` (Orange, ERGOBIT FE, Purolator)
- [ ] Everest / ERGOBIT CEO gates + clear `*` surface URLs
- [ ] Everest video peek — media exists; not in dossier UI yet

### Medium / low
- [ ] Delete unused `CaseStudy.astro` / `SurfaceProof.astro` if confirmed
- [ ] Domain badge dark-mode legibility
- [ ] Sticky rail when dossier is tall

### Shipped
- [x] Surface copy EN+FR; featured filter; keyboard nav; `#engagement-*` deep links
- [x] No console CTA to `/work`; soft-deprecate long-form routes

---

## 6. Related docs

| Doc | Use for |
|-----|---------|
| `docs/progress.md` | Product checkpoint |
| `lab-precision-direction.md` | Design direction |
| `profile.md` | Facts + launch checklist |
| `launch-prerequisites.md` | Launch gates |

---

## 7. Quick verification

```bash
bun run build
bun run lint
```

---

*End of handover.*
