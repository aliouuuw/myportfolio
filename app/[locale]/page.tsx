import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CaseFileCard } from "@/components/case-file-card";
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

  // Fetch latest essay for the field note teaser
  const writingSlugs = await getWritingSlugs();
  const latestEssay =
    writingSlugs.length > 0
      ? await readWritingFrontmatter(writingSlugs[0], locale)
      : null;

  // Case files data per design-shape-v3.md
  const caseFiles = [
    {
      fileRef: "CF-001",
      classification: "CONFIDENTIAL" as const,
      titleKey: "everestTitle",
      metaKey: "everestMeta",
      summaryKey: "everestSummary",
      status: "ACTIVE" as const,
      href: `/${locale}/work/everest-finance`,
      stagger: 0,
    },
    {
      fileRef: "CF-002",
      classification: "OPEN SOURCE" as const,
      titleKey: "odooTitle",
      metaKey: "odooMeta",
      summaryKey: "odooSummary",
      status: "SHIPPED" as const,
      href: `/${locale}/work/odoo-testing-toolkit`,
      stagger: 1,
    },
    {
      fileRef: "CF-003",
      classification: "RETROSPECTIVE" as const,
      titleKey: "bocalbunTitle",
      metaKey: "bocalbunMeta",
      summaryKey: "bocalbunSummary",
      status: "ARCHIVED" as const,
      href: `/${locale}/work/bocalbun-retrospective`,
      stagger: 2,
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      {/* ── 01 Identity Block ── */}
      <section className="px-6 pt-32 pb-16 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        {/* Name */}
        <h1 className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-normal leading-[1.1] tracking-tight text-ink-primary mb-6">
          {t("identity.name")}
        </h1>

        {/* Role */}
        <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-tertiary mb-6">
          {t("identity.role")}
        </p>

        {/* Positioning sentence */}
        <p className="text-lg sm:text-xl leading-relaxed text-ink-secondary max-w-[68ch] mb-8">
          {t("identity.positioning")}
        </p>

        {/* Currently line with pulse dot */}
        <div className="flex items-center gap-3 mb-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <p className="text-sm text-ink-secondary">
            {t("identity.currently")}
          </p>
        </div>

        {/* Two text links */}
        <div className="flex items-center gap-6">
          <Link
            href={`/${locale}/work`}
            className="text-sm text-ink-secondary hover:text-ink-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-ink-tertiary"
          >
            {t("identity.viewRecord")}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="text-sm text-ink-secondary hover:text-ink-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-ink-tertiary"
          >
            {t("identity.getInTouch")}
          </Link>
        </div>
      </section>

      {/* ── 02 Case Files ── */}
      <section className="px-6 py-16 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        <div className="flex flex-col gap-6 sm:gap-8">
          {caseFiles.map((file) => (
            <CaseFileCard
              key={file.fileRef}
              fileRef={file.fileRef}
              classification={file.classification}
              title={t(`caseFiles.${file.titleKey}`)}
              meta={t(`caseFiles.${file.metaKey}`)}
              summary={t(`caseFiles.${file.summaryKey}`)}
              status={file.status}
              href={file.href}
              stagger={file.stagger}
            />
          ))}
        </div>
      </section>

      {/* ── 03 Field Note ── */}
      <section className="px-6 py-16 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        <div className="hairline mb-8" />
        {latestEssay ? (
          <Link
            href={`/${locale}/writing/${writingSlugs[0]}`}
            className="group block py-4"
          >
            <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-tertiary mb-2">
              {t("fieldNote.label")} ·{" "}
              <time dateTime={latestEssay.date}>
                {new Date(latestEssay.date).toLocaleDateString(
                  locale === "fr" ? "fr-FR" : "en-US",
                  { month: "long", year: "numeric" }
                )}
              </time>
            </p>
            <h2 className="font-serif text-xl text-ink-primary mb-2 group-hover:text-ink-secondary transition-colors">
              {locale === "fr" ? latestEssay.titleFr : latestEssay.title}
            </h2>
            <p className="text-sm text-ink-secondary max-w-[68ch] line-clamp-2">
              {locale === "fr" ? latestEssay.summaryFr : latestEssay.summary}
            </p>
          </Link>
        ) : (
          <div className="py-4">
            <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-tertiary mb-2">
              {t("fieldNote.label")}
            </p>
            <p className="text-sm text-ink-tertiary italic">
              {t("fieldNote.placeholder")}
            </p>
          </div>
        )}
      </section>

      {/* ── 04 Contact Line ── */}
      <section className="px-6 py-16 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        <div className="hairline mb-8" />
        <p className="text-sm text-ink-secondary mb-4">{t("contact.line")}</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <a
            href="mailto:wadealiou00@gmail.com"
            className="text-sm text-ink-secondary hover:text-ink-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-ink-tertiary"
          >
            wadealiou00@gmail.com
          </a>
          <a
            href="https://wa.me/221777228845"
            className="text-sm text-ink-secondary hover:text-ink-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-ink-tertiary"
          >
            +221 77 722 88 45
          </a>
        </div>
      </section>
    </div>
  );
}
