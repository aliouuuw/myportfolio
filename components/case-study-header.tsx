import type { WorkLedgerStatus } from "@/lib/work-ledger-types";

interface CaseStudyHeaderProps {
  title: string;
  summary: string;
  role: string;
  domain: string;
  period?: string;
  status?: WorkLedgerStatus;
  stack: string[];
  confidential?: boolean;
  confidentialLabel?: string;
}

const statusClass: Record<WorkLedgerStatus, string> = {
  active: "text-accent border-accent/30",
  shipped: "text-[color:var(--color-success)] border-[color:var(--color-success)]/30",
  archived: "text-ink-tertiary border-border",
};

export function CaseStudyHeader({
  title,
  summary,
  role,
  domain,
  period,
  status,
  stack,
  confidential,
  confidentialLabel = "Confidential",
}: CaseStudyHeaderProps) {
  return (
    <header className="mx-auto w-full max-w-5xl px-6 pb-12 pt-24 sm:px-12 lg:px-24">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="label-micro">{domain}</span>
        {period ? (
          <>
            <span className="text-ink-muted" aria-hidden>
              ·
            </span>
            <span className="font-mono text-[11px] text-ink-tertiary tracking-wide">
              {period}
            </span>
          </>
        ) : null}
        {status ? (
          <span
            className={`ml-auto font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${statusClass[status]}`}
          >
            {status}
          </span>
        ) : null}
        {confidential ? (
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-tertiary border border-border px-2 py-0.5 rounded">
            {confidentialLabel}
          </span>
        ) : null}
      </div>

      <h1 className="font-serif text-[clamp(2rem,5vw,3.25rem)] font-normal leading-[1.12] tracking-tight text-ink-primary mb-6 max-w-[65ch]">
        {title}
      </h1>

      <p className="text-lg leading-relaxed text-ink-secondary max-w-[68ch] mb-8">
        {summary}
      </p>

      <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <div>
          <dt className="label-micro mb-1">Role</dt>
          <dd className="text-ink-primary">{role}</dd>
        </div>
        {stack.length > 0 ? (
          <div>
            <dt className="label-micro mb-1">Stack</dt>
            <dd className="text-ink-secondary">{stack.join(" · ")}</dd>
          </div>
        ) : null}
      </dl>
    </header>
  );
}
