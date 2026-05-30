import type { Metadata } from "next";
import { TransitionLink } from "@/components/transition-link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { WorkFreelanceList } from "@/components/work-freelance-list";
import { WorkIndexList } from "@/components/work-index-list";
import { routing } from "@/i18n/routing";
import { getWorkSlugs, readWorkFrontmatter } from "@/lib/mdx";
import { buildCanonical } from "@/lib/metadata";
import {
  featuredWorkIndexId,
} from "@/lib/synthesis-work-index";
import { sortSupportingSlugs } from "@/lib/work-index-order";
import {
  FEATURED_WORK_SLUGS,
  type WorkLedgerStatus,
} from "@/lib/work-ledger-types";

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

function localized(locale: string, en: string, fr: string): string {
  return locale === "fr" ? fr : en;
}

const statusLabelKey: Record<
  WorkLedgerStatus,
  "statusActive" | "statusShipped" | "statusArchived"
> = {
  active: "statusActive",
  shipped: "statusShipped",
  archived: "statusArchived",
};

export default async function WorkPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("WorkPage");
  const tWork = await getTranslations("HomePage.synthesis.work");

  const allSlugs = await getWorkSlugs();
  const featuredSet = new Set<string>(FEATURED_WORK_SLUGS);
  const otherSlugs = sortSupportingSlugs(
    allSlugs.filter((s) => !featuredSet.has(s)),
  );

  const featured = await Promise.all(
    FEATURED_WORK_SLUGS.map(async (slug) => {
      const fm = await readWorkFrontmatter(slug, locale);
      const status = fm.status ?? "shipped";
      return {
        slug,
        title: localized(locale, fm.title, fm.titleFr),
        domain: fm.domain,
        period: fm.period ?? fm.date,
        status,
        indexId: featuredWorkIndexId(slug),
      };
    }),
  );

  const other = await Promise.all(
    otherSlugs.map(async (slug) => {
      const fm = await readWorkFrontmatter(slug, locale);
      const status = fm.status ?? "shipped";
      return {
        slug,
        title: localized(locale, fm.title, fm.titleFr),
        domain: fm.domain,
        period: fm.period ?? fm.date,
        status,
      };
    }),
  );

  const statusLabels: Record<WorkLedgerStatus, string> = {
    active: t(statusLabelKey.active),
    shipped: t(statusLabelKey.shipped),
    archived: t(statusLabelKey.archived),
  };

  return (
    <div className="site-synthesis site-synthesis-inner min-h-dvh pb-20">
      <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-6 md:px-6 lg:px-8 xl:pl-24">
        <header className="mb-12 max-w-2xl">
          <p className="mono-eyebrow mb-3">{t("indexEyebrow")}</p>
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-medium tracking-tight text-syn-ink-strong mb-4">
            {t("title")}
          </h1>
          <p className="text-syn-ink-secondary leading-relaxed">{t("subtitle")}</p>
        </header>

        <WorkIndexList
          locale={locale}
          featured={featured}
          other={other}
          statusLabels={statusLabels}
          featuredEyebrow={tWork("eyebrow")}
          featuredTitle={tWork("title")}
          featuredAside={tWork("lead")}
          moreLabel={t("moreWork")}
        />

        <WorkFreelanceList />

        <p className="mt-14">
          <TransitionLink
            href={`/${locale}`}
            className="mono text-xs text-syn-ink-subtle hover:text-syn-ink-muted transition-colors"
          >
            ← {t("backToHome")}
          </TransitionLink>
        </p>
      </div>
    </div>
  );
}
