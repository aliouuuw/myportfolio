"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

import { MagneticElement } from "@/components/magnetic-element";
import { SYNTHESIS_BOOT_KEY } from "@/lib/synthesis-data";

const BOOT_LINE_KEYS = ["teams", "focus", "availability"] as const;

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

function readBootSkipped(): boolean {
  try {
    return sessionStorage.getItem(SYNTHESIS_BOOT_KEY) === "1";
  } catch {
    return false;
  }
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
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
      className={`glow-card relative overflow-hidden rounded-2xl bg-syn-surface border border-syn-border ${spotlight ? "glow-card--spotlight" : ""} ${className}`}
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
  const [bootLines, setBootLines] = useState(0);
  const [bootFinished, setBootFinished] = useState(false);
  const isClient = useIsClient();
  const reducedMotion = usePrefersReducedMotion();

  const skipBoot = isClient && (reducedMotion || readBootSkipped());
  const bootDone = skipBoot || bootFinished;

  const finishBoot = useCallback(() => {
    setBootFinished(true);
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
    }
  }, [bootDone, onHeroReady]);

  useEffect(() => {
    if (!isClient || skipBoot || bootFinished) return;

    let line = 0;
    const interval = window.setInterval(() => {
      line += 1;
      setBootLines(line);
      if (line >= BOOT_LINE_KEYS.length) {
        window.clearInterval(interval);
        window.setTimeout(finishBoot, 380);
      }
    }, 520);

    return () => window.clearInterval(interval);
  }, [isClient, skipBoot, bootFinished, finishBoot]);

  return (
    <GlowCardHero
      spotlight
      className="md:col-span-8 p-8 md:p-12 lg:p-14 min-h-[min(72vh,520px)] justify-between"
    >
      {!reducedMotion && <div className="scan-bar" aria-hidden />}
      <div className="flex flex-wrap justify-between items-start gap-3">
        <p className="text-sm text-syn-ink-secondary">
          {t("location")} ·{" "}
          <span className="text-syn-ink-muted">{t("languages")}</span>
        </p>
        <p className="mono text-xs text-syn-ink-subtle hidden sm:block">
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
          <p className="text-xs text-syn-ink-subtle mb-4">{t("bootLoading")}</p>
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
          <h1 className="hero-reveal hero-reveal--1 text-[clamp(2rem,5vw,5rem)] font-medium tracking-[-0.03em] leading-[1.05] max-w-[18ch] text-syn-ink">
            {t("headline")}
          </h1>
          <p className="hero-reveal hero-reveal--2 mt-6 max-w-2xl text-syn-ink-muted text-lg leading-relaxed">
            {t("subtitle")}
          </p>
          <p className="hero-reveal hero-reveal--3 mt-4 text-sm text-syn-ink-secondary">
            {t("availability")}
          </p>
          <div className="hero-reveal hero-reveal--4 mt-10 flex flex-wrap gap-4">
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
        </div>
      )}
    </GlowCardHero>
  );
}
