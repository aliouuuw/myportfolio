"use client";

import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import { SynthesisWorkRow } from "@/components/synthesis-work-row";
import { SYNTHESIS_WORK } from "@/lib/synthesis-data";

type SynthesisSelectedWorkProps = {
  locale: string;
  highlightedWork: string[];
};

export function SynthesisSelectedWork({
  locale,
  highlightedWork,
}: SynthesisSelectedWorkProps) {
  const t = useTranslations("HomePage.synthesis.work");

  return (
    <SynthesisRevealSection id="work" className="pt-16 scroll-mt-28">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="mono-eyebrow">{t("eyebrow")}</p>
          <h2 className="text-2xl font-medium tracking-tight mt-3 text-white/90">
            {t("title")}
          </h2>
        </div>
        <span className="mono-eyebrow text-white/40">{t("aside")}</span>
      </div>
      <div className="divide-y divide-white/5 border-y border-white/5">
        {SYNTHESIS_WORK.map((w) => (
          <SynthesisWorkRow
            key={w.id}
            locale={locale}
            work={w}
            highlighted={highlightedWork.includes(w.id)}
          />
        ))}
      </div>
    </SynthesisRevealSection>
  );
}
