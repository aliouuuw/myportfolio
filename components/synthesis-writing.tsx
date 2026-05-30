"use client";

import type { CSSProperties } from "react";
import { TransitionLink } from "@/components/transition-link";
import { useTranslations } from "next-intl";

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
    <SynthesisRevealSection id="writing" className="scroll-mt-28 syn-writing-section">
      <div className="syn-section-atmo syn-section-atmo--writing" aria-hidden />

      <SynthesisSectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        aside={
          <TransitionLink
            href={`/${locale}/writing`}
            className="syn-section-aside-link"
          >
            {t("allLink")}
          </TransitionLink>
        }
      />

      {entries.length === 0 ? (
        <p className="syn-section-body text-sm text-syn-ink-subtle">{t("empty")}</p>
      ) : (
        <div className="syn-section-body syn-stagger-children">
          {featured ? (
            <article
              className="syn-writing-lead"
              style={{ "--stagger": 0 } as CSSProperties}
            >
              <TransitionLink
                href={`/${locale}/writing/${featured.slug}`}
                className="syn-writing-lead__link group"
                style={{ viewTransitionName: `writing-${featured.slug}` }}
              >
                <div className="syn-writing-lead__head">
                  <h3 className="syn-writing-lead__title">{featured.title}</h3>
                  <time className="syn-writing-lead__date mono">{featured.dateLabel}</time>
                </div>
                <p className="syn-writing-lead__summary">{featured.summary}</p>
                <span className="syn-writing-lead__go mono">{t("readEssay")}</span>
              </TransitionLink>
            </article>
          ) : null}

          {rest.length > 0 ? (
            <ul className="syn-writing-list">
              {rest.map((entry, i) => (
                <li
                  key={entry.slug}
                  className="syn-writing-list__item"
                  style={{ "--stagger": i + 1 } as CSSProperties}
                >
                  <TransitionLink
                    href={`/${locale}/writing/${entry.slug}`}
                    className="syn-writing-list__link group"
                    style={{ viewTransitionName: `writing-${entry.slug}` }}
                  >
                    <span className="syn-writing-list__title">{entry.title}</span>
                    <time className="syn-writing-list__date mono">{entry.dateLabel}</time>
                    <span className="syn-writing-list__summary">{entry.summary}</span>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </SynthesisRevealSection>
  );
}
