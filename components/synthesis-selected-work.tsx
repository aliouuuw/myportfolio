"use client";

import { TransitionLink } from "@/components/transition-link";
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
    <SynthesisRevealSection id="work" className="pt-8 scroll-mt-28">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-tight text-syn-ink-strong">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-syn-ink-secondary max-w-xl leading-relaxed">
            {t("aside")}
          </p>
        </div>
        <TransitionLink
          href={`/${locale}/work`}
          className="text-xs text-syn-ink-muted hover:text-syn-ink transition-colors shrink-0"
        >
          {t("seeAll")} →
        </TransitionLink>
      </div>
      <div className="flex flex-col gap-3 relative">
        {SYNTHESIS_WORK.map((w, index) => (
          <SynthesisWorkRow
            key={w.id}
            locale={locale}
            work={w}
            highlighted={highlightedWork.includes(w.id)}
            index={index}
          />
        ))}
      </div>
    </SynthesisRevealSection>
  );
}
