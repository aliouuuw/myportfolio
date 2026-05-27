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
        className="systems-map-link group"
      >
        <span className="systems-map-link-label">{label}</span>
        <span className="systems-map-link-arrow" aria-hidden>
          →
        </span>
      </Link>
    );
  }

  return (
    <span className="systems-map-static">
      <span className="systems-map-static-label">{label}</span>
    </span>
  );
}

export function SystemsMapSection({ locale }: SystemsMapSectionProps) {
  const t = useTranslations("SystemsMap");
  const workHref = `/${locale}/work`;

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

        <div className="systems-map reveal-up">
          <div className="systems-map-hub-wrap">
            <div className="systems-map-hub">
              <p className="systems-map-hub-label">{t("centerLabel")}</p>
              <p className="systems-map-hub-role">{t("centerRole")}</p>
            </div>
            <div className="systems-map-connector" aria-hidden />
          </div>

          <div className="systems-map-spokes">
            {SYSTEMS_MAP_COLUMNS.map((col, colIndex) => (
              <article
                key={col.id}
                className="systems-map-spoke"
                aria-labelledby={`systems-spoke-${col.id}`}
              >
                <header className="systems-map-spoke-head">
                  <span className="systems-map-spoke-index" aria-hidden>
                    {String(colIndex + 1).padStart(2, "0")}
                  </span>
                  <h3
                    id={`systems-spoke-${col.id}`}
                    className="systems-map-spoke-title"
                  >
                    {t(col.titleKey)}
                  </h3>
                </header>
                <ul className="systems-map-items">
                  {col.items.map((item) => (
                    <li key={item.labelKey}>
                      <MapItem locale={locale} item={item} t={t} />
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="systems-map-foot section-foot">
            <Link href={workHref} className="link-subtle label-sm">
              {t("viewAllWork")}
              <span aria-hidden> →</span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
