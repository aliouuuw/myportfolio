import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { getWorkSlugs, readWorkFrontmatter } from "@/lib/mdx";
import { buildCanonical } from "@/lib/metadata";
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

function localized(
  locale: string,
  en: string,
  fr: string,
): string {
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

  const allSlugs = await getWorkSlugs();
  const featuredSet = new Set<string>(FEATURED_WORK_SLUGS);
  const otherSlugs = allSlugs.filter((s) => !featuredSet.has(s));

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

  return (
    <div className="site-ledger mx-auto flex w-full max-w-[var(--n-page)] flex-1 flex-col px-[var(--n-gutter)] py-24 text-[var(--n-fg)]">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-serif text-4xl font-normal tracking-tight mb-3">
          {t("title")}
        </h1>
        <p className="text-[var(--n-fg-secondary)] leading-relaxed">
          {t("subtitle")}
        </p>
      </header>

      <ul className="work-accordion flex flex-col border-t border-[color:var(--n-border)]">
        {featured.map((entry) => (
          <li key={entry.slug} className="border-b border-[color:var(--n-border)]">
            <Link
              href={`/${locale}/work/${entry.slug}`}
              className="flex flex-wrap items-baseline justify-between gap-3 py-5 transition-colors hover:bg-[var(--n-bg-surface)] min-h-[44px] px-1 -mx-1"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium tracking-tight truncate">
                  {entry.title}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--n-fg-muted)] mt-1">
                  {entry.domain}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0 font-mono text-[11px] text-[var(--n-fg-muted)]">
                <span className="hidden sm:inline">{entry.period}</span>
                <span
                  className={`work-accordion-status ${entry.status} uppercase text-[10px] tracking-wider`}
                >
                  {t(statusLabelKey[entry.status])}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {other.length > 0 ? (
        <>
          <p className="label mt-12 mb-4">{t("moreWork")}</p>
          <ul className="flex flex-col divide-y divide-[color:var(--n-border)] border-t border-[color:var(--n-border)]">
            {other.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/${locale}/work/${entry.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-3 py-4 text-[var(--n-fg-secondary)] hover:text-[var(--n-fg)] transition-colors min-h-[44px]"
                >
                  <span>{entry.title}</span>
                  <span className="font-mono text-[10px] text-[var(--n-fg-muted)]">
                    {entry.domain}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <p className="mt-12">
        <Link href={`/${locale}`} className="link-subtle label-sm">
          ← {t("backToHome")}
        </Link>
      </p>
    </div>
  );
}
