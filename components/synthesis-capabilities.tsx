"use client";

import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";

const CAPABILITY_KEYS = [
  "productSystems",
  "finance",
  "erp",
  "ai",
] as const;

function CapabilityItem({ itemKey, index }: { itemKey: string; index: number }) {
  const t = useTranslations(`HomePage.synthesis.capabilities.items.${itemKey}`);

  return (
    <div className="flex flex-col">
      <span className="mono-eyebrow text-white/30 mb-3">0{index + 1}</span>
      <h3 className="text-base font-medium text-white/90">{t("label")}</h3>
      <p className="mt-2 text-sm text-white/50 leading-relaxed">{t("desc")}</p>
    </div>
  );
}

export function SynthesisCapabilities() {
  const t = useTranslations("HomePage.synthesis.capabilities");

  return (
    <SynthesisRevealSection
      id="capabilities"
      className="pt-16 mt-16 border-t border-white/5 scroll-mt-28"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <p className="mono-eyebrow">{t("eyebrow")}</p>
          <h2 className="text-2xl font-medium tracking-tight mt-3 text-white/90">
            {t("title")}
          </h2>
        </div>
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
          {CAPABILITY_KEYS.map((key, i) => (
            <CapabilityItem key={key} itemKey={key} index={i} />
          ))}
        </div>
      </div>
    </SynthesisRevealSection>
  );
}
