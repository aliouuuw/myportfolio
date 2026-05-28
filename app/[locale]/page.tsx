import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { HomeSynthesisPage } from "@/components/home-synthesis-page";
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

  return <HomeSynthesisPage locale={locale} />;
}
