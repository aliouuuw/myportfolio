import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="flex flex-1 flex-col">
      <section className="shell pt-28 pb-12 sm:pt-36">
        <p className="eyebrow mb-4">{t("eyebrow")}</p>
        <h1 className="display text-[clamp(2.5rem,7vw,4.5rem)] mb-6">
          {t("title")}
        </h1>
        <p className="lede">{t("subtitle")}</p>
      </section>

      <section className="shell pb-24">
        {sorted.length === 0 ? (
          <div className="card">
            <p className="text-[15px] text-[color:var(--ink-3)] italic">
              {t("empty")}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col border-t border-[color:var(--line-1)]">
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
                <li
                  key={slug}
                  className="border-b border-[color:var(--line-1)]"
                >
                  <Link
                    href={href}
                    className="grid gap-3 py-8 sm:grid-cols-[10rem_1fr] sm:gap-8 group hover:bg-[color:var(--surface-raised)] transition-colors px-2 -mx-2 rounded"
                  >
                    <time
                      className="font-mono text-[12px] text-[color:var(--ink-3)] sm:pt-1"
                      dateTime={frontmatter.date}
                    >
                      {date}
                    </time>
                    <div>
                      <h2 className="text-[clamp(1.25rem,2.4vw,1.625rem)] font-medium tracking-tight text-[color:var(--ink-1)] group-hover:text-[color:var(--accent)] transition-colors mb-2">
                        {title}
                      </h2>
                      <p className="text-[15px] text-[color:var(--ink-2)] leading-relaxed max-w-[60ch]">
                        {summary}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-[color:var(--accent)] font-medium">
                        {t("readEssay")} <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
