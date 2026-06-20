# AGENTS.md — myportfolio AI Conventions

## Project overview

Bilingual (FR/EN) portfolio and case-study site for a Product Systems Engineer. Conversion tool for founders, CTOs, and network referrals — not a project gallery.

- **Runtime**: Node (Bun lockfile)
- **Framework**: Astro 5 (static + selective server routes)
- **Database**: None (MDX content in repo)
- **Auth**: None
- **Styling**: Hand-tuned CSS (`src/styles/`) — no Tailwind
- **Motion**: GSAP (bundled via Vite, not CDN)
- **i18n**: Astro built-in routing (`en` default, `fr` prefixed)
- **Content**: MDX in `content/work/` via Content Collections + Zod
- **Hosting**: Vercel (`@astrojs/vercel`)
- **Typecheck**: `astro check` (no ESLint suite yet)
- **CI**: None yet

The previous Next.js 16 app is archived on branch/tag `archive/nextjs-v1`.

## Structure

```
src/
  components/
    OperatorBoard.astro   ← single-viewport home surface
  layouts/
    Base.astro            ← operator board shell
    CaseStudy.astro       ← proof / case-study pages
  pages/
    index.astro           ← EN home (operator board)
    fr/index.astro        ← FR home
    work/[slug].astro     ← EN case studies
    fr/work/[slug].astro  ← FR case studies
    api/contact.ts        ← Resend contact (server route)
  scripts/
    board-boot.ts         ← loads GSAP + board runtime
  styles/
    operator-board.css    ← board UI (large, hand-tuned)
    case-study.css        ← proof page typography
    tokens.css            ← shared design tokens
  content.config.ts       ← Zod schema for proofs
content/
  work/<slug>/
    en.mdx
    fr.mdx
public/
  board/                  ← flow-data.js + operator-board.js (board runtime)
  logos/
  media/case-studies/
mock-site-loom/           ← reference mock (not served in prod)
docs/
  backlog.json
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
| i18n | EN at `/`, FR at `/fr`. Case studies at `/work/<slug>` and `/fr/work/<slug>` |

Example content collection entry:

```ts
// src/content.config.ts
const work = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "content/work" }),
  schema: z.object({
    title: z.string(),
    titleFr: z.string().optional(),
  }),
});
```

Example static path:

```astro
---
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
  const entries = await getCollection("work", (e) => e.id.endsWith("/en"));
  return entries.map((entry) => ({
    params: { slug: entry.id.replace(/\/en$/, "") },
    props: { entry },
  }));
}
---
```

## Key conventions

- **Home surface**: The operator board is vanilla JS (`public/board/`) orchestrated by `board-boot.ts`. Do not rewrite it in React unless explicitly tasked.
- **Adding a proof**: Create `content/work/<slug>/en.mdx` + `fr.mdx` with valid frontmatter. Build validates via Zod.
- **Content files**: MDX with YAML frontmatter. Bilingual fields: `title` / `titleFr`, `summary` / `summaryFr`.
- **No `any` types**: use proper TypeScript types throughout
- **Design direction**: Premium fintech calm — hairline borders, serious typography, warm off-white or deep graphite base. No glassmorphism, no gradient text, no SaaS template patterns.
- **First person**: Do not write about the author in third person
- **Theme**: `localStorage` key `operator-board-theme` (`light` | `dark`), shared across board and case-study pages

## What NOT to do

| Rule | Reason |
|------|--------|
| Do not add Sanity or any CMS | Single author, MDX in repo is the content strategy |
| Do not create `/projects` grid with many cards | Depth over breadth — anchor case studies first |
| Do not add `/skills` page with progress bars | Kills credibility with CTO/founder audience |
| Do not add `/services` page | Too agency-template |
| Do not use glassmorphism, gradient text, animated mesh | Violates design direction |
| Do not add interactive 3D or heavy animations | Performance cost, wrong signal |
| Do not rewrite operator board in React without explicit task | The handcrafted CSS/GSAP surface is the product signature |
| Do not load GSAP from CDN | Bundle via `board-boot.ts` |
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
