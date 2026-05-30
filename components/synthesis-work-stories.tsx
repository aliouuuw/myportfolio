"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { CaseStudyMedia } from "@/components/case-study-media";
import { SYNTHESIS_WORK, type SynthesisWorkRow } from "@/lib/synthesis-data";

type SynthesisWorkStoriesProps = {
  highlightedWork: string[];
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
  highlighted,
  isOpen,
  onOpen,
}: {
  work: SynthesisWorkRow;
  position: number;
  highlighted: boolean;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const t = useTranslations("HomePage.synthesis.work");
  const tRow = useTranslations(`HomePage.synthesis.work.rows.${work.id}`);

  return (
    <article
      role="listitem"
      className={`syn-tile-wrap ${highlighted ? "syn-tile-wrap--highlight" : ""}`}
    >
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
  highlightedWork,
  activeWorkId,
  onOpenWork,
}: SynthesisWorkStoriesProps) {
  const t = useTranslations("HomePage.synthesis.work");
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const x = el.scrollLeft;
    setProgress(max > 0 ? x / max : 0);
    setAtStart(x <= 2);
    setAtEnd(x >= max - 2);
  }, []);

  useEffect(() => {
    sync();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const nudge = useCallback((dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".syn-tile-wrap");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  return (
    <div className="syn-carousel">
      <div className="syn-carousel-controls">
        <p className="syn-carousel-hint mono">{t("storiesHint")}</p>
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

      <div
        ref={railRef}
        className="syn-carousel-rail -mx-4 px-4 md:mx-0 md:px-0"
        role="list"
      >
        {SYNTHESIS_WORK.map((work, i) => (
          <WorkTile
            key={work.id}
            work={work}
            position={i + 1}
            highlighted={highlightedWork.includes(work.id)}
            isOpen={activeWorkId === work.id}
            onOpen={() => onOpenWork(work.id)}
          />
        ))}
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
