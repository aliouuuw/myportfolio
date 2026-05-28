"use client";

import { useTranslations } from "next-intl";

import { ScrambleText } from "@/components/scramble-text";
import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";

const PROCESS_KEYS = ["discovery", "architecture", "ship"] as const;

function ProcessStep({ stepKey, index }: { stepKey: string; index: number }) {
  const t = useTranslations(`HomePage.synthesis.approach.process.${stepKey}`);

  return (
    <div className="flex gap-5">
      <span className="mono text-xs text-syn-ink-faint pt-0.5 w-6 shrink-0">
        <ScrambleText text={`0${index + 1}`} trigger="hover" />
      </span>
      <div>
        <h3 className="text-base font-medium text-syn-ink-strong">{t("title")}</h3>
        <p className="mt-1 text-sm text-syn-ink-secondary leading-relaxed max-w-xl">
          {t("desc")}
        </p>
      </div>
    </div>
  );
}

export function SynthesisApproach() {
  const t = useTranslations("HomePage.synthesis.approach");

  return (
    <SynthesisRevealSection
      id="approach"
      className="pt-16 border-t border-syn-border scroll-mt-28"
    >
      <span className="section-marker">{t("eyebrow")}</span>
      <h2 className="text-2xl font-medium tracking-tight text-syn-ink-strong">
        {t("title")}
      </h2>
      <p className="mt-2 text-sm text-syn-ink-secondary leading-relaxed max-w-xl">
        {t("lead")}
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        {PROCESS_KEYS.map((key, i) => (
          <ProcessStep key={key} stepKey={key} index={i} />
        ))}
      </div>
    </SynthesisRevealSection>
  );
}
