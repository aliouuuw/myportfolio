"use client";

import type { CSSProperties } from "react";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

import { useCommandPalette } from "@/components/command-palette-provider";
import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import { SynthesisSectionHeader } from "@/components/synthesis-section-header";
import { SYNTHESIS_EMAIL, SYNTHESIS_GITHUB_USER } from "@/lib/synthesis-data";

type ConnectLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

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

  const links: ConnectLink[] = [
    {
      id: "whatsapp",
      label: t("channels.whatsapp"),
      href: "https://wa.me/221777228845",
      external: true,
    },
    {
      id: "linkedin",
      label: t("channels.linkedin"),
      href: "https://www.linkedin.com/in/aliouuuw",
      external: true,
    },
    {
      id: "github",
      label: t("channels.github"),
      href: `https://github.com/${SYNTHESIS_GITHUB_USER}`,
      external: true,
    },
  ];

  return (
    <SynthesisRevealSection id="connect" className="scroll-mt-28 pb-12 syn-connect-section">
      <div className="syn-section-atmo syn-section-atmo--connect" aria-hidden />

      <SynthesisSectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
      />

      <div className="syn-section-body syn-stagger-children">
        <div
          className="syn-connect-stage syn-section-prose"
          style={{ "--stagger": 0 } as CSSProperties}
        >
          <p className="syn-connect-status mono">
            <span className="syn-connect-pulse" aria-hidden />
            {t("availability")}
          </p>

          <a href={`mailto:${SYNTHESIS_EMAIL}`} className="syn-connect-mail">
            {SYNTHESIS_EMAIL}
          </a>

          <p className="syn-connect-prompt">{t("prompt")}</p>

          <nav className="syn-connect-nav mono" aria-label={t("channelsAria")}>
            {links.map((link, i) => (
              <span key={link.id} className="syn-connect-nav__item">
                {i > 0 ? (
                  <span className="syn-connect-nav__sep" aria-hidden>
                    /
                  </span>
                ) : null}
                <a
                  href={link.href}
                  className="syn-connect-nav__link"
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                  {link.external ? (
                    <span className="syn-connect-nav__ext" aria-hidden>
                      ↗
                    </span>
                  ) : null}
                </a>
              </span>
            ))}
          </nav>

          <button
            type="button"
            className="syn-connect-copy mono"
            onClick={() => void copyEmail()}
          >
            {t("ctaCopyEmail")}
          </button>
        </div>
      </div>
    </SynthesisRevealSection>
  );
}
