"use client";

import type { ReactNode } from "react";

type SynthesisSectionHeaderProps = {
  index?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  aside?: ReactNode;
  variant?: "default" | "compact";
  titleId?: string;
  className?: string;
};

export function SynthesisSectionHeader({
  index,
  eyebrow,
  title,
  lead,
  aside,
  variant = "default",
  titleId,
  className = "",
}: SynthesisSectionHeaderProps) {
  const titleClass =
    variant === "compact"
      ? "syn-section-title syn-section-title--compact"
      : "syn-section-title";

  const leadClass =
    variant === "compact"
      ? "mt-2 text-sm text-syn-ink-secondary max-w-2xl leading-relaxed"
      : "syn-section-lead";

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
          <h2 id={titleId} className={titleClass}>
            {title}
          </h2>
          {lead ? <p className={leadClass}>{lead}</p> : null}
        </div>
      </div>
      {aside ? <div className="shrink-0 sm:pb-1">{aside}</div> : null}
    </header>
  );
}
