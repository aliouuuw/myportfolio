"use client";

import type { ReactNode } from "react";

type SynthesisSectionHeaderProps = {
  index?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  aside?: ReactNode;
  className?: string;
};

export function SynthesisSectionHeader({
  index,
  eyebrow,
  title,
  lead,
  aside,
  className = "",
}: SynthesisSectionHeaderProps) {
  return (
    <header
      className={`syn-section-header flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div className={`flex min-w-0 ${index ? "gap-5 sm:gap-8" : ""}`}>
        {index ? (
          <span
            className="syn-section-index mono shrink-0 select-none"
            aria-hidden
          >
            {index}
          </span>
        ) : null}
        <div className={`min-w-0 ${index ? "pt-1" : ""}`}>
          {eyebrow ? <p className="mono-eyebrow mb-3">{eyebrow}</p> : null}
          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium tracking-[-0.03em] leading-[1.08] text-syn-ink-strong">
            {title}
          </h2>
          {lead ? (
            <p className="mt-3 text-sm md:text-base text-syn-ink-secondary max-w-2xl leading-relaxed">
              {lead}
            </p>
          ) : null}
        </div>
      </div>
      {aside ? <div className="shrink-0 sm:pb-1">{aside}</div> : null}
    </header>
  );
}
