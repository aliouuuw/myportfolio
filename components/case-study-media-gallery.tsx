"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

import { CaseMediaPlaceholder } from "@/components/case-media-placeholder";
import {
  getCaseStudyMediaItems,
  type CaseMediaItem,
} from "@/lib/case-media";

type CaseStudyMediaGalleryProps = {
  slug: string | null;
  className?: string;
};

function GallerySlide({
  item,
  isActive,
  onBroken,
}: {
  item: CaseMediaItem;
  isActive: boolean;
  onBroken: () => void;
}) {
  if (item.kind === "video") {
    return (
      <video
        className="syn-gallery__asset"
        src={item.src}
        poster={item.poster}
        autoPlay={isActive}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={item.label}
      />
    );
  }

  return (
    <Image
      className="syn-gallery__asset"
      src={item.src}
      alt={item.label}
      fill
      sizes="(max-width: 1024px) 92vw, 48rem"
      onError={onBroken}
      unoptimized
    />
  );
}

export function CaseStudyMediaGallery({
  slug,
  className = "",
}: CaseStudyMediaGalleryProps) {
  const t = useTranslations("HomePage.synthesis.work");
  const items = getCaseStudyMediaItems(slug);
  const [activeIndex, setActiveIndex] = useState(0);
  const [brokenIds, setBrokenIds] = useState<Set<string>>(() => new Set());

  const markBroken = useCallback((id: string) => {
    setBrokenIds((prev) => new Set(prev).add(id));
  }, []);

  if (items.length === 0) {
    return (
      <div className={`syn-gallery syn-gallery--empty ${className}`.trim()}>
        <CaseMediaPlaceholder slug={slug} variant="modal" />
      </div>
    );
  }

  const safeIndex = Math.min(activeIndex, items.length - 1);
  const current = items[safeIndex];
  const currentBroken = brokenIds.has(current.id);

  const goPrev = () =>
    setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  const goNext = () =>
    setActiveIndex((i) => (i >= items.length - 1 ? 0 : i + 1));

  return (
    <div className={`syn-gallery ${className}`.trim()}>
      <div className="syn-gallery__stage">
        {currentBroken ? (
          <CaseMediaPlaceholder slug={slug} variant="modal" />
        ) : (
          <GallerySlide
            key={current.id}
            item={current}
            isActive
            onBroken={() => markBroken(current.id)}
          />
        )}

        {items.length > 1 ? (
          <>
            <button
              type="button"
              className="syn-gallery__nav syn-gallery__nav--prev"
              onClick={goPrev}
              aria-label={t("galleryPrev")}
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              type="button"
              className="syn-gallery__nav syn-gallery__nav--next"
              onClick={goNext}
              aria-label={t("galleryNext")}
            >
              <span aria-hidden>›</span>
            </button>
            <p className="syn-gallery__caption mono">{current.label}</p>
          </>
        ) : (
          <p className="syn-gallery__caption mono">{current.label}</p>
        )}
      </div>

      {items.length > 1 ? (
        <div
          className="syn-gallery__thumbs"
          role="tablist"
          aria-label={t("galleryTabs")}
        >
          {items.map((item, index) => {
            const isSelected = index === safeIndex;
            const thumbBroken = brokenIds.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={item.label}
                className={`syn-gallery__thumb ${isSelected ? "syn-gallery__thumb--active" : ""}`}
                onClick={() => setActiveIndex(index)}
              >
                {thumbBroken ? (
                  <span className="syn-gallery__thumb-placeholder mono">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                ) : item.kind === "video" ? (
                  <video
                    className="syn-gallery__thumb-media"
                    src={item.src}
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden
                  />
                ) : (
                  <Image
                    className="syn-gallery__thumb-media"
                    src={item.src}
                    alt=""
                    fill
                    sizes="72px"
                    style={{ objectFit: "cover" }}
                    onError={() => markBroken(item.id)}
                    unoptimized
                  />
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
