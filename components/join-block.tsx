"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface OpenProject {
  id: string;
  nameKey: string;
  domainKey: string;
  progress: number;
  seats: number;
  blurbKey: string;
}

const OPEN_PROJECTS: OpenProject[] = [
  {
    id: "everest-consolidation",
    nameKey: "everestName",
    domainKey: "everestDomain",
    progress: 62,
    seats: 1,
    blurbKey: "everestBlurb",
  },
  {
    id: "odoo-toolkit-v2",
    nameKey: "odooName",
    domainKey: "odooDomain",
    progress: 28,
    seats: 2,
    blurbKey: "odooBlurb",
  },
];

interface JoinBlockProps {
  /** Homepage #contact anchor or full contact page URL */
  bookHref: string;
}

export function JoinBlock({ bookHref }: JoinBlockProps) {
  const t = useTranslations("JoinBlock");
  const [requested, setRequested] = useState<Record<string, boolean>>({});

  return (
    <section
      id="join"
      className="section-block border-t border-[color:var(--n-border)]"
    >
      <div className="page-inner">
        <header className="section-head">
          <span className="label">{t("eyebrow")}</span>
          <h2 className="heading section-head-title">{t("title")}</h2>
          <p className="section-head-lead">{t("lead")}</p>
        </header>

        <div className="join-list">
          {OPEN_PROJECTS.map((p) => (
            <article key={p.id} className="join-entry">
              <div className="join-entry-head">
                <h3 className="heading text-lg md:text-xl">{t(p.nameKey)}</h3>
                <span className="label">
                  {t("seats", { count: p.seats })} · {t(p.domainKey)}
                </span>
              </div>
              <p className="join-entry-blurb">{t(p.blurbKey)}</p>

              <div className="join-entry-foot">
                <div className="progress join-progress">
                  <div
                    className="progress-fill"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
                <span className="label-sm text-[color:var(--n-fg-muted)]">
                  {p.progress}%
                </span>
                <button
                  type="button"
                  onClick={() => setRequested((r) => ({ ...r, [p.id]: true }))}
                  className="btn join-request"
                  disabled={requested[p.id]}
                >
                  {requested[p.id] ? t("requestSent") : t("requestSeat")}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="section-foot">
          <a href={bookHref} className="btn btn-primary">
            {t("bookEngagement")}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
