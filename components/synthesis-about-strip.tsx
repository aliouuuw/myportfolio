"use client";

import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import { SynthesisSectionHeader } from "@/components/synthesis-section-header";

export function SynthesisAboutStrip() {
  const tBg = useTranslations("HomePage.synthesis.background");
  const tCred = useTranslations("HomePage.synthesis.credentials");
  const tChess = useTranslations("HomePage.synthesis.chess");

  const registry = [
    {
      term: tCred("experienceLabel"),
      detail: tCred("experience"),
      stagger: 0,
    },
    {
      term: tCred("educationLabel"),
      detail: `${tCred("educationPrimary")}. ${tCred("educationSecondary")}.`,
      stagger: 1,
    },
    {
      term: tCred("certificationsLabel"),
      detail: `${tCred("certPrimary")}, ${tCred("certSecondary")}, ${tCred("certTertiary")}.`,
      stagger: 2,
    },
    {
      term: tChess("title"),
      detail: tChess("body"),
      stagger: 3,
      aside: (
        <span className="syn-about-registry__metrics mono" aria-label={tChess("ratingsAria")}>
          <span>{tChess("bulletRating")}</span>
          <span className="syn-about-registry__metrics-k">{tChess("bulletLabel")}</span>
          <span className="syn-about-registry__sep" aria-hidden>
            /
          </span>
          <span>{tChess("blitzRating")}</span>
          <span className="syn-about-registry__metrics-k">{tChess("blitzLabel")}</span>
        </span>
      ),
    },
  ] as const;

  return (
    <SynthesisRevealSection id="about" className="scroll-mt-28 syn-about-section">
      <div className="syn-section-atmo syn-section-atmo--about" aria-hidden />

      <SynthesisSectionHeader
        eyebrow={tBg("eyebrow")}
        title={tBg("title")}
        lead={tBg("lead")}
      />

      <div className="syn-section-body syn-stagger-children">
        <div className="syn-about-registry" role="list">
          {registry.map((row) => (
            <div
              key={row.term}
              className="syn-about-registry__row"
              role="listitem"
              style={{ "--stagger": row.stagger } as CSSProperties}
            >
              <p className="syn-about-registry__term mono">{row.term}</p>
              <p className="syn-about-registry__detail">
                {"aside" in row && row.aside ? (
                  <span className="syn-about-registry__detail-head">
                    {row.aside}
                    <span className="syn-about-registry__detail-text">{row.detail}</span>
                  </span>
                ) : (
                  row.detail
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SynthesisRevealSection>
  );
}
