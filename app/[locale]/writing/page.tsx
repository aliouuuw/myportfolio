import type { Metadata } from "next";
import { TransitionLink } from "@/components/transition-link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getWritingSlugs, readWritingFrontmatter } from "@/lib/mdx";
import { buildCanonical } from "@/lib/metadata";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("writingTitle"),
    description: t("writingDescription"),
    alternates: { canonical: buildCanonical(locale, "/writing") },
  };
}

export default async function WritingPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("WritingPage");

  const slugs = await getWritingSlugs();
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const frontmatter = await readWritingFrontmatter(slug);
      return { slug, frontmatter };
    }),
  );

  const sorted = entries.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );

  return (
    <div className="site-synthesis-page page-shell">
      <div className="page-shell-inner">
        <header className="mb-12 max-w-2xl">
          <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal tracking-tight text-ink-primary leading-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-base text-ink-secondary leading-relaxed max-w-[68ch]">
            {t("subtitle")}
          </p>
        </header>

        <section>
          {sorted.length === 0 ? (
            <div className="card">
              <p className="text-[15px] text-ink-tertiary italic">
                {t("empty")}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {sorted.map(({ slug, frontmatter }) => {
                const title =
                  locale === "fr" ? frontmatter.titleFr : frontmatter.title;
                const summary =
                  locale === "fr" ? frontmatter.summaryFr : frontmatter.summary;
                const href = `/${locale}/writing/${slug}`;
                const date = new Date(frontmatter.date).toLocaleDateString(
                  locale === "fr" ? "fr-FR" : "en-US",
                  { year: "numeric", month: "long" },
                );

                return (
                  <li key={slug}>
                    <TransitionLink
                      href={href}
                      className="syn-entity-card grid gap-3 p-5 sm:grid-cols-[10rem_1fr] sm:gap-8 group"
                      style={{ viewTransitionName: `writing-${slug}` }}
                    >
                      <time
                        className="font-mono text-[12px] text-ink-muted sm:pt-1"
                        dateTime={frontmatter.date}
                      >
                        {date}
                      </time>
                      <div>
                        <h2 className="text-[clamp(1.25rem,2.4vw,1.625rem)] font-medium tracking-tight text-ink-primary group-hover:text-accent transition-colors mb-2">
                          {title}
                        </h2>
                        <p className="text-[15px] text-ink-secondary leading-relaxed max-w-[60ch]">
                          {summary}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-accent font-medium">
                          {t("readEssay")} <span aria-hidden>→</span>
                        </span>
                      </div>
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
