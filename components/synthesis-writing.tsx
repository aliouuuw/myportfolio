"use client";

import { TransitionLink } from "@/components/transition-link";
import { useTranslations } from "next-intl";

import { SynBezel } from "@/components/syn-bezel";
import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import { SynthesisSectionHeader } from "@/components/synthesis-section-header";

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
  const [featured, ...rest] = entries;

  return (
    <SynthesisRevealSection
      id="writing"
      className="scroll-mt-28"
    >
      <SynthesisSectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        aside={
          <TransitionLink
            href={`/${locale}/writing`}
            className="text-xs text-syn-ink-secondary hover:text-syn-ink transition-colors"
          >
            {t("allLink")}
          </TransitionLink>
        }
      />

      {entries.length === 0 ? (
        <p className="mt-10 text-sm text-syn-ink-subtle">{t("empty")}</p>
      ) : (
        <div className="mt-10 space-y-4">
          {featured ? (
            <SynBezel className="syn-writing-bezel">
              <TransitionLink
                href={`/${locale}/writing/${featured.slug}`}
                className="syn-writing-featured syn-entity-card group block p-8 md:p-10"
                style={{ viewTransitionName: `writing-${featured.slug}` }}
              >
                <time className="block mono text-xs text-syn-ink-subtle">
                  {featured.dateLabel}
                </time>
                <h3 className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-medium tracking-tight text-syn-ink-strong group-hover:text-syn-accent transition-colors max-w-[28ch] leading-[1.12]">
                  {featured.title}
                </h3>
                <p className="mt-4 text-base text-syn-ink-secondary leading-relaxed max-w-2xl">
                  {featured.summary}
                </p>
                <span className="mt-8 inline-flex text-sm text-syn-accent opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  {t("readEssay")} →
                </span>
              </TransitionLink>
            </SynBezel>
          ) : null}

          {rest.length > 0 ? (
            <div className="flex flex-col gap-3">
              {rest.map((entry) => (
                <TransitionLink
                  key={entry.slug}
                  href={`/${locale}/writing/${entry.slug}`}
                  className="syn-entity-card group flex flex-col gap-3 p-5 sm:flex-row sm:items-baseline sm:gap-8"
                  style={{ viewTransitionName: `writing-${entry.slug}` }}
                >
                  <span className="mono text-xs text-syn-ink-subtle w-16 shrink-0">
                    {entry.dateLabel}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-syn-ink-strong group-hover:text-syn-accent mb-1 transition-colors">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-syn-ink-secondary leading-relaxed max-w-2xl line-clamp-2">
                      {entry.summary}
                    </p>
                  </div>
                  <span className="text-syn-ink-faint group-hover:text-syn-accent transition-colors shrink-0">
                    ↗
                  </span>
                </TransitionLink>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </SynthesisRevealSection>
  );
}
