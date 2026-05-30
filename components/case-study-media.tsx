"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { CaseMediaPlaceholder } from "@/components/case-media-placeholder";
import { getCaseStudyCover } from "@/lib/case-media";

type CaseStudyMediaProps = {
  slug?: string | null;
  variant?: "featured" | "thumb" | "story" | "modal";
  className?: string;
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

export function CaseStudyMedia({
  slug,
  variant = "featured",
  className = "",
}: CaseStudyMediaProps) {
  const cover = slug ? getCaseStudyCover(slug) : null;
  const [broken, setBroken] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || cover?.kind !== "video") return;
    if (reducedMotion) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
  }, [reducedMotion, cover?.kind]);

  if (!cover || broken) {
    return (
      <CaseMediaPlaceholder slug={slug} variant={variant} className={className} />
    );
  }

  if (cover.kind === "video") {
    return (
      <div
        className={`syn-case-media syn-case-media--${variant} ${className}`.trim()}
      >
        <video
          ref={videoRef}
          className="syn-case-media__video"
          src={cover.src}
          poster={cover.poster}
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={cover.label}
        />
      </div>
    );
  }

  return (
    <div
      className={`syn-case-media syn-case-media--${variant} ${className}`.trim()}
    >
      <Image
        className="syn-case-media__image"
        src={cover.src}
        alt={cover.label}
        fill
        sizes={
          variant === "story"
            ? "(max-width: 768px) 82vw, 32rem"
            : "(max-width: 768px) 92vw, 48rem"
        }
        onError={() => setBroken(true)}
        unoptimized
      />
    </div>
  );
}
