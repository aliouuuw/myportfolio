import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getWritingSlugs, compileWritingBySlug } from "@/lib/mdx";
import { buildCanonical } from "@/lib/metadata";

export async function generateStaticParams() {
  const slugs = await getWritingSlugs();
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
    const { frontmatter } = await compileWritingBySlug(slug, locale);
    const title = locale === "fr" ? frontmatter.titleFr : frontmatter.title;
    const description =
      locale === "fr" ? frontmatter.summaryFr : frontmatter.summary;
    return {
      title,
      description,
      alternates: {
        canonical: buildCanonical(locale, `/writing/${slug}`),
      },
    };
  } catch {
    return {};
  }
}

export default async function WritingSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("WritingPage");

  let content: React.ReactElement;
  let frontmatter: Awaited<ReturnType<typeof compileWritingBySlug>>["frontmatter"];

  try {
    const result = await compileWritingBySlug(slug, locale);
    content = result.content;
    frontmatter = result.frontmatter;
  } catch {
    notFound();
  }

  const title = locale === "fr" ? frontmatter.titleFr : frontmatter.title;
  const summary = locale === "fr" ? frontmatter.summaryFr : frontmatter.summary;
  const formattedDate = new Date(frontmatter.date).toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long" },
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="px-6 py-16 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        {/* Back link */}
        <nav className="mb-12">
          <Link
            href={`/${locale}/writing`}
            className="text-sm text-ink-tertiary hover:text-ink-secondary transition-colors"
          >
            {t("backToWriting")}
          </Link>
        </nav>

        {/* Article header */}
        <header className="mb-16 pb-12 border-b border-border">
          <time
            className="text-xs text-ink-tertiary mb-5 block"
            dateTime={frontmatter.date}
          >
            {formattedDate}
          </time>

          <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-ink-primary mb-6 leading-tight">
            {title}
          </h1>

          <p className="text-base text-ink-secondary leading-relaxed max-w-2xl">
            {summary}
          </p>
        </header>

        {/* MDX body */}
        <div className="max-w-2xl">{content}</div>
      </div>
    </div>
  );
}
