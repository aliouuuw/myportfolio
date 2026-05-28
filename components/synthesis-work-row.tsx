"use client";

import Link from "next/link";
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
};

export function SynthesisWorkRow({
  locale,
  work,
  highlighted,
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
        : "border-white/10 text-white/40";

  const className = `group flex flex-col lg:flex-row lg:items-center justify-between py-6 gap-4 lg:gap-6 hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg ${highlighted ? "work-row--highlight" : ""}`;

  const content = (
    <>
      <div className="flex items-center gap-5 lg:w-1/4 shrink-0">
        <span className="mono text-xs text-white/30">{work.id}</span>
        <div>
          <h4 className="font-medium text-white/90 group-hover:text-white">
            {tRow("name")}
          </h4>
          <p className="mono-eyebrow mt-1">
            &lt;{work.type}&gt; · {work.year}
          </p>
        </div>
      </div>
      <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors flex-1 leading-relaxed">
        {tRow("desc")}
      </p>
      <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-1/4 shrink-0">
        <span className="mono text-[10px] text-white/40 hidden xl:inline truncate">
          {tRow("stack")}
        </span>
        <span
          className={`mono text-[10px] tracking-widest px-2 py-1 rounded-full border ${statusClass} ${inView ? "status-pulse-once" : ""}`}
        >
          {t(`status.${work.status}`)}
        </span>
        {href ? (
          <span className="text-white/30 group-hover:text-white/70 transition-colors">
            ↗
          </span>
        ) : null}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {content}
    </div>
  );
}
