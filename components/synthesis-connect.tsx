"use client";

import { useCallback, useRef } from "react";
import { useTranslations } from "next-intl";

import { useCommandPalette } from "@/components/command-palette-provider";
import { MagneticElement } from "@/components/magnetic-element";
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
      className={`glow-card glow-card--spotlight relative overflow-hidden rounded-2xl bg-syn-surface border border-syn-border ${className}`}
    >
      <div className="relative z-10 h-full flex flex-col">{children}</div>
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
      className="pt-16 md:pt-24 pb-12 scroll-mt-28 border-t border-syn-border"
    >
      <SynthesisSectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
      />
      <GlowCardSpotlight className="mt-8 p-8 md:p-10 syn-connect-card">
        <div className="flex flex-wrap gap-3">
          <MagneticElement>
            <a
              href={`mailto:${SYNTHESIS_EMAIL}`}
              className="syn-btn-primary btn-press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium hover:scale-[1.02] transition-transform"
            >
              {t("ctaEmail")}
            </a>
          </MagneticElement>
          <MagneticElement>
            <a
              href="https://wa.me/221777228845"
              className="syn-btn-secondary btn-press inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {t("ctaWhatsApp")}
            </a>
          </MagneticElement>
          <MagneticElement>
            <button
              type="button"
              onClick={copyEmail}
              className="syn-btn-secondary btn-press inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {t("ctaCopyEmail")}
            </button>
          </MagneticElement>
        </div>
      </GlowCardSpotlight>
    </SynthesisRevealSection>
  );
}
