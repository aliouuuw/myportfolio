# AGENTS.md — myportfolio AI Conventions

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project overview

Bilingual (FR/EN) portfolio and case-study site for a Product Systems Engineer. Conversion tool for founders, CTOs, and network referrals — not a project gallery.

- **Runtime**: Node (Bun lockfile)
- **Framework**: Next.js 16 App Router
- **Database**: None (MDX content in repo)
- **Auth**: None
- **Styling**: Tailwind CSS v4
- **i18n**: next-intl (planned)
- **Content**: MDX files in `content/`
- **Hosting**: Vercel
- **Test runner**: ESLint (no test suite yet)
- **CI**: None yet

## Structure

```
app/
  [locale]/
    page.tsx
    work/
    work/[slug]/
    writing/
    writing/[slug]/
    about/
    contact/
  layout.tsx
  globals.css
proxy.ts          ← request interception (Next.js 16; replaces middleware.ts)
i18n/
  request.ts      ← next-intl request config
content/
  work/           ← MDX case studies
  writing/        ← MDX essays
components/       ← shared UI components
messages/
  en.json         ← next-intl translations
  fr.json
public/
  images/
docs/
  strategic-plan.md
  portfolio-plan.md
  backlog.json
```

## Next.js 16 conventions

Read `node_modules/next/dist/docs/` before implementing routing, caching, or config. Key differences from older Next.js:

| Topic | Next.js 16 rule |
|-------|-----------------|
| Request interception | Use root **`proxy.ts`** with `export function proxy(request)`. Do **not** add `middleware.ts` (deprecated). |
| Proxy runtime | **`nodejs` only** (not Edge). If Edge is required, `middleware.ts` still works but is deprecated. |
| Dynamic route params | **`await props.params`** in pages, layouts, and route handlers. Sync access is removed. |
| `searchParams` | **`await props.searchParams`** in pages. |
| `cookies()` / `headers()` | **Await** in Server Components and route handlers. |
| Typed routes | Run **`npx next typegen`** after adding routes; use `PageProps<'/path'>` / `LayoutProps`. |
| Dev / build bundler | **Turbopack is default** for `next dev` and `next build`. No `--turbopack` flag needed. |
| Linting | **`next lint` removed**. Use `npm run lint` (ESLint CLI). `next build` does not lint. |
| `sitemap` / OG image generators | `id` from `generateSitemaps` / `generateImageMetadata` is a **Promise** — await it. |
| Config flags | `skipMiddlewareUrlNormalize` → **`skipProxyUrlNormalize`**. `experimental.turbopack` → top-level **`turbopack`**. |

Example locale proxy (pattern only; wire to next-intl when installed):

```ts
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // locale detection / redirects
  return NextResponse.next()
}

export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] }
```

Example dynamic page:

```tsx
export default async function Page(props: PageProps<'/[locale]/work/[slug]'>) {
  const { locale, slug } = await props.params
  // ...
}
```

## Key conventions

- **Locale routing**: All user-facing routes live under `app/[locale]/`. Root `app/layout.tsx` handles global providers only. Locale detection and redirects go in **`proxy.ts`**, not `middleware.ts`.
- **Content files**: MDX with YAML frontmatter in `content/work/` and `content/writing/`. Frontmatter includes both EN and FR fields (`title` / `titleFr`, `summary` / `summaryFr`).
- **Component files**: kebab-case (`case-study-card.tsx`)
- **Route files**: Next.js conventions (`page.tsx`, `layout.tsx`, `loading.tsx`)
- **No `any` types**: use proper TypeScript types throughout
- **Styling**: Tailwind utility classes. No CSS modules. No styled-components.
- **Design direction**: Premium fintech calm — metallic card signature, hairline borders, serious typography, warm off-white or deep graphite base. No glassmorphism, no gradient text, no SaaS template patterns.
- **Imports**: Use `@/*` path alias for all internal imports
- **Images**: `next/image` only. No raw `<img>` tags.

## What NOT to do

| Rule | Reason |
|------|--------|
| Do not add Sanity or any CMS | Single author, MDX in repo is the content strategy |
| Do not create `/projects` grid with many cards | Depth over breadth — 3 flagship case studies first |
| Do not add `/skills` page with progress bars | Kills credibility with CTO/founder audience |
| Do not add `/services` page | Too agency-template |
| Do not use glassmorphism, gradient text, animated mesh | Violates design direction |
| Do not add interactive 3D or heavy animations | Performance cost, wrong signal |
| Do not write about the author in third person | First person only |
| Do not edit `app/layout.tsx` global providers without explicit task permission | Foundation file |
| Do not edit `next.config.ts` without explicit task permission | Foundation file |
| Do not edit `tailwind` / `postcss` config without explicit task permission | Foundation file |
| Do not commit `.env` or credentials | Security |
| Do not add a fourth anchor case study before the first three are live | Strategic plan rule |
| Do not create `middleware.ts` | Next.js 16: use `proxy.ts` and `export function proxy` |
| Do not use sync `params` / `searchParams` / `cookies()` / `headers()` | Removed in Next.js 16; always await |

## Verification

After any code change, run:

```bash
bun run build && bun run lint
```

Uses the Bun toolchain (`bun.lock`). If you temporarily use npm instead, equivalent: `npm run build && npm run lint`.
