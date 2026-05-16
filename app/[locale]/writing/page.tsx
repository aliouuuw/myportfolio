import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getWritingSlugs, readWritingFrontmatter } from "@/lib/mdx";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
    <div className="flex flex-col flex-1 px-6 py-24 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
      <header className="mb-16">
        <h1 className="font-serif text-4xl font-normal tracking-tight text-ink-primary mb-3">
          {t("title")}
        </h1>
        <p className="text-sm text-ink-secondary">{t("subtitle")}</p>
      </header>

      {sorted.length === 0 ? (
        <div className="py-16 border-t border-border">
          <p className="text-sm text-ink-tertiary italic font-serif">
            {t("empty")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {sorted.map(({ slug, frontmatter }, index) => {
            const title =
              locale === "fr" ? frontmatter.titleFr : frontmatter.title;
            const summary =
              locale === "fr" ? frontmatter.summaryFr : frontmatter.summary;
            const href = `/${locale}/writing/${slug}`;

            return (
              <article
                key={slug}
                className={`py-10 ${index === 0 ? "" : "border-t border-border"}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  <div className="flex-1 flex flex-col gap-3">
                    <time
                      className="text-xs text-ink-tertiary"
                      dateTime={frontmatter.date}
                    >
                      {new Date(frontmatter.date).toLocaleDateString(
                        locale === "fr" ? "fr-FR" : "en-US",
                        { year: "numeric", month: "long" },
                      )}
                    </time>

                    <h2 className="font-serif text-2xl font-normal tracking-tight text-ink-primary">
                      {title}
                    </h2>

                    <p className="text-sm leading-relaxed text-ink-secondary max-w-2xl">
                      {summary}
                    </p>
                  </div>

                  <div className="sm:pt-1">
                    <Link
                      href={href}
                      className="inline-flex items-center text-sm font-medium text-ink-primary hover:text-ink-secondary transition-colors whitespace-nowrap"
                    >
                      {t("readEssay")}{" "}
                      <span className="ml-2 text-ink-tertiary">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
