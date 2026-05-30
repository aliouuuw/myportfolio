import type { WorkLedgerStatus } from "@/lib/work-ledger-types";

interface CaseStudyHeaderProps {
  title: string;
  summary: string;
  role: string;
  domain: string;
  period?: string;
  status?: WorkLedgerStatus;
  statusLabel?: string;
  roleLabel: string;
  stackLabel: string;
  stack: string[];
  confidential?: boolean;
  confidentialLabel?: string;
  slug?: string;
}

const statusClass: Record<WorkLedgerStatus, string> = {
  active: "syn-status-badge syn-status-badge--active",
  shipped: "syn-status-badge syn-status-badge--shipped",
  archived: "syn-status-badge syn-status-badge--frozen",
};

export function CaseStudyHeader({
  title,
  summary,
  role,
  domain,
  period,
  status,
  statusLabel,
  roleLabel,
  stackLabel,
  stack,
  confidential,
  confidentialLabel = "Confidential",
  slug,
}: CaseStudyHeaderProps) {
  return (
    <header className="mx-auto w-full max-w-5xl px-6 pb-8 pt-8 sm:px-12 lg:px-24">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <p className="mono-eyebrow">{domain}</p>
        {period ? (
          <>
            <span className="text-syn-ink-dim" aria-hidden>
              ·
            </span>
            <span className="mono text-[10px] text-syn-ink-subtle tracking-wide">
              {period}
            </span>
          </>
        ) : null}
        {status ? (
          <span
            className={`ml-auto ${statusClass[status]}`}
          >
            {statusLabel ?? status}
          </span>
        ) : null}
        {confidential ? (
          <span className="mono text-[10px] uppercase tracking-widest text-syn-ink-subtle border border-syn-border-strong px-2 py-1 rounded-full">
            {confidentialLabel}
          </span>
        ) : null}
      </div>

      <h1
        className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-syn-ink mb-6 max-w-[20ch]"
        style={slug ? { viewTransitionName: `title-${slug}` } : undefined}
      >
        {title}
      </h1>

      <p className="text-lg leading-relaxed text-syn-ink-muted max-w-[68ch] mb-8">
        {summary}
      </p>

      <dl className="flex flex-wrap gap-x-8 gap-y-4 text-sm border-t border-syn-border pt-6">
        <div>
          <dt className="mono-eyebrow mb-1.5">{roleLabel}</dt>
          <dd className="text-syn-ink-strong">{role}</dd>
        </div>
        {stack.length > 0 ? (
          <div>
            <dt className="mono-eyebrow mb-1.5">{stackLabel}</dt>
            <dd className="text-syn-ink-muted">{stack.join(" · ")}</dd>
          </div>
        ) : null}
      </dl>
    </header>
  );
}
