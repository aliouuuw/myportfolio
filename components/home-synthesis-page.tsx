"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { SynthesisApproach } from "@/components/synthesis-approach";
import { SynthesisCapabilities } from "@/components/synthesis-capabilities";
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
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
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
  const tBg = useTranslations("HomePage.synthesis.background");
  const tCred = useTranslations("HomePage.synthesis.credentials");
  const tChess = useTranslations("HomePage.synthesis.chess");

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
      className={`site-synthesis min-h-dvh bg-[#050505] text-[#ededed] font-sans selection:bg-white/20 ${ambientClass} ${heroReady ? "hero-ready" : ""} ${reducedMotion ? "motion-reduced" : ""}`}
    >
      <div
        className="scroll-progress"
        style={{ width: "100%", transform: `scaleX(${scrollProgress})` }}
        aria-hidden
      />

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-dot-grid" aria-hidden>
        <div className="absolute inset-0 bg-grain" />
        <div className="ambient-accent top-[-15%] left-[-5%]" />
      </div>

      <SynthesisScrollRail active={activeSection} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 xl:pl-24 space-y-5 md:space-y-6 pt-4 md:pt-8 pb-16">
        <section id="profile" className="grid-bento scroll-mt-28">
          <SynthesisHero onHeroReady={onHeroReady} />
          <SynthesisGithubActivity />

          <div className="md:col-span-7">
            <div className="p-8 md:p-10 rounded-2xl bg-[#0a0a0a] border border-white/5 h-full">
              <h2 className="text-lg font-medium text-white/90">
                {tBg("title")}
              </h2>
              <div className="mt-5 space-y-4 text-white/60 leading-relaxed text-sm max-w-xl">
                <p>{tBg("p1")}</p>
                <p>{tBg("p2")}</p>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5">
                <h3 className="text-sm font-medium text-white/85">
                  {tChess("title")}
                </h3>
                <p className="mt-3 text-sm text-white/55 leading-relaxed max-w-xl">
                  {tChess("body")}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="p-8 md:p-10 rounded-2xl bg-[#0a0a0a] border border-white/5 h-full">
              <h2 className="text-lg font-medium text-white/90">
                {tCred("title")}
              </h2>
              <dl className="mt-6 space-y-6 text-sm">
                <div>
                  <dt className="text-white/45 text-xs uppercase tracking-wide">
                    {tCred("experienceLabel")}
                  </dt>
                  <dd className="mt-1.5 text-white/80 leading-relaxed">
                    {tCred("experience")}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/45 text-xs uppercase tracking-wide">
                    {tCred("educationLabel")}
                  </dt>
                  <dd className="mt-1.5 text-white/80 leading-relaxed">
                    {tCred("educationPrimary")}
                    <br />
                    <span className="text-white/55">
                      {tCred("educationSecondary")}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-white/45 text-xs uppercase tracking-wide">
                    {tCred("certificationsLabel")}
                  </dt>
                  <dd className="mt-1.5 text-white/80 leading-relaxed">
                    {tCred("certPrimary")}
                    <br />
                    {tCred("certSecondary")}
                    <br />
                    <span className="text-white/55">{tCred("certTertiary")}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <SynthesisWorkedWith onHighlightChange={setHighlightedWork} />
        <SynthesisCapabilities />
        <SynthesisSelectedWork
          locale={locale}
          highlightedWork={highlightedWork}
        />
        <SynthesisApproach />
        <SynthesisWriting locale={locale} entries={writing} />
        <SynthesisConnect />
      </div>
    </div>
  );
}
