"use client";

import { useTranslations } from "next-intl";

export function SynthesisAboutStrip() {
  const tBg = useTranslations("HomePage.synthesis.background");
  const tCred = useTranslations("HomePage.synthesis.credentials");
  const tChess = useTranslations("HomePage.synthesis.chess");

  return (
    <div className="rounded-2xl border border-syn-border bg-syn-surface px-6 py-6 md:px-8 md:py-7">
      <p className="text-sm text-syn-ink-muted leading-relaxed max-w-3xl">
        {tBg("p1")}
      </p>
      <p className="mt-4 text-sm text-syn-ink-secondary leading-relaxed max-w-3xl">
        {tChess("body")}
      </p>
      <dl className="mt-6 flex flex-col gap-3 border-t border-syn-border pt-6 text-sm sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-3">
        <div className="min-w-[12rem]">
          <dt className="text-xs text-syn-ink-subtle uppercase tracking-wide">
            {tCred("experienceLabel")}
          </dt>
          <dd className="mt-1 text-syn-ink-muted">{tCred("experience")}</dd>
        </div>
        <div className="min-w-[12rem] flex-1">
          <dt className="text-xs text-syn-ink-subtle uppercase tracking-wide">
            {tCred("educationLabel")}
          </dt>
          <dd className="mt-1 text-syn-ink-muted">
            {tCred("educationPrimary")}
            <span className="text-syn-ink-secondary">
              {" "}
              · {tCred("educationSecondary")}
            </span>
          </dd>
        </div>
        <div className="min-w-[12rem]">
          <dt className="text-xs text-syn-ink-subtle uppercase tracking-wide">
            {tCred("certificationsLabel")}
          </dt>
          <dd className="mt-1 text-syn-ink-muted">
            {tCred("certPrimary")} · {tCred("certSecondary")}
          </dd>
        </div>
      </dl>
    </div>
  );
}
