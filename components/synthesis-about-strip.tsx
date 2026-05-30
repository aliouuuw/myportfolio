"use client";

import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import { SynthesisSectionHeader } from "@/components/synthesis-section-header";

export function SynthesisAboutStrip() {
  const tBg = useTranslations("HomePage.synthesis.background");
  const tChess = useTranslations("HomePage.synthesis.chess");

  return (
    <SynthesisRevealSection id="about" className="scroll-mt-28">
      <SynthesisSectionHeader
        eyebrow={tBg("eyebrow")}
        title={tBg("title")}
        lead={tBg("lead")}
      />
      <div className="mt-10 syn-about-panel rounded-2xl border border-syn-border bg-syn-surface overflow-hidden p-6 md:p-10 lg:p-12">
        <blockquote className="syn-about-quote text-[clamp(1.125rem,2.2vw,1.5rem)] leading-relaxed text-syn-ink-muted font-medium tracking-[-0.02em] max-w-[48ch]">
          {tBg("p1")}
        </blockquote>
        <p className="mt-8 text-sm text-syn-ink-secondary leading-relaxed max-w-xl border-t border-syn-border pt-8">
          <span className="block text-[10px] uppercase tracking-widest text-syn-ink-subtle mb-2">
            {tChess("title")}
          </span>
          {tChess("body")}
        </p>
      </div>
    </SynthesisRevealSection>
  );
}
