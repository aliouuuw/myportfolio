# Progress — product checkpoint

**Last updated:** 2026-08-08  
**Branch:** `main` (pushed)

---

## Current product state

Lab Precision home is the conversion surface:

| Surface | Role |
|---------|------|
| **Work** (`/`, `/fr/`) | Engagement Console — featured filter, `#engagement-<slug>` deep links, surface URLs (deployed products / GitHub / pending `*`) |
| **Background** (`#background`) | Bio, Journey git-graph, credentials, contact close |
| **Writing** | Essay(s) with related-work deep links into the console |
| **`/work/<slug>`** | Soft-deprecated — client redirect to `/#engagement-<slug>` (FR: `/fr/#…`) |

Long-form case-study pages are no longer linked from the console or Journey. MDX in `content/work/` remains the data source for dossiers via `work-registry.ts`.

---

## Checkpoint — 2026-08-08 (this chat)

Shipped and pushed:

- Narrative Background bio + chess knight mark in Off the clock
- Journey graph: two lanes, orthogonal wires, DAUST as contract, chronological order
- Journey CTAs: COOP → **Open case study** (`reportHref`, Drive TBD); contracts → **Open proof** (`/#engagement-<slug>`); DAUST + ITech → no link
- Console: removed **View case study** → `/work`; dossiers rely on surface links
- Soft-deprecated `/work/[slug]` + essay retargets to Engagement Console hashes

---

## Next (human / content gates)

1. Paste Google Drive share URLs into `reportHref` for Orange, ERGOBIT COOP, Purolator (`lab-precision.ts`)
2. Everest CEO — production URLs, naming/screenshots/redaction
3. ERGOBIT CEO — toolkit publish path + real GitHub URL
4. Replace remaining `*` surface URLs
5. DNS (`aliouwade.com`) + Resend production key
6. Optional cleanup: delete unused `CaseStudy.astro` / `SurfaceProof.astro` once confirmed

See `docs/profile.md` § Open before public launch and `docs/launch-prerequisites.md`.
