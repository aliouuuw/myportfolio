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
}

const statusClass: Record<WorkLedgerStatus, string> = {
  active: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
  shipped: "border-blue-500/20 text-blue-400 bg-blue-500/5",
  archived: "border-white/10 text-white/40 bg-transparent",
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
}: CaseStudyHeaderProps) {
  return (
    <header className="mx-auto w-full max-w-5xl px-6 pb-8 pt-24 sm:px-12 lg:px-24">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <p className="mono-eyebrow">{domain}</p>
        {period ? (
          <>
            <span className="text-white/20" aria-hidden>
              ·
            </span>
            <span className="mono text-[10px] text-white/40 tracking-wide">
              {period}
            </span>
          </>
        ) : null}
        {status ? (
          <span
            className={`ml-auto mono text-[10px] tracking-widest px-2 py-1 rounded-full border ${statusClass[status]}`}
          >
            {statusLabel ?? status}
          </span>
        ) : null}
        {confidential ? (
          <span className="mono text-[10px] uppercase tracking-widest text-white/40 border border-white/10 px-2 py-1 rounded-full">
            {confidentialLabel}
          </span>
        ) : null}
      </div>

      <h1 className="text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em] text-white mb-6 max-w-[65ch]">
        {title}
      </h1>

      <p className="text-lg leading-relaxed text-white/60 max-w-[68ch] mb-8">
        {summary}
      </p>

      <dl className="flex flex-wrap gap-x-8 gap-y-4 text-sm border-t border-white/5 pt-6">
        <div>
          <dt className="mono-eyebrow mb-1.5">{roleLabel}</dt>
          <dd className="text-white/85">{role}</dd>
        </div>
        {stack.length > 0 ? (
          <div>
            <dt className="mono-eyebrow mb-1.5">{stackLabel}</dt>
            <dd className="text-white/70">{stack.join(" · ")}</dd>
          </div>
        ) : null}
      </dl>
    </header>
  );
}
