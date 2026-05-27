2026-05-16 — T001 done: next-intl wired with `[locale]` routes, `proxy.ts`, `messages/en.json` + `messages/fr.json`, prefix `/en` and `/fr`.
2026-05-16 — T002 done: Design system established with premium fintech palette (warm off-white, deep ink, metallic accent), Inter (sans/UI) + Lora (serif/long-form) fonts, CSS custom properties in `app/globals.css`.
2026-05-16 — T003 done: Site shell with `Nav`, `Footer`, `LocaleSwitcher`; bilingual strings for nav/footer and writing placeholder.
2026-05-16 — T004 done: MDX pipeline with `gray-matter`, `next-mdx-remote` RSC, `remark-gfm`, typed case-study frontmatter (§9), `mdx-components`, placeholder `everest-finance.mdx`, smoke route `/work/[slug]`.
2026-05-16 — T005 done: Homepage refactored into `Hero`, `CaseStudyCard` components; review fixes (footer `<a>`, internal `<Link>`, slug regex tightened).
2026-05-16 — T006 done: `/work` listing page + `/work/[slug]` case study detail page with MDX rendering, `generateMetadata`, `generateStaticParams`, confidential badge, stack tags.
2026-05-16 — T007 done: `/writing` listing page (with graceful empty state) + `/writing/[slug]` essay detail page with MDX rendering.
2026-05-16 — T008 done: `/about` page — three-section first-person prose (Who I am, What I build, Beyond the work), label-left/prose-right layout, bilingual.
2026-05-16 — T009 done: `/contact` page — two-column layout (direct links + form), `ContactForm` client component, `/api/contact` route handler with Resend integration and dev fallback.
2026-05-16 — T010 done: SEO — `sitemap.ts` (all routes × both locales), `robots.ts`, enhanced `generateMetadata` with OG/Twitter/alternates in locale layout, default OG image.
2026-05-16 — T011 done: Review fixes — honeypot spam protection on contact form + API, i18n validation errors, real contact info from Footer translations, about hero text moved to i18n.
2026-05-16 — T012 done: Everest Finance case study — full 8-section write-up (~1,700 words), first-person, confidential flag, honest "in progress" outcome.
2026-05-16 — T013 done: Odoo Testing Toolkit case study — supporting case (~850 words), Robot Framework + Playwright, 39 tests / 9 suites.
2026-05-16 — T014 done: First essay "Why I stopped building frameworks and started shipping systems" (~1,100 words) — writing section is now live.
2026-05-27 — T031–T032 done: BocalBun retrospective MDX (EN+FR), ledger frontmatter on anchor cases, `lib/work-ledger.ts`, essay cross-links; P5 migration backlog + `docs/launch-prerequisites.md`.
2026-05-27 — T033–T034 done: `app/ledger.css` tokens + accordion/join styles, `components/work-ledger.tsx` + `join-block.tsx` wired to MDX, `/ledger-preview` verification route.
2026-05-27 — T035 done: Homepage uses neo-ledger IA (`HomeLedgerPage`, `WorkLedger`, `JoinBlock`, MDX-driven rows, bilingual `HomePage.ledger` copy).
2026-05-27 — T036–T038 done: Case study template v2, MDX work index, removed v3 components and `/mock` route; TopNav uses homepage anchors.
2026-05-27 — Review fixes: ScrollTrigger viewport, join block `#contact` anchor, case study i18n labels, `router.push` for ledger CTAs, contact API default email, removed dead CF message keys.
2026-05-27 — Homepage systems map (`#systems`), supporting work MDX (Mansour, Ndouckmane, Dakar Sport Shop), Everest acquisition copy, Three.js removed, planning docs aligned to neo-ledger IA.
2026-05-27 — Review fixes: unified design tokens, about modal from hero (no homepage about section; `/about` → `#about`), route-based nav + Systems, honest Join block, work index styling, NDA media placeholders, contact calendar removed.
