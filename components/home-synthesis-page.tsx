"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { SynthesisAboutStrip } from "@/components/synthesis-about-strip";
import { SynthesisConnect } from "@/components/synthesis-connect";
import { SynthesisGithubActivity } from "@/components/synthesis-github-activity";
import { SynthesisHero } from "@/components/synthesis-hero";
import { SynthesisProofSection } from "@/components/synthesis-proof-section";
import {
  SynthesisWriting,
  type SynthesisWritingEntry,
} from "@/components/synthesis-writing";
import { useScrollProgress } from "@/hooks/use-active-section";

type HomeSynthesisPageProps = {
  locale: string;
  writing: SynthesisWritingEntry[];
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function useAmbientHour() {
  const [ambientHour, setAmbientHour] = useState(12);
  useEffect(() => {
    const u = () => {
      const now = new Date();
      setAmbientHour(
        Number(
          now.toLocaleString("en-US", {
            timeZone: "Africa/Dakar",
            hour: "numeric",
            hour12: false,
          }),
        ),
      );
    };
    u();
    const i = setInterval(u, 60_000);
    return () => clearInterval(i);
  }, []);
  return ambientHour;
}

export function HomeSynthesisPage({ locale, writing }: HomeSynthesisPageProps) {
  const tSkip = useTranslations("HomePage.synthesis.skipNav");
  const [heroReady, setHeroReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const ambientHour = useAmbientHour();
  const scrollProgress = useScrollProgress();

  const onHeroReady = useCallback(() => setHeroReady(true), []);

  const ambientClass =
    ambientHour >= 6 && ambientHour < 18
      ? "ambient--day"
      : ambientHour >= 18 && ambientHour < 22
        ? "ambient--evening"
        : "ambient--night";

  return (
    <div
      data-locale={locale}
      className={`site-synthesis min-h-dvh font-sans selection-syn ${ambientClass} ${heroReady ? "hero-ready" : ""} ${reducedMotion ? "motion-reduced" : ""}`}
    >
      <div
        className="scroll-progress"
        style={{ width: "100%", transform: `scaleX(${scrollProgress})` }}
        aria-hidden
      />

      <div
        className="synthesis-bg-layers fixed inset-0 pointer-events-none -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="syn-hero-wash" />
        <div className="absolute inset-0 bg-grain" />
        <div className="ambient-accent top-[-12%] left-[-8%]" />
        <div className="ambient-accent ambient-accent--secondary bottom-[8%] right-[-12%]" />
        <div className="syn-floor-glow" />
      </div>

      <a
        href="#connect"
        className="syn-skip-link fixed left-4 top-4 z-50 -translate-y-[calc(100%+1rem)] rounded-full border border-syn-border-strong bg-syn-surface px-4 py-2 text-sm font-medium text-syn-ink-strong shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-syn-accent"
      >
        {tSkip("connect")}
      </a>

      <section id="profile" className="syn-profile scroll-mt-28">
        <div className="syn-profile-hero-wrap">
          <div className="syn-profile-hero-inner">
            <SynthesisHero onHeroReady={onHeroReady} />
          </div>
        </div>
        <SynthesisGithubActivity />
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 syn-page-flow min-w-0 pt-12 md:pt-16 pb-20">
        <SynthesisProofSection locale={locale} />

        <SynthesisAboutStrip />

        <SynthesisWriting locale={locale} entries={writing} />

        <SynthesisConnect locale={locale} />
      </div>
    </div>
  );
}
