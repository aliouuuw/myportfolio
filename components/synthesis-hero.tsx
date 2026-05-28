"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { SYNTHESIS_BOOT_KEY } from "@/lib/synthesis-data";

const BOOT_LINE_KEYS = ["teams", "focus", "availability"] as const;

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

function getInitialBoot() {
  if (typeof window === "undefined") return { done: false, lines: 0 };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return { done: true, lines: BOOT_LINE_KEYS.length };
  }
  try {
    if (sessionStorage.getItem(SYNTHESIS_BOOT_KEY) === "1") {
      return { done: true, lines: BOOT_LINE_KEYS.length };
    }
  } catch {
    /* ignore */
  }
  return { done: false, lines: 0 };
}

function GlowCardHero({
  children,
  className = "",
  spotlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  spotlight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlight || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`glow-card relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 ${spotlight ? "glow-card--spotlight" : ""} ${className}`}
    >
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}

type SynthesisHeroProps = {
  onHeroReady: () => void;
};

export function SynthesisHero({ onHeroReady }: SynthesisHeroProps) {
  const t = useTranslations("HomePage.synthesis.hero");
  const [time, setTime] = useState("");
  const [boot, setBoot] = useState(getInitialBoot);
  const bootDone = boot.done;
  const bootLines = boot.lines;
  const reducedMotion = usePrefersReducedMotion();

  const finishBoot = useCallback(() => {
    setBoot({ done: true, lines: BOOT_LINE_KEYS.length });
    onHeroReady();
    try {
      sessionStorage.setItem(SYNTHESIS_BOOT_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [onHeroReady]);

  useEffect(() => {
    const u = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Africa/Dakar",
          hour12: false,
        }),
      );
    };
    u();
    const i = setInterval(u, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (bootDone) {
      onHeroReady();
      return;
    }
    if (reducedMotion) return;
    let line = 0;
    const interval = window.setInterval(() => {
      line += 1;
      setBoot((prev) => ({ ...prev, lines: line }));
      if (line >= BOOT_LINE_KEYS.length) {
        window.clearInterval(interval);
        window.setTimeout(finishBoot, 380);
      }
    }, 520);
    return () => window.clearInterval(interval);
  }, [bootDone, reducedMotion, finishBoot, onHeroReady]);

  return (
    <GlowCardHero
      spotlight
      className="md:col-span-7 p-8 md:p-12 min-h-[320px] justify-between"
    >
      {!reducedMotion && <div className="scan-bar" aria-hidden />}
      <div className="flex flex-wrap justify-between items-start gap-3">
        <p className="text-sm text-white/50">
          {t("location")} ·{" "}
          <span className="text-white/70">{t("languages")}</span>
        </p>
        <p className="mono text-xs text-white/35 hidden sm:block">
          {time || "00:00:00"} {t("timezone")}
        </p>
      </div>

      {!bootDone && !reducedMotion ? (
        <button
          type="button"
          className="mt-10 text-left w-full cursor-pointer"
          onClick={finishBoot}
          aria-label={t("skipBoot")}
        >
          <p className="text-xs text-white/35 mb-4">{t("bootLoading")}</p>
          <div className="space-y-2 mono text-sm text-emerald-400/90">
            {BOOT_LINE_KEYS.map((key, i) => (
              <p
                key={key}
                className={`boot-line ${i < bootLines ? "boot-line--visible" : ""}`}
              >
                {t(`bootLines.${key}`)}
              </p>
            ))}
          </div>
        </button>
      ) : (
        <div className="mt-10">
          <h1 className="hero-reveal hero-reveal--1 text-[clamp(2rem,4.5vw,4.5rem)] font-medium tracking-[-0.03em] leading-[1.05] max-w-3xl text-white">
            {t("headline")}
          </h1>
          <p className="hero-reveal hero-reveal--2 mt-6 max-w-2xl text-white/60 text-lg leading-relaxed">
            {t("subtitle")}
          </p>
          <p className="hero-reveal hero-reveal--3 mt-4 text-sm text-white/45">
            {t("availability")}
          </p>
          <div className="hero-reveal hero-reveal--4 mt-10 flex flex-wrap gap-4">
            <a
              href="#work"
              className="btn-press inline-flex items-center gap-2 rounded-full bg-white text-[#050505] px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.02]"
            >
              {t("ctaWork")} <span aria-hidden>↓</span>
            </a>
            <a
              href="#connect"
              className="btn-press inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] border border-white/10 px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              {t("ctaContact")}
            </a>
          </div>
        </div>
      )}
    </GlowCardHero>
  );
}
