import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CaseStudyHeader } from "@/components/case-study-header";
import { CaseStudyProofStrip } from "@/components/case-study-proof-strip";
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
    <div className="site-synthesis site-synthesis-inner flex min-h-dvh flex-1 flex-col pb-16">
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

      <CaseStudyProofStrip outcome={frontmatter.outcome} />

      <article className="mx-auto w-full max-w-5xl px-6 pb-12 pt-8 sm:px-12 lg:px-24">
        <div className="hairline mb-10" />
        <div className="max-w-[68ch]">{content}</div>
      </article>

      {(prev || next) && (
        <nav
          className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-12 lg:px-24"
          aria-label={t("caseNavAria")}
        >
          <div className="hairline mb-8" />
          <div className="grid gap-0 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-syn-border border-y border-syn-border">
            {prev ? (
              <Link
                href={`/${locale}/work/${prev.slug}`}
                className="group flex flex-col gap-2 py-6 sm:px-6 sm:first:pl-0 hover:bg-syn-row-hover transition-colors -mx-4 px-4 sm:mx-0 sm:px-6"
              >
                <p className="mono text-[10px] text-syn-ink-subtle">
                  ← {t("previous")}
                </p>
                <p className="text-base font-medium text-syn-ink-muted transition-colors group-hover:text-syn-ink">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {next ? (
              <Link
                href={`/${locale}/work/${next.slug}`}
                className="group flex flex-col gap-2 py-6 sm:px-6 sm:text-right hover:bg-syn-row-hover transition-colors -mx-4 px-4 sm:mx-0"
              >
                <p className="mono text-[10px] text-syn-ink-subtle">
                  {t("next")} →
                </p>
                <p className="text-base font-medium text-syn-ink-muted transition-colors group-hover:text-syn-ink">
                  {next.title}
                </p>
              </Link>
            ) : null}
          </div>
        </nav>
      )}

      <div className="mx-auto w-full max-w-5xl px-6 pb-8 text-center sm:px-12 lg:px-24">
        <Link
          href={`/${locale}/work`}
          className="mono text-xs text-syn-ink-subtle hover:text-syn-ink-muted transition-colors"
        >
          {t("backToWork")}
        </Link>
      </div>
    </div>
  );
}
