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
    <div className="page-shell">
      <div className="page-shell-inner">
        <header className="mb-12 max-w-2xl">
          <Link
            href={`/${locale}/writing`}
            className="inline-block text-[13px] text-ink-tertiary hover:text-ink-primary underline decoration-border hover:decoration-accent underline-offset-4 transition-colors mb-8"
          >
            ← {t("backToWriting")}
          </Link>

          <p className="label-micro mb-4">
            <time dateTime={frontmatter.date}>{formattedDate}</time>
          </p>

          <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal tracking-tight text-ink-primary leading-tight mb-4 max-w-[20ch]">
            {title}
          </h1>

          <p className="text-base text-ink-secondary leading-relaxed max-w-[68ch]">
            {summary}
          </p>
        </header>

        <article className="pb-12">
          <hr className="hairline mb-12" />
          <div className="max-w-[68ch]">{content}</div>
        </article>
      </div>
    </div>
  );
}
