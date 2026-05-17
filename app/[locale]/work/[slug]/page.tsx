import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getWorkSlugs, compileWorkBySlug } from "@/lib/mdx";
import { buildCanonical } from "@/lib/metadata";
import { CaseReportHeader } from "@/components/case-report-header";
import { MetalPanel } from "@/components/metal-panel";

// File reference numbers by slug
const fileRefs: Record<
  string,
  {
    ref: string;
    classification: string;
    status: "ACTIVE" | "SHIPPED" | "ARCHIVED";
  }
> = {
  "everest-finance": {
    ref: "CF-001",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
  },
  "odoo-testing-toolkit": {
    ref: "CF-002",
    classification: "OPEN SOURCE",
    status: "SHIPPED",
  },
  "bocalbun-retrospective": {
    ref: "CF-003",
    classification: "RETROSPECTIVE",
    status: "ARCHIVED",
  },
};

const caseFileOrder = [
  "everest-finance",
  "odoo-testing-toolkit",
  "bocalbun-retrospective",
];

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

  const fileRef = fileRefs[slug] ?? {
    ref: "CF-000",
    classification: "CONFIDENTIAL",
    status: "ARCHIVED" as const,
  };

  const currentIndex = caseFileOrder.indexOf(slug);
  const prevSlug = currentIndex > 0 ? caseFileOrder[currentIndex - 1] : null;
  const nextSlug =
    currentIndex >= 0 && currentIndex < caseFileOrder.length - 1
      ? caseFileOrder[currentIndex + 1]
      : null;
  const prevFileRef = prevSlug ? fileRefs[prevSlug] : null;
  const nextFileRef = nextSlug ? fileRefs[nextSlug] : null;

  return (
    <div className="flex flex-1 flex-col">
      <CaseReportHeader
        fileRef={fileRef.ref}
        classification={fileRef.classification}
        status={fileRef.status}
        title={title}
        summaryEn={summaryEn}
        summaryFr={summaryFr}
      />

      {/* Report body — MDX content with prose styling from mdx-components.tsx */}
      <article className="mx-auto w-full max-w-5xl px-6 pb-12 pt-4 sm:px-12 lg:px-24">
        <div className="hairline mb-10" />
        <div className="max-w-[68ch]">{content}</div>
      </article>

      {/* Prev / Next navigation */}
      <nav className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-12 lg:px-24">
        <div className="hairline mb-8" />
        <div className="flex flex-col gap-4 sm:flex-row">
          {prevSlug && prevFileRef ? (
            <Link
              href={`/${locale}/work/${prevSlug}`}
              className="group flex-1 rounded-[6px] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <MetalPanel as="div" className="magnetic-lift">
                <div className="p-5">
                  <p className="mb-2 font-mono text-[10px] text-ink-tertiary">
                    ← {prevFileRef.ref}
                  </p>
                  <p className="font-serif text-base text-ink-secondary transition-colors group-hover:text-ink-primary">
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
              className="group flex-1 rounded-[6px] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <MetalPanel as="div" className="magnetic-lift">
                <div className="p-5 text-right">
                  <p className="mb-2 font-mono text-[10px] text-ink-tertiary">
                    {nextFileRef.ref} →
                  </p>
                  <p className="font-serif text-base text-ink-secondary transition-colors group-hover:text-ink-primary">
                    {t(`caseFiles.${nextSlug.replace(/-/g, "")}Title`)}
                  </p>
                </div>
              </MetalPanel>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/work`}
            className="text-sm text-ink-tertiary underline decoration-border underline-offset-4 transition-colors hover:text-ink-secondary hover:decoration-ink-tertiary"
          >
            {t("backToWork")}
          </Link>
        </div>
      </nav>
    </div>
  );
}
