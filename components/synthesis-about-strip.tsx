"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import { SynthesisSectionHeader } from "@/components/synthesis-section-header";

function useCountUp(target: number, inView: boolean, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Math.round(eased * target));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);
  return value;
}

function ChessRating({
  rating,
  label,
  inView,
}: {
  rating: string;
  label: string;
  inView: boolean;
}) {
  const num = parseInt(rating, 10);
  const displayed = useCountUp(num, inView);
  return (
    <span className="syn-about-chess__rating" aria-label={`${label} ${rating}`}>
      <span className="syn-about-chess__rating-num">{displayed}</span>
      <span className="syn-about-chess__rating-label">{label}</span>
    </span>
  );
}

export function SynthesisAboutStrip() {
  const tBg = useTranslations("HomePage.synthesis.background");
  const tCred = useTranslations("HomePage.synthesis.credentials");
  const tChess = useTranslations("HomePage.synthesis.chess");
  const tOps = useTranslations("HomePage.synthesis.operatingManual");
  const chessRef = useRef<HTMLDivElement>(null);
  const [chessInView, setChessInView] = useState(false);

  useEffect(() => {
    const el = chessRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setChessInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const principles = [
    {
      label: tOps("principles.workflow.label"),
      body: tOps("principles.workflow.body"),
      stagger: 0,
    },
    {
      label: tOps("principles.slices.label"),
      body: tOps("principles.slices.body"),
      stagger: 1,
    },
    {
      label: tOps("principles.handoff.label"),
      body: tOps("principles.handoff.body"),
      stagger: 2,
    },
  ] as const;

  const credentials = [
    {
      term: tCred("experienceLabel"),
      detail: tCred("experience"),
      stagger: 3,
    },
    {
      term: tCred("educationLabel"),
      detail: `${tCred("educationPrimary")}. ${tCred("educationSecondary")}.`,
      stagger: 4,
    },
    {
      term: tCred("certificationsLabel"),
      detail: `${tCred("certPrimary")}, ${tCred("certSecondary")}, ${tCred("certTertiary")}.`,
      stagger: 5,
    },
  ] as const;

  return (
    <SynthesisRevealSection id="about" className="scroll-mt-28 syn-about-section">
      <div className="syn-section-atmo syn-section-atmo--about" aria-hidden />

      <SynthesisSectionHeader
        eyebrow={tBg("eyebrow")}
        title={tBg("title")}
        lead={tBg("lead")}
      />

      <div className="syn-section-body">
        <div className="syn-about-grid">
          <div className="syn-about-principles" aria-label={tOps("principlesAria")}>
            <p className="syn-about-principles__kicker mono">{tOps("kicker")}</p>
            <div className="syn-about-principles__list">
              {principles.map((principle, index) => (
                <article
                  key={principle.label}
                  className="syn-about-principle syn-stagger-child"
                  style={{ "--stagger": principle.stagger } as CSSProperties}
                >
                  <span className="syn-about-principle__num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="syn-about-principle__content">
                    <h3 className="syn-about-principle__label">{principle.label}</h3>
                    <p className="syn-about-principle__body">{principle.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="syn-about-sidebar" aria-label={tOps("registryAria")}>
            <div className="syn-about-credentials">
              {credentials.map((row) => (
                <div
                  key={row.term}
                  className="syn-about-credential syn-stagger-child"
                  style={{ "--stagger": row.stagger } as CSSProperties}
                >
                  <p className="syn-about-credential__term mono">{row.term}</p>
                  <p className="syn-about-credential__detail">{row.detail}</p>
                </div>
              ))}
            </div>

            <div
              ref={chessRef}
              className="syn-about-chess syn-stagger-child"
              style={{ "--stagger": 6 } as CSSProperties}
            >
              <p className="syn-about-chess__title mono">{tChess("title")}</p>
              <div className="syn-about-chess__ratings" aria-label={tChess("ratingsAria")}>
                <ChessRating
                  rating={tChess("bulletRating")}
                  label={tChess("bulletLabel")}
                  inView={chessInView}
                />
                <span className="syn-about-chess__divider" aria-hidden />
                <ChessRating
                  rating={tChess("blitzRating")}
                  label={tChess("blitzLabel")}
                  inView={chessInView}
                />
              </div>
              <p className="syn-about-chess__body">{tChess("body")}</p>
            </div>
          </aside>
        </div>
      </div>
    </SynthesisRevealSection>
  );
}
