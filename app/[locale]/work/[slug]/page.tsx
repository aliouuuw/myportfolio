import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getWorkSlugs, compileWorkBySlug } from "@/lib/mdx";

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
    return { title, description };
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
            href={`/${locale}/work`}
            className="text-sm text-ink-tertiary hover:text-ink-secondary transition-colors"
          >
            {t("backToWork")}
          </Link>
        </nav>

        {/* Article header */}
        <header className="mb-16 pb-12 border-b border-border">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="text-xs font-medium tracking-widest uppercase text-ink-tertiary">
              {frontmatter.domain}
            </span>
            {frontmatter.confidential && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-canvas-elevated border border-border text-ink-tertiary">
                {t("confidential")}
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-ink-primary mb-6 leading-tight">
            {title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-ink-tertiary mb-8">
            <span>{frontmatter.role}</span>
            <span>·</span>
            <time dateTime={frontmatter.date}>{formattedDate}</time>
          </div>

          {frontmatter.stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {frontmatter.stack.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-xs text-ink-tertiary bg-canvas-elevated border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* MDX body */}
        <div className="max-w-2xl">{content}</div>
      </div>
    </div>
  );
}
