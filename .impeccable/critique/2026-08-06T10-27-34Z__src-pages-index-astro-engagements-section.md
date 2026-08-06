---
target: Engagements section (index.astro)
total_score: 11
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-06T10-27-34Z
slug: src-pages-index-astro-engagements-section
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Chevron rotates on expand — clear, but no count of hidden surfaces |
| 2 | Match System / Real World | 3 | Domain grouping mostly reads naturally |
| 3 | User Control and Freedom | 3 | Native `<details>` — easy to close, no traps |
| 4 | Consistency and Standards | 1 | Engagements list uses different visual language than hero/header (flat hairline list vs soft-UI bezels/pills/shadows) |
| 5 | Error Prevention | n/a | No destructive actions in this section |
| 6 | Recognition Rather Than Recall | 3 | Chevron + hover state legible |
| 7 | Flexibility and Efficiency | n/a | Persuade/Experience surface |
| 8 | Aesthetic and Minimalist Design | 1 | Dense rows (leader line + period + chevron + hover bg); domain buckets wildly imbalanced (1 vs 6) |
| 9 | Error Recovery | n/a | No error states applicable |
| 10 | Help and Documentation | n/a | Persuade/Experience surface |
| **Total** | | **11/24** | **46% - Poor** |

## Design Specificity Verdict

LLM assessment: Hero (index.astro:54-86) is clearly authored - pill nav, soft bezel shadows (--lift, --well in lab-precision.css:41-54), warm machined surfaces. The engagements list right below (index.astro:88-171) drops all of that and reverts to a generic hairline-divided text list.

Deterministic scan: detect.mjs flagged `single-font` (warning) on index.astro - likely false positive (Switzer + JetBrains Mono both loaded). Scan against work-registry.ts returned clean.

## Overall Impression

The section feels crowded because two unrelated visual systems are stacked on top of each other, and because a data bug makes one domain bucket absorb almost everything (6 of 7 engagements land in "Operations").

## What's Working

- The `<details>` disclosure mechanism - zero JS, keyboard-accessible, no layout-shift surprises
- Domain-first IA is the right idea
- Copy density inside expanded surfaces (name -> blurb -> stack) is well-ordered

## Priority Issues

**[P0] Domain grouping bug collapses 6 of 7 engagements into "Operations"**
- Why it matters: `normalizeDomain()` in work-registry.ts:13-20 only matches exact strings and silently defaults everything else to "Operations". Real frontmatter values like "ERP / QA", "Systems judgment", "Retail e-commerce", "Automotive & holding operations", "Logistics & customs transit", "Education systems" all miss exact-match checks.
- Fix: Normalize with substring/keyword matching or explicit per-slug overrides.
- Suggested command: $impeccable layout

**[P1] Two incompatible visual languages on one page**
- Why it matters: Hero uses soft bezels/pills/shadows; roster list uses flat hairlines and bare chevron with no card treatment. Heuristic-4 consistency failure.
- Fix: Apply --lift/--well bezel treatment to expanded rows and surface cards.
- Suggested command: $impeccable delight or $impeccable polish

**[P1] Per-row visual crowding: 3 competing right-aligned elements**
- Why it matters: Dotted leader line + period + chevron all fight for the same baseline, plus hover/open background changes stack 4 visual signals per row.
- Fix: Drop dotted leader when chevron present, or reposition period.
- Suggested command: $impeccable distill

**[P2] Nested heading hierarchy is ambiguous**
- Why it matters: h2 Engagements -> h3 domain -> engagement name (not a heading) -> h4 surface name skips a heading level for the engagement itself.
- Fix: Promote engagement name to a heading or demote surface names for consistency.
- Suggested command: $impeccable audit

**[P3] "7 clients - by domain" undercuts itself once domains are lopsided**
- Why it matters: Subhead promises organization "by domain" but P0 bug breaks that promise.
- Fix: Resolves once P0 fixed; re-verify copy.
- Suggested command: $impeccable clarify

## Persona Red Flags

**Jordan (First-Timer, CTO/founder skimming for proof):** Sees one confident Fintech card, then a wall of 6 undifferentiated "Operations" items. Domain labels stop being useful wayfinding.

**Riley (Stress Tester):** Opening multiple `<details>` at once stacks many expanded surface blocks with no "collapse all" affordance and no marker for which rows are open.

## Minor Observations

- single-font detector flag likely false positive
- `builds: surfaces.length ?? 1` in work-registry.ts:55 - dead `?? 1`, harmless
- Chevron SVG aria-hidden on wrapping span is correct since summary provides accessible name

## Questions to Consider

- Does "by domain" grouping still earn its place once entries are correctly split into 6 categories, or does that argue for a flatter list?
- Should the dropdown affordance exist for single-surface engagements at all?
