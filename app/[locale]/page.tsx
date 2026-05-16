import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CaseStudyCard } from "@/components/case-study-card";
import { Hero } from "@/components/hero";
import { getWritingSlugs, readWritingFrontmatter } from "@/lib/mdx";
import { buildCanonical } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: buildCanonical(locale, ""),
    },
  };
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("HomePage");

  // Fetch latest essay for the writing teaser
  const writingSlugs = await getWritingSlugs();
  const latestEssay =
    writingSlugs.length > 0
      ? await readWritingFrontmatter(writingSlugs[0], locale)
      : null;

  const caseStudies = [
    {
      key: "everest" as const,
      href: `/${locale}/work/everest-finance`,
    },
    {
      key: "odooToolkit" as const,
      href: `/${locale}/work/odoo-testing-toolkit`,
    },
    {
      key: "eduplan" as const,
      href: `/${locale}/work/eduplan`,
    },
  ];

  const howIWorkItems = [0, 1, 2] as const;

  return (
    <div className="flex flex-col flex-1">
      <Hero locale={locale} />

      <div className="hairline max-w-5xl mx-auto" />

      {/* ── Case Studies ── */}
      <section className="px-6 py-24 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 gap-4">
          <h2 className="text-xl font-medium tracking-tight text-ink-primary">
            {t("caseStudies.title")}
          </h2>
          <p className="text-sm text-ink-tertiary">
            {t("caseStudies.subtitle")}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map(({ key, href }) => (
            <CaseStudyCard
              key={key}
              href={href}
              category={t(`caseStudies.${key}.category`)}
              title={t(`caseStudies.${key}.title`)}
              description={t(`caseStudies.${key}.description`)}
            />
          ))}
        </div>
      </section>

      <div className="hairline max-w-5xl mx-auto" />

      {/* ── How I Work ── */}
      <section className="px-6 py-24 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        <h2 className="text-xl font-medium tracking-tight text-ink-primary mb-16">
          {t("howIWork.title")}
        </h2>
        <div className="grid gap-12 sm:grid-cols-3">
          {howIWorkItems.map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <h3 className="text-sm font-medium text-ink-primary flex items-center">
                <span className="text-ink-tertiary mr-3">0{i + 1}</span>
                {t(`howIWork.items.${i}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-ink-secondary">
                {t(`howIWork.items.${i}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="hairline max-w-5xl mx-auto" />

      {/* ── Writing Teaser ── */}
      <section className="px-6 py-24 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full flex flex-col sm:flex-row sm:items-start justify-between gap-12">
        <div className="max-w-sm">
          <h2 className="text-xl font-medium tracking-tight text-ink-primary mb-4">
            {t("writing.title")}
          </h2>
          <p className="text-sm leading-relaxed text-ink-secondary mb-8">
            {t("writing.subtitle")}
          </p>
          <Link
            href={`/${locale}/writing`}
            className="inline-flex items-center text-sm font-medium text-ink-primary hover:text-ink-secondary transition-colors"
          >
            {t("writing.cta")} <span className="ml-2 text-ink-tertiary">→</span>
          </Link>
        </div>
        <div className="flex-1 max-w-md">
          {latestEssay ? (
            <Link
              href={`/${locale}/writing/${writingSlugs[0]}`}
              className="block border border-border rounded p-6 bg-canvas-elevated hover:border-ink-tertiary/30 transition-colors"
            >
              <p className="text-xs text-ink-tertiary mb-2">
                {t("writing.latestEssay")}
              </p>
              <h3 className="font-serif text-lg text-ink-primary mb-2">
                {locale === "fr" ? latestEssay.titleFr : latestEssay.title}
              </h3>
              <p className="text-sm text-ink-secondary line-clamp-2">
                {locale === "fr" ? latestEssay.summaryFr : latestEssay.summary}
              </p>
              <span className="inline-flex items-center text-sm font-medium text-ink-primary mt-4">
                {t("writing.readEssay")} <span className="ml-2 text-ink-tertiary">→</span>
              </span>
            </Link>
          ) : (
            <div className="border border-border rounded p-6 bg-canvas-elevated">
              <p className="text-sm text-ink-tertiary italic font-serif">
                {t("writing.placeholder")}
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="hairline max-w-5xl mx-auto" />

      {/* ── Contact CTA ── */}
      <section className="px-6 py-32 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full text-center flex flex-col items-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink-primary mb-6">
          {t("contact.title")}
        </h2>
        <p className="text-lg text-ink-secondary max-w-xl mb-10 leading-relaxed">
          {t("contact.description")}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center justify-center h-10 px-8 rounded bg-ink-primary text-canvas text-sm font-medium transition-colors hover:bg-ink-secondary"
        >
          {t("contact.cta")}
        </Link>
      </section>
    </div>
  );
}
