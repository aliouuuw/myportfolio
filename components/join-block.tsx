"use client";

import { useTranslations } from "next-intl";

interface JoinBlockProps {
  bookHref: string;
}

export function JoinBlock({ bookHref }: JoinBlockProps) {
  const t = useTranslations("JoinBlock");

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
          <article className="join-entry">
            <h3 className="heading text-lg md:text-xl">{t("everestName")}</h3>
            <p className="join-entry-blurb">{t("everestBlurb")}</p>
          </article>
          <article className="join-entry">
            <h3 className="heading text-lg md:text-xl">{t("odooName")}</h3>
            <p className="join-entry-blurb">{t("odooBlurb")}</p>
          </article>
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
