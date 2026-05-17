import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getWorkSlugs, compileWorkBySlug } from "@/lib/mdx";
import { buildCanonical } from "@/lib/metadata";
import { CaseReportHeader } from "@/components/case-report-header";
import { CaseReportSection } from "@/components/case-report-section";
import { ScrollDiagram } from "@/components/scroll-diagram";
import { MetalPanel } from "@/components/metal-panel";

// File reference numbers by slug
const fileRefs: Record<string, { ref: string; classification: string; status: "ACTIVE" | "SHIPPED" | "ARCHIVED" }> = {
  "everest-finance": { ref: "CF-001", classification: "CONFIDENTIAL", status: "ACTIVE" },
  "odoo-testing-toolkit": { ref: "CF-002", classification: "OPEN SOURCE", status: "SHIPPED" },
  "bocalbun-retrospective": { ref: "CF-003", classification: "RETROSPECTIVE", status: "ARCHIVED" },
};

// Case files order for prev/next navigation
const caseFileOrder = ["everest-finance", "odoo-testing-toolkit", "bocalbun-retrospective"];

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
  const summaryEn = frontmatter.summary;
  const summaryFr = frontmatter.summaryFr;

  // Get file reference info
  const fileRef = fileRefs[slug] || { ref: "CF-000", classification: "CONFIDENTIAL", status: "ARCHIVED" as const };

  // Calculate prev/next
  const currentIndex = caseFileOrder.indexOf(slug);
  const prevSlug = currentIndex > 0 ? caseFileOrder[currentIndex - 1] : null;
  const nextSlug = currentIndex < caseFileOrder.length - 1 ? caseFileOrder[currentIndex + 1] : null;

  // Get prev/next file refs for display
  const prevFileRef = prevSlug ? fileRefs[prevSlug] : null;
  const nextFileRef = nextSlug ? fileRefs[nextSlug] : null;

  return (
    <div className="flex flex-col flex-1">
      {/* Case Report Header */}
      <CaseReportHeader
        fileRef={fileRef.ref}
        classification={fileRef.classification}
        status={fileRef.status}
        title={title}
        summaryEn={summaryEn}
        summaryFr={summaryFr}
      />

      {/* Report sections */}
      <div className="px-6 py-12 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        <div className="flex flex-col gap-16">
          {/* Section 01 — Situation */}
          <CaseReportSection number="01" title={t("section.situation")} delay={0}>
            {content}
          </CaseReportSection>

          {/* Section 02 — Constraints (placeholder for now, content comes from MDX) */}
          <CaseReportSection number="02" title={t("section.constraints")} delay={80}>
            <p className="text-ink-tertiary italic">
              {t("section.comingSoon")}
            </p>
          </CaseReportSection>

          {/* Section 03 — System (with scroll diagram) */}
          <CaseReportSection number="03" title={t("section.system")} delay={160}>
            <ScrollDiagram
              ariaDescription="System architecture diagram showing the relationship between frontend application, API gateway, core services, CRM integration, and database."
            />
            <p className="mt-6 text-ink-tertiary italic">
              {t("section.comingSoon")}
            </p>
          </CaseReportSection>

          {/* Section 04 — What shipped */}
          <CaseReportSection number="04" title={t("section.shipped")} delay={240}>
            <p className="text-ink-tertiary italic">
              {t("section.comingSoon")}
            </p>
          </CaseReportSection>

          {/* Section 05 — Outcome */}
          <CaseReportSection number="05" title={t("section.outcome")} delay={320}>
            <p className="text-ink-tertiary italic">
              {t("section.comingSoon")}
            </p>
          </CaseReportSection>

          {/* Section 06 — What I would do differently */}
          <CaseReportSection number="06" title={t("section.lessons")} delay={400}>
            <p className="text-ink-tertiary italic">
              {t("section.comingSoon")}
            </p>
          </CaseReportSection>
        </div>
      </div>

      {/* Prev/Next navigation with MetalPanel */}
      <nav className="px-6 py-16 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
        <div className="hairline mb-8" />
        <div className="flex flex-col sm:flex-row gap-4">
          {prevSlug && prevFileRef ? (
            <Link
              href={`/${locale}/work/${prevSlug}`}
              className="flex-1 group focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-[6px]"
            >
              <MetalPanel as="div" className="magnetic-lift">
                <div className="p-5">
                  <p className="font-mono text-[10px] text-ink-tertiary mb-2">
                    ← {prevFileRef.ref}
                  </p>
                  <p className="font-serif text-base text-ink-secondary group-hover:text-ink-primary transition-colors">
                    {t(`caseFiles.${prevSlug.replace(/-/g, "")}Title`)}
                  </p>
                </div>
              </MetalPanel>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextSlug && nextFileRef ? (
            <Link
              href={`/${locale}/work/${nextSlug}`}
              className="flex-1 group focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-[6px]"
            >
              <MetalPanel as="div" className="magnetic-lift">
                <div className="p-5 text-right">
                  <p className="font-mono text-[10px] text-ink-tertiary mb-2">
                    {nextFileRef.ref} →
                  </p>
                  <p className="font-serif text-base text-ink-secondary group-hover:text-ink-primary transition-colors">
                    {t(`caseFiles.${nextSlug.replace(/-/g, "")}Title`)}
                  </p>
                </div>
              </MetalPanel>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* Back to work index */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/work`}
            className="text-sm text-ink-tertiary hover:text-ink-secondary transition-colors underline underline-offset-4 decoration-border hover:decoration-ink-tertiary"
          >
            {t("backToWork")}
          </Link>
        </div>
      </nav>
    </div>
  );
}
