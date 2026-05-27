"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

interface JoinBlockProps {
  bookHref: string;
}

export function JoinBlock({ bookHref }: JoinBlockProps) {
  const t = useTranslations("JoinBlock");

  return (
    <section
      id="join"
      className="section-block border-t border-border"
    >
      <div className="page-inner">
        <header className="section-head reveal-up">
          <span className="label">{t("eyebrow")}</span>
          <h2 className="heading section-head-title">{t("title")}</h2>
          <p className="section-head-lead">{t("lead")}</p>
        </header>

        <div className="reveal-up grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-canvas-elevated/50 p-5">
            <h3 className="mb-2 font-medium text-ink-primary">
              {t("everestName")}
            </h3>
            <p className="text-sm leading-relaxed text-ink-secondary">
              {t("everestBlurb")}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-canvas-elevated/50 p-5">
            <h3 className="mb-2 font-medium text-ink-primary">
              {t("odooName")}
            </h3>
            <p className="text-sm leading-relaxed text-ink-secondary">
              {t("odooBlurb")}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href={bookHref}
            className="btn btn-primary"
          >
            {t("bookEngagement")}
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
