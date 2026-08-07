---
target: Background section / home
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
timestamp: 2026-08-07T02-52-39Z
slug: src-pages-index-astro
---
# Critique — Background section (home Lab Precision)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Mode chrome clear; Journey depth less obvious when collapsed |
| 2 | Match System / Real World | 2 | Git metaphor + role jargon vs founder language |
| 3 | User Control and Freedom | 4 | Work/Background exits excellent |
| 4 | Consistency and Standards | 2 | Background invents git vocab Work never uses |
| 5 | Error Prevention | 3 | Low-stakes; inert layers ok |
| 6 | Recognition Rather Than Recall | 2 | Outcomes hidden; no bridge to Work dossiers |
| 7 | Flexibility and Efficiency | n/a | Experience/Persuade surface |
| 8 | Aesthetic and Minimalist Design | 2 | Equal-weight résumé wall |
| 9 | Error Recovery | 3 | Return to Work reliable |
| 10 | Help and Documentation | n/a | Experience surface |
| **Total** | | **21/32** | **Acceptable (~66%)** |

## Design Specificity Verdict

**LLM:** Partially authored shell (soft-UI bezel, Editorial + Google Blue, first-person bio); category-interchangeable body (equal contact links, hobby aside, job timeline, credential grid ending on Meta/DataCamp).

**Deterministic scan:** 2× `single-font` warnings on EN/FR home pages (likely soft FP — Switzer + JetBrains Mono via CSS, detector sees mono snippet in page markup). `lab-precision/` components clean. Browser overlay skipped (no browser tool).

## Overall Impression

Instrument-quality hero, then a résumé dump that ends on commodity certs. Biggest opportunity: make Background convert (weighted CTA + peak-end on contact) and elevate Everest without flattening into Intern.

## What's Working

1. Soft-UI portrait bezel + calm first-person bio
2. Background as layer (not About route) with Escape / hash
3. Progressive disclosure pattern for Journey notes

## Priority Issues

**[P1] No conversion close** — scroll ends on credentials. Fix: primary CTA after Journey.
**[P1] Journey equalizes Everest with Intern** — money lines collapsed. Fix: HEAD default + visible proof.
**[P1] Peak-end on Meta/DataCamp** — demote commodity certs.
**[P2] Git metaphor vs brief** — keep topology if distinctive; restrain rainbow theatre.
**[P2] No Journey → Work bridge** — link featured case studies.

## Persona Red Flags

- Jordan: four equal contacts, COOP jargon, no recommended next step
- Casey: long equal-weight card scroll
- Maya (30s): chess aside + collapsed Everest + Meta end-state

## Minor Observations

- FR label collision (Parcours ×3)
- Name only in figcaption; h1 is tagline
- Period string inconsistency

## Questions to Consider

1. If Maya remembers the last thing — why Meta cert not email?
2. Would deleting Intern/COOP raise seniority faster than polish?
3. Is Background meant to persuade or archive?
