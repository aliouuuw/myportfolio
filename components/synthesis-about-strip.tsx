"use client";

import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import { SynthesisSectionHeader } from "@/components/synthesis-section-header";

export function SynthesisAboutStrip() {
  const tBg = useTranslations("HomePage.synthesis.background");
  const tCred = useTranslations("HomePage.synthesis.credentials");
  const tChess = useTranslations("HomePage.synthesis.chess");

  const credentials = [
    { label: tCred("experienceLabel"), value: tCred("experience") },
    {
      label: tCred("educationLabel"),
      value: `${tCred("educationPrimary")} · ${tCred("educationSecondary")}`,
    },
    {
      label: tCred("certificationsLabel"),
      value: `${tCred("certPrimary")} · ${tCred("certSecondary")}`,
    },
  ];

  return (
    <SynthesisRevealSection id="about" className="scroll-mt-28">
      <SynthesisSectionHeader
        eyebrow={tBg("eyebrow")}
        title={tBg("title")}
        lead={tBg("lead")}
      />
      <div className="mt-10 syn-about-grid rounded-2xl border border-syn-border bg-syn-surface overflow-hidden">
        <div className="syn-about-quote p-6 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-syn-border">
          <blockquote className="text-[clamp(1.125rem,2.2vw,1.5rem)] leading-relaxed text-syn-ink-muted font-medium tracking-[-0.02em] max-w-[42ch]">
            {tBg("p1")}
          </blockquote>
          <p className="mt-8 text-sm text-syn-ink-secondary leading-relaxed max-w-xl">
            {tChess("body")}
          </p>
        </div>
        <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center gap-6">
          <h3 className="text-sm font-medium text-syn-ink-strong">{tCred("title")}</h3>
          <ul className="flex flex-col gap-4">
            {credentials.map((item) => (
              <li key={item.label}>
                <p className="text-[10px] uppercase tracking-widest text-syn-ink-subtle">
                  {item.label}
                </p>
                <p className="mt-1.5 text-sm text-syn-ink-muted leading-relaxed">
                  {item.value}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SynthesisRevealSection>
  );
}
