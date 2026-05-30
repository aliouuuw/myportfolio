"use client";

import { useCallback, useRef } from "react";
import { useTranslations } from "next-intl";

import { useCommandPalette } from "@/components/command-palette-provider";
import { SynBezel } from "@/components/syn-bezel";
import { SynButton } from "@/components/syn-button";
import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import { SynthesisSectionHeader } from "@/components/synthesis-section-header";
import { SYNTHESIS_EMAIL } from "@/lib/synthesis-data";

function GlowCardSpotlight({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`glow-card glow-card--spotlight syn-bezel__inner relative overflow-hidden ${className}`}
    >
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}

export function SynthesisConnect() {
  const t = useTranslations("HomePage.synthesis.connect");
  const { showCopyToast } = useCommandPalette();

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SYNTHESIS_EMAIL);
      showCopyToast();
    } catch {
      window.location.href = `mailto:${SYNTHESIS_EMAIL}`;
    }
  }, [showCopyToast]);

  return (
    <SynthesisRevealSection
      id="connect"
      className="scroll-mt-28 pb-12"
    >
      <SynthesisSectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
      />
      <SynBezel className="mt-8">
        <GlowCardSpotlight className="p-8 md:p-10 syn-connect-card">
          <p className="syn-connect-availability mono">{t("availability")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <SynButton variant="primary" href={`mailto:${SYNTHESIS_EMAIL}`}>
              {t("ctaEmail")}
            </SynButton>
            <SynButton variant="secondary" href="https://wa.me/221777228845">
              {t("ctaWhatsApp")}
            </SynButton>
            <SynButton variant="secondary" onClick={copyEmail}>
              {t("ctaCopyEmail")}
            </SynButton>
          </div>
        </GlowCardSpotlight>
      </SynBezel>
    </SynthesisRevealSection>
  );
}
