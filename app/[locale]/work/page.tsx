import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { buildCanonical } from "@/lib/metadata";
import { FileReferenceRow } from "@/components/file-reference-row";
import type { FileReferenceStatus } from "@/components/file-reference-row";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("workTitle"),
    description: t("workDescription"),
    alternates: {
      canonical: buildCanonical(locale, "/work"),
    },
  };
}

// Static case file data — matches design-shape-v3.md §5
const caseFiles: {
  fileRef: string;
  slug: string;
  titleKey: string;
  domain: string;
  year: string;
  status: FileReferenceStatus;
}[] = [
  {
    fileRef: "CF-001",
    slug: "everest-finance",
    titleKey: "everestTitle",
    domain: "Fintech Ops",
    year: "2024–present",
    status: "ACTIVE",
  },
  {
    fileRef: "CF-002",
    slug: "odoo-testing-toolkit",
    titleKey: "odooTitle",
    domain: "ERP Systems",
    year: "2023",
    status: "SHIPPED",
  },
  {
    fileRef: "CF-003",
    slug: "bocalbun-retrospective",
    titleKey: "bocalbunTitle",
    domain: "Judgment",
    year: "2022",
    status: "ARCHIVED",
  },
];

export default async function WorkPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("WorkPage");

  return (
    <div className="flex flex-col flex-1 px-6 py-24 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
      <header className="mb-16">
        <h1 className="font-serif text-4xl font-normal tracking-tight text-ink-primary mb-3">
          {t("title")}
        </h1>
        <p className="text-sm text-ink-secondary">{t("subtitle")}</p>
      </header>

      {/* File cabinet list */}
      <div className="flex flex-col divide-y divide-border">
        {caseFiles.map((file) => (
          <FileReferenceRow
            key={file.fileRef}
            fileRef={file.fileRef}
            title={t(`caseFiles.${file.titleKey}`)}
            domain={file.domain}
            year={file.year}
            status={file.status}
            href={`/${locale}/work/${file.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
