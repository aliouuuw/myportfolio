"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";

export type SynthesisWritingEntry = {
  slug: string;
  title: string;
  summary: string;
  dateLabel: string;
};

type SynthesisWritingProps = {
  locale: string;
  entries: SynthesisWritingEntry[];
};

export function SynthesisWriting({ locale, entries }: SynthesisWritingProps) {
  const t = useTranslations("HomePage.synthesis.writing");

  return (
    <SynthesisRevealSection id="writing" className="pt-16 scroll-mt-28">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="mono-eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight text-syn-ink-strong">
            {t("title")}
          </h2>
        </div>
        <Link
          href={`/${locale}/writing`}
          className="text-xs text-syn-ink-secondary hover:text-syn-ink transition-colors"
        >
          {t("allLink")}
        </Link>
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-syn-ink-subtle">{t("empty")}</p>
      ) : (
        <div className="divide-y divide-syn-border border-y border-syn-border">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/${locale}/writing/${entry.slug}`}
              className="group flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-8 py-6 hover:bg-syn-row-hover transition-colors -mx-4 px-4 rounded-lg"
            >
              <span className="mono text-xs text-syn-ink-subtle w-16 shrink-0">
                {entry.dateLabel}
              </span>
              <div className="flex-1">
                <h3 className="text-base font-medium text-syn-ink-strong group-hover:text-syn-ink mb-1">
                  {entry.title}
                </h3>
                <p className="text-sm text-syn-ink-secondary leading-relaxed max-w-2xl">
                  {entry.summary}
                </p>
              </div>
              <span className="text-syn-ink-faint group-hover:text-syn-ink-muted transition-colors shrink-0">
                ↗
              </span>
            </Link>
          ))}
        </div>
      )}
    </SynthesisRevealSection>
  );
}
