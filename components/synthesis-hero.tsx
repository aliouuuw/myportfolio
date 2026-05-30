"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { MagneticElement } from "@/components/magnetic-element";

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
      <div className="syn-hero-top">
        <p className="syn-hero-location hero-reveal hero-reveal--1">
          {t("location")}
          <span className="syn-hero-lang"> · {t("languages")}</span>
        </p>
        <p className="syn-hero-clock mono hero-reveal hero-reveal--1">
          <span className="syn-hero-clock-time">{time || "00:00:00"}</span>
          <span className="syn-hero-clock-tz"> {t("timezone")}</span>
        </p>
      </div>

      <p className="syn-hero-availability mono hero-reveal hero-reveal--2">
        {t("availability")}
      </p>

      <h1 className="syn-hero-title hero-reveal hero-reveal--3">{t("headline")}</h1>

      <div className="syn-hero-cta hero-reveal hero-reveal--4">
        <MagneticElement>
          <a
            href="#work"
            className="syn-btn-primary btn-press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.02]"
          >
            {t("ctaWork")} <span aria-hidden>↓</span>
          </a>
        </MagneticElement>
        <MagneticElement>
          <a
            href="#connect"
            className="syn-btn-secondary btn-press inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            {t("ctaContact")}
          </a>
        </MagneticElement>
      </div>
    </header>
  );
}
