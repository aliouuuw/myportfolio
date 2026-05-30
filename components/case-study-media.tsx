"use client";

import Image from "next/image";
import { useState } from "react";

import { CaseMediaPlaceholder } from "@/components/case-media-placeholder";
import { getCaseStudyCover } from "@/lib/case-media";

type CaseStudyMediaProps = {
  slug?: string | null;
  variant?: "featured" | "thumb" | "story" | "modal";
  className?: string;
};

export function CaseStudyMedia({
  slug,
  variant = "featured",
  className = "",
}: CaseStudyMediaProps) {
  const cover = slug ? getCaseStudyCover(slug) : null;
  const [broken, setBroken] = useState(false);

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
          className="syn-case-media__video"
          src={cover.src}
          poster={cover.poster}
          autoPlay
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
