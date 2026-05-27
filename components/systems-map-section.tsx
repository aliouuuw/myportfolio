"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  SYSTEMS_MAP_COLUMNS,
  type SystemsMapItem,
} from "@/lib/systems-map-data";

interface SystemsMapSectionProps {
  locale: string;
}

function SystemItem({
  locale,
  item,
}: {
  locale: string;
  item: SystemsMapItem;
}) {
  const t = useTranslations("SystemsMap");
  const label = t(item.labelKey);

  if (item.workSlug) {
    return (
      <Link
        href={`/${locale}/work/${item.workSlug}`}
        className="group flex items-center justify-between py-3 text-sm text-ink-secondary transition-colors hover:text-ink-primary"
      >
        <span>{label}</span>
        <span className="text-ink-muted transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    );
  }

  return (
    <span className="flex items-center py-3 text-sm text-ink-muted">
      {label}
    </span>
  );
}

export function SystemsMapSection({ locale }: SystemsMapSectionProps) {
  const t = useTranslations("SystemsMap");
  const workHref = `/${locale}/work`;

  return (
    <section
      id="systems"
      className="section-block border-t border-border"
      aria-labelledby="systems-heading"
    >
      <div className="page-inner">
        <header className="section-head reveal-up">
          <span className="label">{t("eyebrow")}</span>
          <h2 id="systems-heading" className="heading section-head-title">
            {t("title")}
          </h2>
          <p className="section-head-lead">{t("lead")}</p>
        </header>

        <div className="reveal-up">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SYSTEMS_MAP_COLUMNS.map((col) => (
              <div key={col.id}>
                <h3 className="mb-4 font-mono text-[10px] uppercase tracking-wider text-ink-tertiary">
                  {t(col.titleKey)}
                </h3>
                <ul className="divide-y divide-border border-t border-border">
                  {col.items.map((item) => (
                    <li key={item.labelKey}>
                      <SystemItem locale={locale} item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10">
            <Link
              href={workHref}
              className="inline-flex items-center gap-2 text-sm text-ink-secondary transition-colors hover:text-ink-primary"
            >
              {t("viewAllWork")}
              <span>→</span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
