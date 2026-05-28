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
  index?: number;
};

export function SynthesisWorkRow({
  locale,
  work,
  highlighted,
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

  const className = `syn-entity-card stacking-card group flex flex-col lg:flex-row lg:items-center justify-between p-5 md:p-6 gap-4 lg:gap-6 ${
    highlighted ? "work-row--highlight syn-entity-card--active" : ""
  }`;

  const style = { "--index": index } as React.CSSProperties;

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
            style={{ viewTransitionName: `title-${work.slug}` }}
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
        style={style}
      >
        {content}
      </TransitionLink>
    );
  }

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className} style={style}>
      {content}
    </div>
  );
}
