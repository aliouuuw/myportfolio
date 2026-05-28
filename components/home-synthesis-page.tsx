"use client";

import { useCallback, useEffect, useState } from "react";

import { SynthesisAboutStrip } from "@/components/synthesis-about-strip";
import { SynthesisApproach } from "@/components/synthesis-approach";
import { SynthesisConnect } from "@/components/synthesis-connect";
import { SynthesisGithubActivity } from "@/components/synthesis-github-activity";
import { SynthesisHero } from "@/components/synthesis-hero";
import { SynthesisScrollRail } from "@/components/synthesis-scroll-rail";
import { SynthesisSelectedWork } from "@/components/synthesis-selected-work";
import { SynthesisWorkedWith } from "@/components/synthesis-worked-with";
import {
  SynthesisWriting,
  type SynthesisWritingEntry,
} from "@/components/synthesis-writing";
import {
  useActiveSection,
  useScrollProgress,
} from "@/hooks/use-active-section";
import { SYNTHESIS_RAIL_SECTIONS } from "@/lib/synthesis-data";

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
  const [heroReady, setHeroReady] = useState(false);
  const [highlightedWork, setHighlightedWork] = useState<string[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const ambientHour = useAmbientHour();
  const scrollProgress = useScrollProgress();
  const sectionIds = SYNTHESIS_RAIL_SECTIONS.map((s) => s.id);
  const activeSection = useActiveSection(sectionIds);

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
        <div className="absolute inset-0 bg-grain" />
        <div className="ambient-accent top-[-15%] left-[-5%]" />
      </div>

      <SynthesisScrollRail active={activeSection} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 xl:pl-24 space-y-5 md:space-y-6 pt-6 md:pt-10 pb-16">
        <section id="profile" className="grid-bento scroll-mt-28">
          <SynthesisHero onHeroReady={onHeroReady} />
          <SynthesisGithubActivity />
        </section>

        <SynthesisSelectedWork
          locale={locale}
          highlightedWork={highlightedWork}
        />

        <SynthesisWorkedWith
          locale={locale}
          onHighlightChange={setHighlightedWork}
        />

        <SynthesisAboutStrip />

        <SynthesisApproach />
        <SynthesisWriting locale={locale} entries={writing} />
        <SynthesisConnect />
      </div>
    </div>
  );
}
