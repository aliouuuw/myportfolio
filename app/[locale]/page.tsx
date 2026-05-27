import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomeLedgerPage } from "@/components/home-ledger-page";
import { FLAGSHIP_ESSAY_SLUG } from "@/lib/work-ledger-types";
import { getWorkLedgerProjects } from "@/lib/work-ledger";
import { readWritingFrontmatter } from "@/lib/mdx";
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

  const projects = await getWorkLedgerProjects(locale);

  let essay: { title: string; summary: string } | null = null;
  try {
    const fm = await readWritingFrontmatter(FLAGSHIP_ESSAY_SLUG, locale);
    essay = {
      title: locale === "fr" ? fm.titleFr : fm.title,
      summary: locale === "fr" ? fm.summaryFr : fm.summary,
    };
  } catch {
    essay = null;
  }

  return (
    <HomeLedgerPage locale={locale} projects={projects} essay={essay} />
  );
}
