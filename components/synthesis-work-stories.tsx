"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { CaseStudyMedia } from "@/components/case-study-media";
import { TransitionLink } from "@/components/transition-link";
import { SYNTHESIS_WORK, type SynthesisWorkRow } from "@/lib/synthesis-data";

const CAROUSEL_ONBOARD_KEY = "syn-carousel-onboard-seen";
const MOBILE_MQ = "(max-width: 767px)";

type SynthesisWorkStoriesProps = {
  locale: string;
  activeWorkId: string | null;
  onOpenWork: (workId: string) => void;
};

function StatusDot({ status }: { status: SynthesisWorkRow["status"] }) {
  const tone =
    status === "ACTIVE"
      ? "syn-status-dot--active"
      : status === "SHIPPED"
        ? "syn-status-dot--shipped"
        : "syn-status-dot--frozen";
  return <span className={`syn-status-dot ${tone}`} aria-hidden />;
}

function WorkTile({
  work,
  position,
  isOpen,
  onOpen,
}: {
  work: SynthesisWorkRow;
  position: number;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const t = useTranslations("HomePage.synthesis.work");
  const tRow = useTranslations(`HomePage.synthesis.work.rows.${work.id}`);

  return (
    <article role="listitem" className="syn-tile-wrap">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`syn-tile group ${isOpen ? "syn-tile--open" : ""}`}
      >
        <div className="syn-tile-media">
          <CaseStudyMedia slug={work.slug} variant="story" />
          <span className="syn-tile-gradient" aria-hidden />
          <span className="syn-tile-top">
            <span className="syn-tile-index mono">{work.id}</span>
            <span className="syn-tile-status mono">
              <StatusDot status={work.status} />
              {t(`status.${work.status}`)}
            </span>
          </span>
          <span className="syn-tile-foot">
            <span className="syn-tile-name">{tRow("name")}</span>
            <span className="syn-tile-meta mono">
              {work.type.replace(/_/g, " ")} · {work.year}
            </span>
          </span>
          <span className="syn-tile-open mono" aria-hidden>
            {t("tileOpen")}
          </span>
        </div>
      </button>
      <span className="syn-tile-count mono" aria-hidden>
        {position} / {SYNTHESIS_WORK.length}
      </span>
    </article>
  );
}

export function SynthesisWorkStories({
  locale,
  activeWorkId,
  onOpenWork,
}: SynthesisWorkStoriesProps) {
  const t = useTranslations("HomePage.synthesis.work");
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [fullyInView, setFullyInView] = useState(false);
  const [scrollHint, setScrollHint] = useState<"none" | "right">("none");
  const [scrollFades, setScrollFades] = useState({ left: false, right: false });
  const onboardPlayedRef = useRef(false);
  const scrollTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const x = el.scrollLeft;
    setProgress(max > 0 ? x / max : 0);
    setAtStart(x <= 2);
    setAtEnd(x >= max - 2);
    if (max <= 8) {
      setScrollFades({ left: false, right: false });
    } else {
      setScrollFades({
        left: x > 12,
        right: x < max - 12,
      });
    }
  }, []);

  const clearScrollTimers = useCallback(() => {
    for (const id of scrollTimersRef.current) clearTimeout(id);
    scrollTimersRef.current = [];
  }, []);

  const dismissScrollHint = useCallback(() => {
    setScrollHint("none");
    try {
      sessionStorage.setItem(CAROUSEL_ONBOARD_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    sync();
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      sync();
      if (scrollHint === "right" && el.scrollLeft > 40) dismissScrollHint();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
    };
  }, [sync, scrollHint, dismissScrollHint]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setFullyInView(
            entry.isIntersecting && entry.intersectionRatio >= 0.55,
          );
        }
      },
      { threshold: [0, 0.55, 0.85] },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!fullyInView || onboardPlayedRef.current) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia(MOBILE_MQ).matches) return;

    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    if (maxScroll <= 8) return;

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(CAROUSEL_ONBOARD_KEY) === "1";
    } catch {
      /* ignore */
    }

    onboardPlayedRef.current = true;
    clearScrollTimers();

    const schedule = (fn: () => void, ms: number) => {
      scrollTimersRef.current.push(setTimeout(fn, ms));
    };

    if (alreadySeen) {
      sync();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    rail.scrollLeft = maxScroll;
    sync();

    schedule(() => {
      rail.scrollTo({ left: 0, behavior: reduced ? "auto" : "smooth" });
      sync();
    }, 400);

    schedule(() => {
      setScrollHint("right");
      sync();
      try {
        sessionStorage.setItem(CAROUSEL_ONBOARD_KEY, "1");
      } catch {
        /* ignore */
      }
    }, reduced ? 520 : 1750);

    return clearScrollTimers;
  }, [fullyInView, sync, clearScrollTimers]);

  const nudge = useCallback((dir: -1 | 1) => {
    dismissScrollHint();
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".syn-tile-wrap");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, [dismissScrollHint]);

  return (
    <div ref={rootRef} className="syn-carousel">
      <div className="syn-carousel-controls">
        <div className="syn-carousel-controls__left">
          <div className="syn-carousel-arrows">
            <button
              type="button"
              className="syn-carousel-arrow"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label={t("scrollPrev")}
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              type="button"
              className="syn-carousel-arrow"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label={t("scrollNext")}
            >
              <span aria-hidden>›</span>
            </button>
          </div>
        </div>
        <TransitionLink
          href={`/${locale}/work`}
          className="syn-carousel-see-all text-xs text-syn-ink-muted hover:text-syn-ink transition-colors shrink-0"
        >
          {t("seeAll")} →
        </TransitionLink>
      </div>

      <div className="syn-carousel-rail-wrap">
        <div
          ref={railRef}
          className="syn-carousel-rail -mx-4 px-4 md:mx-0 md:px-0"
          role="list"
          onPointerDown={dismissScrollHint}
        >
          {SYNTHESIS_WORK.map((work, i) => (
            <WorkTile
              key={work.id}
              work={work}
              position={i + 1}
              isOpen={activeWorkId === work.id}
              onOpen={() => onOpenWork(work.id)}
            />
          ))}
        </div>

        <div
          className={`syn-carousel__fade syn-carousel__fade--left${scrollFades.left ? " is-visible" : ""}`}
          aria-hidden
        />
        <div
          className={`syn-carousel__fade syn-carousel__fade--right${scrollFades.right ? " is-visible" : ""}`}
          aria-hidden
        />

        {scrollHint === "right" ? (
          <p className="syn-carousel__scroll-hint" role="status">
            {t("scrollHintRight")}
            <span className="syn-carousel__scroll-hint-arrows" aria-hidden>
              <span>›</span>
              <span>›</span>
              <span>›</span>
            </span>
          </p>
        ) : null}
      </div>

      <div className="syn-carousel-track" aria-hidden>
        <span
          className="syn-carousel-thumb"
          style={{
            width: `${100 / SYNTHESIS_WORK.length}%`,
            transform: `translateX(${progress * (SYNTHESIS_WORK.length - 1) * 100}%)`,
          }}
        />
      </div>
    </div>
  );
}
