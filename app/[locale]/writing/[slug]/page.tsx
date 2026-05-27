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
    <div className="flex flex-1 flex-col">
      <header className="shell pt-28 pb-12 sm:pt-36">
        <Link
          href={`/${locale}/writing`}
          className="link-muted text-[13px] mb-8 inline-block"
        >
          ← {t("backToWriting")}
        </Link>

        <p className="eyebrow mb-4">
          <time dateTime={frontmatter.date}>{formattedDate}</time>
        </p>

        <h1 className="display text-[clamp(2.25rem,5vw,3.75rem)] mb-6 max-w-[20ch]">
          {title}
        </h1>

        <p className="lede max-w-[60ch]">{summary}</p>
      </header>

      <article className="shell pb-24">
        <hr className="hairline mb-12" />
        <div className="prose-editorial">{content}</div>
      </article>
    </div>
  );
}
