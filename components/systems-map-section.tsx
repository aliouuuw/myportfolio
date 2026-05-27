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

function MapItem({
  locale,
  item,
  t,
}: {
  locale: string;
  item: SystemsMapItem;
  t: ReturnType<typeof useTranslations<"SystemsMap">>;
}) {
  const label = t(item.labelKey);
  if (item.workSlug) {
    return (
      <Link
        href={`/${locale}/work/${item.workSlug}`}
        className="systems-map-item link-subtle text-sm text-[var(--n-fg-secondary)] hover:text-[var(--n-fg)]"
      >
        {label}
      </Link>
    );
  }
  return (
    <span className="systems-map-item text-sm text-[var(--n-fg-muted)]">
      {label}
    </span>
  );
}

export function SystemsMapSection({ locale }: SystemsMapSectionProps) {
  const t = useTranslations("SystemsMap");

  return (
    <section
      id="systems"
      className="section-block border-t border-[color:var(--n-border)]"
      aria-labelledby="systems-map-heading"
    >
      <div className="page-inner">
        <header className="section-head reveal-up">
          <span className="label">{t("eyebrow")}</span>
          <h2
            id="systems-map-heading"
            className="heading section-head-title"
          >
            {t("title")}
          </h2>
          <p className="section-head-lead">{t("lead")}</p>
        </header>

        <div className="systems-map reveal-up mt-10" role="list">
          <div className="systems-map-center" role="presentation">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--n-fg-muted)]">
              {t("centerLabel")}
            </p>
            <p className="mt-1 font-medium tracking-tight text-[var(--n-fg)]">
              {t("centerRole")}
            </p>
          </div>

          <div
            className="systems-map-columns mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            role="list"
          >
            {SYSTEMS_MAP_COLUMNS.map((col) => (
              <div
                key={col.id}
                className="systems-map-column border-t border-[color:var(--n-border)] pt-4"
                role="listitem"
              >
                <p className="label-sm mb-3 text-[var(--n-fg-muted)]">
                  {t(col.titleKey)}
                </p>
                <ul className="flex flex-col gap-2">
                  {col.items.map((item) => (
                    <li key={item.labelKey}>
                      <MapItem locale={locale} item={item} t={t} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
