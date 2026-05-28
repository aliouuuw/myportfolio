"use client";

import { useCallback, useRef } from "react";
import { useTranslations } from "next-intl";

import { useCommandPalette } from "@/components/command-palette-provider";
import { MagneticElement } from "@/components/magnetic-element";
import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import {
  SYNTHESIS_EMAIL,
  SYNTHESIS_GITHUB_USER,
} from "@/lib/synthesis-data";

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

function ChannelRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a href={href} className="group flex flex-col">
      <span className="mono-eyebrow text-syn-ink-subtle group-hover:text-syn-ink-muted transition-colors">
        {label}
      </span>
      <span className="mt-1 text-syn-ink-strong group-hover:text-syn-ink truncate transition-colors">
        {value}
      </span>
    </a>
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
    <>
      <SynthesisRevealSection id="connect" className="pt-20 pb-12 scroll-mt-28">
        <GlowCardSpotlight className="p-10 md:p-14">
          <p className="mono-eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-tight text-syn-ink max-w-2xl leading-[1.1]">
            {t("title")}
          </h2>
          <p className="mt-5 text-syn-ink-muted text-base md:text-lg leading-relaxed max-w-2xl">
            {t("lead")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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
          <div className="mt-10 pt-8 border-t border-syn-border grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
            <ChannelRow
              label={t("channels.email")}
              value={SYNTHESIS_EMAIL}
              href={`mailto:${SYNTHESIS_EMAIL}`}
            />
            <ChannelRow
              label={t("channels.whatsapp")}
              value={t("channels.whatsappValue")}
              href="https://wa.me/221777228845"
            />
            <ChannelRow
              label={t("channels.linkedin")}
              value={t("channels.linkedinValue")}
              href="https://www.linkedin.com/in/aliouuuw"
            />
            <ChannelRow
              label={t("channels.github")}
              value={`@${SYNTHESIS_GITHUB_USER}`}
              href={`https://github.com/${SYNTHESIS_GITHUB_USER}`}
            />
          </div>
        </GlowCardSpotlight>
      </SynthesisRevealSection>
    </>
  );
}
