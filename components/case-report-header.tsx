import { ClassificationStamp } from "./classification-stamp";

interface CaseReportHeaderProps {
  /** File reference number (e.g., "CF-001") */
  fileRef: string;
  /** Classification label (e.g., "CONFIDENTIAL") */
  classification: string;
  /** Status (ACTIVE, SHIPPED, ARCHIVED) */
  status: "ACTIVE" | "SHIPPED" | "ARCHIVED";
  /** Large serif title */
  title: string;
  /** English summary */
  summaryEn: string;
  /** French summary */
  summaryFr: string;
}

const statusLabel = {
  ACTIVE: "ACTIVE",
  SHIPPED: "SHIPPED",
  ARCHIVED: "ARCHIVED",
} as const;

export function CaseReportHeader({
  fileRef,
  classification,
  status,
  title,
  summaryEn,
  summaryFr,
}: CaseReportHeaderProps) {
  return (
    <header className="px-6 pt-24 pb-12 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
      {/* Classification header line */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-8">
        <span className="font-mono text-[11px] text-ink-tertiary tracking-tight">
          FILE: {fileRef}
        </span>
        <span className="text-ink-muted" aria-hidden="true">·</span>
        <span className="font-mono text-[11px] text-ink-tertiary tracking-tight uppercase">
          CLASSIFICATION: {classification}
        </span>
        <span className="text-ink-muted" aria-hidden="true">·</span>
        <ClassificationStamp label={statusLabel[status]} />
      </div>

      {/* Large serif title */}
      <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.15] tracking-tight text-ink-primary mb-12 max-w-[65ch]">
        {title}
      </h1>

      {/* FR/EN summary block — side by side at lg+, stacked at sm */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* English summary */}
        <div>
          <p className="font-mono text-[9px] font-medium uppercase tracking-wide text-ink-tertiary mb-3">
            EN
          </p>
          <p className="text-base leading-relaxed text-ink-secondary">
            {summaryEn}
          </p>
        </div>

        {/* French summary */}
        <div>
          <p className="font-mono text-[9px] font-medium uppercase tracking-wide text-ink-tertiary mb-3">
            FR
          </p>
          <p className="text-base leading-relaxed text-ink-secondary">
            {summaryFr}
          </p>
        </div>
      </div>
    </header>
  );
}

export default CaseReportHeader;
