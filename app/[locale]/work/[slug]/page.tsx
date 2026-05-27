import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CaseStudyHeader } from "@/components/case-study-header";
import { routing } from "@/i18n/routing";
import { getWorkSlugs, compileWorkBySlug } from "@/lib/mdx";
import { buildCanonical } from "@/lib/metadata";
import { getFeaturedCaseStudyNav } from "@/lib/work-navigation";

export async function generateStaticParams() {
  const slugs = await getWorkSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const { frontmatter } = await compileWorkBySlug(slug, locale);
    const title = locale === "fr" ? frontmatter.titleFr : frontmatter.title;
    const description =
      locale === "fr" ? frontmatter.summaryFr : frontmatter.summary;
    return {
      title,
      description,
      alternates: {
        canonical: buildCanonical(locale, `/work/${slug}`),
      },
    };
  } catch {
    return {};
  }
}

export default async function WorkSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("WorkPage");

  let content: React.ReactElement;
  let frontmatter: Awaited<ReturnType<typeof compileWorkBySlug>>["frontmatter"];

  try {
    const result = await compileWorkBySlug(slug, locale);
    content = result.content;
    frontmatter = result.frontmatter;
  } catch {
    notFound();
  }

  const title = locale === "fr" ? frontmatter.titleFr : frontmatter.title;
  const summary =
    locale === "fr" ? frontmatter.summaryFr : frontmatter.summary;

  const { prev, next } = await getFeaturedCaseStudyNav(locale, slug);

  const statusKey = frontmatter.status;
  const statusLabel = statusKey
    ? t(
        statusKey === "active"
          ? "statusActive"
          : statusKey === "shipped"
            ? "statusShipped"
            : "statusArchived",
      )
    : undefined;

  return (
    <div className="flex flex-1 flex-col">
      <CaseStudyHeader
        title={title}
        summary={summary}
        role={frontmatter.role}
        domain={frontmatter.domain}
        period={frontmatter.period}
        status={frontmatter.status}
        statusLabel={statusLabel}
        roleLabel={t("roleLabel")}
        stackLabel={t("stackLabel")}
        stack={frontmatter.stack}
        confidential={frontmatter.confidential}
        confidentialLabel={t("confidential")}
      />

      <article className="mx-auto w-full max-w-5xl px-6 pb-12 sm:px-12 lg:px-24">
        <div className="hairline mb-10" />
        <div className="max-w-[68ch]">{content}</div>
      </article>

      {(prev || next) && (
        <nav
          className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-12 lg:px-24"
          aria-label={t("caseNavAria")}
        >
          <div className="flex flex-col border-t border-border">
            {prev && (
              <Link
                href={`/${locale}/work/${prev.slug}`}
                className="group flex items-center justify-between gap-4 border-b border-border py-4 transition-colors hover:bg-canvas-elevated -mx-2 px-2 rounded"
              >
                <span className="font-mono text-[10px] text-ink-tertiary shrink-0">
                  ← {t("previous")}
                </span>
                <span className="text-sm text-ink-secondary transition-colors group-hover:text-ink-primary truncate">
                  {prev.title}
                </span>
              </Link>
            )}
            {next && (
              <Link
                href={`/${locale}/work/${next.slug}`}
                className="group flex items-center justify-between gap-4 border-b border-border py-4 transition-colors hover:bg-canvas-elevated -mx-2 px-2 rounded"
              >
                <span className="text-sm text-ink-secondary transition-colors group-hover:text-ink-primary truncate">
                  {next.title}
                </span>
                <span className="font-mono text-[10px] text-ink-tertiary shrink-0">
                  {t("next")} →
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}

      <div className="mx-auto w-full max-w-5xl px-6 pb-16 text-center sm:px-12 lg:px-24">
        <Link
          href={`/${locale}/work`}
          className="text-sm text-ink-tertiary underline decoration-border underline-offset-4 transition-colors hover:text-ink-secondary"
        >
          {t("backToWork")}
        </Link>
      </div>
    </div>
  );
}
