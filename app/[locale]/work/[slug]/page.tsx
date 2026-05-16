import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { compileWorkBySlug, getWorkSlugs } from "@/lib/mdx";
import { routing } from "@/i18n/routing";

type WorkCasePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getWorkSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export default async function WorkCasePage({ params }: WorkCasePageProps) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  let result: Awaited<ReturnType<typeof compileWorkBySlug>>;
  try {
    result = await compileWorkBySlug(slug);
  } catch {
    notFound();
  }

  const { content, frontmatter } = result;
  const title = locale === "fr" ? frontmatter.titleFr : frontmatter.title;
  const summary =
    locale === "fr" ? frontmatter.summaryFr : frontmatter.summary;

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-12 lg:px-24">
      <header className="mb-12 border-b border-border pb-10">
        <p className="text-xs font-medium tracking-widest uppercase text-ink-tertiary tabular-nums">
          {frontmatter.domain} — {frontmatter.date}
        </p>
        <h1 className="font-serif mt-4 text-3xl font-normal tracking-tight text-ink-primary sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-ink-secondary leading-relaxed">
          {summary}
        </p>
        <p className="mt-4 text-sm text-ink-tertiary">{frontmatter.role}</p>
        {frontmatter.confidential ? (
          <p className="mt-6 text-xs text-ink-muted">
            {locale === "fr"
              ? "Contenu présenté de façon anonymisée."
              : "Content presented in an anonymized form."}
          </p>
        ) : null}
      </header>
      <div className="mdx-body">{content}</div>
    </article>
  );
}
