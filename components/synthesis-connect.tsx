"use client";

import type { CSSProperties } from "react";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

import { useCommandPalette } from "@/components/command-palette-provider";
import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import { SynthesisSectionHeader } from "@/components/synthesis-section-header";
import { TransitionLink } from "@/components/transition-link";
import { SYNTHESIS_EMAIL, SYNTHESIS_GITHUB_USER } from "@/lib/synthesis-data";

type ConnectLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

type SynthesisConnectProps = {
  locale: string;
};

export function SynthesisConnect({ locale }: SynthesisConnectProps) {
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

  const briefItems = [
    t("brief.scope"),
    t("brief.timeline"),
    t("brief.system"),
    t("brief.decision"),
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
          className="syn-connect-stage"
          style={{ "--stagger": 0 } as CSSProperties}
        >
          <div className="syn-connect-primary">
            <p className="syn-connect-status mono">
              <span className="syn-connect-pulse" aria-hidden />
              {t("availability")}
            </p>

            <p className="syn-connect-prompt">{t("prompt")}</p>

            <div className="syn-connect-actions">
              <TransitionLink href={`/${locale}/contact`} className="syn-connect-cta">
                {t("ctaEmail")}
              </TransitionLink>
              <a href={`mailto:${SYNTHESIS_EMAIL}`} className="syn-connect-mail">
                {SYNTHESIS_EMAIL}
              </a>
              <button
                type="button"
                className="syn-connect-copy mono"
                onClick={() => void copyEmail()}
              >
                {t("ctaCopyEmail")}
              </button>
            </div>
          </div>

          <aside className="syn-connect-brief" aria-label={t("briefAria")}>
            <p className="syn-connect-brief__title mono">{t("briefTitle")}</p>
            <ul className="syn-connect-brief__list">
              {briefItems.map((item) => (
                <li key={item} className="syn-connect-brief__item">
                  {item}
                </li>
              ))}
            </ul>

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
          </aside>
        </div>
      </div>
    </SynthesisRevealSection>
  );
}
