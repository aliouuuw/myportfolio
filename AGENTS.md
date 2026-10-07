# AGENTS.md — myportfolio AI Conventions

## Project overview

Bilingual (FR/EN) portfolio for a Software Engineer / solo technical operator. Conversion tool for founders, CTOs, and network referrals — not a project gallery.

- **Runtime**: Node (Bun lockfile)
- **Framework**: Astro 5 (static + selective server routes)
- **Database**: None (MDX content in repo)
- **Auth**: None
- **Styling**: Hand-tuned CSS (`src/styles/`) — no Tailwind
- **Motion**: CSS transitions + light vanilla JS (no GSAP on the live home)
- **i18n**: Astro built-in routing (`en` default, `fr` prefixed)
- **Content**: MDX in `content/work/` via Content Collections + Zod (older rows on the home Work list)
- **Hosting**: Vercel (`@astrojs/vercel`)
- **Typecheck**: `astro check` (no ESLint suite yet)
- **CI**: None yet

The previous Next.js 16 app is archived on branch/tag `archive/nextjs-v1`.
The Operator Board is retired — `/board` and `/fr/board` 301 to home.
Long-form `/work/[slug]` is soft-deprecated — redirects to `/#engagement-<slug>` (the row on the home Work list).
The Lab Precision Engagement Console is retired; the home is the Zeffet-language instrument home (2026-10).

## Structure

```
src/
  components/
    home/Home.astro       ← home: Work view + Background view (career/main graph)
    lab-precision/        ← HugeIcon, ChessKnightMark (shared icons)
  layouts/
    Essay.astro           ← writing pages
  pages/
    index.astro           ← EN home (<Home locale="en" />)
    fr/index.astro        ← FR home (<Home locale="fr" />)
    work/[slug].astro     ← soft-redirect → /#engagement-<slug>
    fr/work/[slug].astro  ← soft-redirect → /fr/#engagement-<slug>
    board/index.astro     ← 301 → /
    fr/board/index.astro  ← 301 → /fr/
    api/contact.ts        ← Resend contact (server route)
  scripts/
    home.ts               ← theme, views + checkout transition, career/main graph, Work filter/sort/more
  styles/
    home.css              ← home surface (Zeffet language: warm silver / near-black, one ink)
    case-study.css        ← essay / legacy case typography
    tokens.css            ← shared design tokens
  content.config.ts       ← Zod schema for work + writing
  data/projects.ts        ← current projects (top of Work); older rows come from content/work MDX
  lib/work-registry.ts    ← getWorkRows(): current projects + older MDX proofs
content/
  work/<slug>/
    en.mdx
    fr.mdx
docs/
  progress.md             ← product checkpoint
  backlog.json
  lab-precision-direction.md
  profile.md
```

## Astro conventions

| Topic | Rule |
|-------|------|
| Default output | Static prerender for pages |
| Server routes | `export const prerender = false` on API endpoints |
| Content | Use `astro:content` collections — do not hand-edit a giant JS blob for proofs |
| Client JS | Prefer Astro `<script>` imports (Vite-bundled). Use `is:inline` only for tiny boot snippets (theme flash prevention) |
| Env vars | `import.meta.env.*` in Astro server code (not `process.env` unless in adapter context) |
| Path alias | `@/*` → `src/*` |
| i18n | EN at `/`, FR at `/fr`. Proof deep links: `/#engagement-<slug>` and `/fr/#engagement-<slug>` |

## Key conventions

- **Home surface**: `Home.astro` + `home.css` + `home.ts`. Work view: short description, every project as one link (domain filter, Selected / Recent / A–Z sort, show more). Background view (`#background`): bio, career/main commit graph drawn on scroll, credentials, writing, contact. Views switch with CSS `:target`; JS adds the checkout transition.
- **Proof on home**: Rows expose **one public link only**, no previews. Pending `*` URLs show “Not public yet”. Rows keep the id `engagement-<slug>` so old deep links land on them.
- **Adding a current project**: append to `currentProjects` in `src/data/projects.ts` (bilingual `what` / `whatFr`). An MDX proof with the same slug is hidden from the list.
- **Journey graph lanes**: hand-placed in `Home.astro` (`lane` map). A new career stint needs one entry there.
- **Palette**: Zeffet language — canvas `#e6e6e2` / `#121211`, one ink (`#0d0d0c` / `#f1f1ee`), no accent colour. System font stack.
- **Adding a proof**: Create `content/work/<slug>/en.mdx` + `fr.mdx` with valid frontmatter. Build validates via Zod. Wire Journey via `caseSlug` on the stint when needed.
- **Content files**: MDX with YAML frontmatter. Bilingual fields: `title` / `titleFr`, `summary` / `summaryFr`.
- **No `any` types**: use proper TypeScript types throughout
- **Design direction**: Premium fintech calm — hairline borders, serious typography, editorial off-white or stone dark. No glassmorphism, no gradient text, no SaaS template patterns.
- **First person**: Do not write about the author in third person
- **Theme**: `localStorage` key `portfolio-theme` (`light` | `dark`), shared across home and essay pages

## What NOT to do

| Rule | Reason |
|------|--------|
| Do not add Sanity or any CMS | Single author, MDX in repo is the content strategy |
| Do not create `/projects` grid with many cards | Depth over breadth — anchor engagements first |
| Do not add `/skills` page with progress bars | Kills credibility with CTO/founder audience |
| Do not add `/services` page | Too agency-template |
| Do not use glassmorphism, gradient text, animated mesh | Violates design direction |
| Do not add interactive 3D or heavy animations | Performance cost, wrong signal |
| Do not resurrect the Operator Board or the Engagement Console without an explicit task | Retired; home is the instrument home |
| Do not revive long-form `/work` pages without an explicit task | Soft-deprecated in favor of console dossiers |
| Do not edit `astro.config.mjs` without explicit task permission | Foundation file |
| Do not commit `.env` or credentials | Security |
| Do not add a fourth anchor case study before the first three are live | Strategic plan rule |

## Verification

After any code change, run:

```bash
bun run build
```

Uses the Bun toolchain (`bun.lock`). Equivalent with npm: `npm run build`.

`bun run lint` runs `astro check` (TypeScript + Astro diagnostics).

## Archive

The Next.js 16 portfolio lives on `archive/nextjs-v1` (branch and tag). Do not resurrect it on `main` without an explicit migration task.
