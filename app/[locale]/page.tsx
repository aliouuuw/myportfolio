import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  HomeSynthesisPage,
} from "@/components/home-synthesis-page";
import type { SynthesisWritingEntry } from "@/components/synthesis-writing";
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

function formatWritingDate(date: string): string {
  const [year, month] = date.split("-");
  if (year && month) return `${year}·${month}`;
  return date;
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const slugs = await getWritingSlugs();
  const writing: SynthesisWritingEntry[] = (
    await Promise.all(
      slugs.map(async (slug) => {
        try {
          const fm = await readWritingFrontmatter(slug, locale);
          return {
            slug,
            title: locale === "fr" ? fm.titleFr : fm.title,
            summary: locale === "fr" ? fm.summaryFr : fm.summary,
            dateLabel: formatWritingDate(fm.date),
            sortDate: fm.date,
          };
        } catch {
          return null;
        }
      }),
    )
  )
    .filter((entry): entry is SynthesisWritingEntry & { sortDate: string } =>
      entry !== null,
    )
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
    .map(({ slug, title, summary, dateLabel }) => ({
      slug,
      title,
      summary,
      dateLabel,
    }));

  return <HomeSynthesisPage locale={locale} writing={writing} />;
}
