"use client";

import { TransitionLink } from "@/components/transition-link";
import { ScrambleText } from "@/components/scramble-text";
import { useTranslations } from "next-intl";
import { useInView } from "@/components/synthesis-reveal-section";
import {
  synthesisWorkHref,
  type SynthesisWorkRow as WorkRowData,
} from "@/lib/synthesis-data";

type SynthesisWorkRowProps = {
  locale: string;
  work: WorkRowData;
  highlighted: boolean;
  variant?: "featured" | "compact" | "list";
  index?: number;
};

export function SynthesisWorkRow({
  locale,
  work,
  highlighted,
  variant = "list",
  index = 0,
}: SynthesisWorkRowProps) {
  const t = useTranslations("HomePage.synthesis.work");
  const tRow = useTranslations(`HomePage.synthesis.work.rows.${work.id}`);
  const { ref, inView } = useInView(0.2);
  const href = synthesisWorkHref(locale, work.slug);

  const statusClass =
    work.status === "ACTIVE"
      ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
      : work.status === "SHIPPED"
        ? "border-blue-500/20 text-blue-400 bg-blue-500/5"
        : "border-syn-border-strong text-syn-ink-subtle";

  const titleStyle = href
    ? ({ viewTransitionName: `title-${work.slug}` } as React.CSSProperties)
    : undefined;

  if (variant === "featured") {
    const featuredClass = `syn-featured-work syn-entity-card group overflow-hidden ${
      highlighted ? "syn-entity-card--active" : ""
    }`;

    const body = (
      <div className="grid md:grid-cols-[1fr_min(100%,300px)]">
        <div className="flex flex-col justify-between gap-8 p-6 md:p-9 min-h-[min(52vw,320px)] md:min-h-[340px]">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="mono text-xs text-syn-ink-faint">
                <ScrambleText text={work.id} trigger="hover" />
              </span>
              <span
                className={`mono text-[10px] tracking-widest px-2 py-1 rounded-full border ${statusClass} ${inView ? "status-pulse-once" : ""}`}
              >
                {t(`status.${work.status}`)}
              </span>
            </div>
            <h3
              className="text-[clamp(1.75rem,4vw,2.75rem)] font-medium tracking-[-0.03em] leading-[1.08] text-syn-ink-strong group-hover:text-syn-accent transition-colors max-w-[18ch]"
              style={titleStyle}
            >
              {tRow("name")}
            </h3>
            <p className="mono-eyebrow mt-3">
              &lt;<ScrambleText text={work.type} trigger="hover" />&gt; · {work.year}
            </p>
          </div>
          <div>
            <p className="text-base text-syn-ink-secondary leading-relaxed max-w-xl group-hover:text-syn-ink-muted transition-colors">
              {tRow("desc")}
            </p>
            <p className="mt-5 mono text-[10px] text-syn-ink-subtle">{tRow("stack")}</p>
            {href ? (
              <p className="mt-6 text-sm font-medium text-syn-accent opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                {t("readCase")} →
              </p>
            ) : null}
          </div>
        </div>
        <div
          className="syn-featured-panel relative min-h-[180px] border-t border-syn-border md:border-t-0 md:border-l"
          aria-hidden
        >
          <div className="absolute inset-0 syn-featured-panel__wash" />
          <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-syn-ink-faint">
              {work.type.replace(/_/g, " ")}
            </span>
            <span className="text-[clamp(3rem,8vw,5rem)] font-medium leading-none tracking-tighter text-syn-ink-faint/30">
              {work.id}
            </span>
          </div>
        </div>
      </div>
    );

    if (href) {
      return (
        <TransitionLink
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          className={featuredClass}
        >
          {body}
        </TransitionLink>
      );
    }

    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className={featuredClass}>
        {body}
      </div>
    );
  }

  const compactClass = `syn-entity-card group flex flex-col gap-4 p-5 md:p-6 h-full ${
    highlighted ? "syn-entity-card--active" : ""
  }`;

  if (variant === "compact") {
    const compactBody = (
      <>
        <div className="flex items-start justify-between gap-3">
          <span className="mono text-xs text-syn-ink-faint">
            <ScrambleText text={work.id} trigger="hover" />
          </span>
          <span
            className={`mono text-[10px] tracking-widest px-2 py-1 rounded-full border shrink-0 ${statusClass}`}
          >
            {t(`status.${work.status}`)}
          </span>
        </div>
        <div>
          <h4
            className="text-lg font-medium tracking-tight text-syn-ink-strong group-hover:text-syn-accent transition-colors"
            style={titleStyle}
          >
            {tRow("name")}
          </h4>
          <p className="mono-eyebrow mt-1.5 text-[10px]">
            {work.year}
          </p>
        </div>
        <p className="text-sm text-syn-ink-secondary leading-relaxed line-clamp-3 flex-1">
          {tRow("desc")}
        </p>
        {href ? (
          <span className="text-syn-ink-faint group-hover:text-syn-accent transition-colors text-sm">
            ↗
          </span>
        ) : null}
      </>
    );

    if (href) {
      return (
        <TransitionLink
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          className={compactClass}
          style={{ "--stagger": index } as React.CSSProperties}
        >
          {compactBody}
        </TransitionLink>
      );
    }

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={compactClass}
        style={{ "--stagger": index } as React.CSSProperties}
      >
        {compactBody}
      </div>
    );
  }

  const className = `syn-entity-card group flex flex-col lg:flex-row lg:items-center justify-between p-5 md:p-6 gap-4 lg:gap-6 ${
    highlighted ? "work-row--highlight syn-entity-card--active" : ""
  }`;

  const content = (
    <>
      <div className="flex items-center gap-5 lg:w-1/4 shrink-0">
        <span className="mono text-xs text-syn-ink-faint">
          <ScrambleText text={work.id} trigger="hover" />
        </span>
        <div>
          <h4
            className={`font-medium transition-colors ${
              highlighted
                ? "text-syn-accent"
                : "text-syn-ink-strong group-hover:text-syn-accent"
            }`}
            style={titleStyle}
          >
            {tRow("name")}
          </h4>
          <p className="mono-eyebrow mt-1">
            &lt;<ScrambleText text={work.type} trigger="hover" />&gt; · {work.year}
          </p>
        </div>
      </div>
      <p className="text-sm text-syn-ink-secondary group-hover:text-syn-ink-muted transition-colors flex-1 leading-relaxed">
        {tRow("desc")}
      </p>
      <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-1/4 shrink-0">
        <span className="mono text-[10px] text-syn-ink-subtle hidden xl:inline truncate">
          {tRow("stack")}
        </span>
        <span
          className={`mono text-[10px] tracking-widest px-2 py-1 rounded-full border ${statusClass} ${inView ? "status-pulse-once" : ""}`}
        >
          {t(`status.${work.status}`)}
        </span>
        {href ? (
          <span className="text-syn-ink-faint group-hover:text-syn-accent transition-colors">
            ↗
          </span>
        ) : null}
      </div>
    </>
  );

  if (href) {
    return (
      <TransitionLink
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
      >
        {content}
      </TransitionLink>
    );
  }

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {content}
    </div>
  );
}
