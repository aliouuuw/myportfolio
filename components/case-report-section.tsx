import type { ReactNode } from "react";

interface CaseReportSectionProps {
  /** Section number (01, 02, etc.) */
  number: string;
  /** Section title */
  title: string;
  /** Section content */
  children: ReactNode;
  /** Optional delay for stagger animation (in ms) — applied as CSS animation-delay */
  delay?: number;
}

/**
 * CaseReportSection — numbered section header with hairline separator.
 *
 * Always renders content visible. A pure-CSS subtle reveal animation runs
 * once on mount (and is disabled by `prefers-reduced-motion`). No
 * IntersectionObserver / setState dance, so SSR and pre-hydration are
 * always readable — no "empty gap" artifacts.
 */
export function CaseReportSection({
  number,
  title,
  children,
  delay = 0,
}: CaseReportSectionProps) {
  return (
    <section
      className="case-report-section"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-6 flex items-baseline gap-4">
        <span className="font-mono text-[11px] font-medium tracking-tight text-ink-tertiary">
          {number}
        </span>
        <div className="hairline flex-1" />
      </div>

      <h2 className="mb-6 font-serif text-xl font-normal text-ink-primary sm:text-2xl">
        {title}
      </h2>

      <div className="max-w-[68ch] text-base leading-relaxed text-ink-secondary">
        {children}
      </div>
    </section>
  );
}

export default CaseReportSection;
