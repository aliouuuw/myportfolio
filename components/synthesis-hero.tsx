"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { HeroHeadlineRotate } from "@/components/hero-headline-rotate";
import { SynButton } from "@/components/syn-button";

type SynthesisHeroProps = {
  onHeroReady: () => void;
};

export function SynthesisHero({ onHeroReady }: SynthesisHeroProps) {
  const t = useTranslations("HomePage.synthesis.hero");
  const [time, setTime] = useState("");

  useEffect(() => {
    onHeroReady();
  }, [onHeroReady]);

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Africa/Dakar",
          hour12: false,
        }),
      );
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <header className="syn-hero">
      <div className="syn-hero-top hero-reveal hero-reveal--1">
        <p className="syn-hero-meta syn-hero-meta--lead mono">
          <span className="syn-hero-meta-availability syn-hero-meta--mobile-only">
            {t("availabilityShort")}
          </span>
          <span className="syn-hero-meta-location syn-hero-meta--desktop-only">
            {t("location")}
          </span>
        </p>
        <p className="syn-hero-meta syn-hero-meta--trail mono">
          <span className="syn-hero-meta-location syn-hero-meta--mobile-only">
            {t("location")}
          </span>
          <span className="syn-hero-meta-sep syn-hero-meta--mobile-only" aria-hidden>
            ·
          </span>
          <span className="syn-hero-clock-time">{time || "00:00:00"}</span>
          <span className="syn-hero-clock-tz"> {t("timezone")}</span>
        </p>
      </div>

      <h1 className="syn-hero-title hero-reveal hero-reveal--2">
        <HeroHeadlineRotate
          before={t("headlineBefore")}
          products={t("headlineRotateProducts")}
          services={t("headlineRotateServices")}
          staticLabel={t("headlineRotateStatic")}
          ariaLabel={t("headlineAria")}
        />
      </h1>
      <p className="syn-hero-tagline hero-reveal hero-reveal--3">{t("tagline")}</p>

      <div className="syn-hero-cta hero-reveal hero-reveal--4">
        <SynButton variant="primary" href="#connect">
          {t("ctaContact")}
        </SynButton>
        <SynButton variant="secondary" href="#work">
          {t("ctaWork")}
          <span className="syn-btn__trail" aria-hidden>
            ↓
          </span>
        </SynButton>
      </div>
    </header>
  );
}
