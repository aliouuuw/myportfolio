import { TransitionLink } from "@/components/transition-link";

import type { WorkLedgerStatus } from "@/lib/work-ledger-types";

export type WorkIndexEntry = {
  slug: string;
  title: string;
  domain: string;
  period: string;
  status: WorkLedgerStatus;
  indexId?: string;
};

type WorkIndexListProps = {
  locale: string;
  featured: WorkIndexEntry[];
  other: WorkIndexEntry[];
  statusLabels: Record<WorkLedgerStatus, string>;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredAside: string;
  moreLabel: string;
};

function statusPillClass(status: WorkLedgerStatus): string {
  switch (status) {
    case "active":
      return "border-emerald-500/20 text-emerald-400 bg-emerald-500/5";
    case "shipped":
      return "border-blue-500/20 text-blue-400 bg-blue-500/5";
    case "archived":
      return "border-syn-border-strong text-syn-ink-subtle bg-transparent";
  }
}

function FeaturedRow({
  locale,
  entry,
  statusLabel,
}: {
  locale: string;
  entry: WorkIndexEntry;
  statusLabel: string;
}) {
  return (
    <TransitionLink
      href={`/${locale}/work/${entry.slug}`}
      className="syn-entity-card group flex flex-col lg:flex-row lg:items-center justify-between p-5 md:p-6 gap-4 lg:gap-6"
      style={{ viewTransitionName: `title-${entry.slug}` }}
    >
      <div className="flex items-center gap-5 lg:w-1/3 shrink-0">
        {entry.indexId ? (
          <span className="mono text-xs text-syn-ink-faint">{entry.indexId}</span>
        ) : null}
        <div>
          <h2 className="font-medium text-syn-ink-strong group-hover:text-syn-accent transition-colors">
            {entry.title}
          </h2>
          <p className="mono-eyebrow mt-1">
            {entry.domain} · {entry.period}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-1/3 shrink-0 lg:ml-auto">
        <span
          className={`mono text-[10px] tracking-widest px-2 py-1 rounded-full border ${statusPillClass(entry.status)}`}
        >
          {statusLabel}
        </span>
        <span className="text-syn-ink-faint group-hover:text-syn-accent transition-colors">
          ↗
        </span>
      </div>
    </TransitionLink>
  );
}

function SupportingRow({
  locale,
  entry,
}: {
  locale: string;
  entry: WorkIndexEntry;
}) {
  return (
    <TransitionLink
      href={`/${locale}/work/${entry.slug}`}
      className="syn-entity-card group flex flex-wrap items-baseline justify-between gap-3 p-4 md:px-5 md:py-4"
    >
      <span className="text-syn-ink-strong group-hover:text-syn-accent transition-colors">
        {entry.title}
      </span>
      <span className="mono text-[10px] uppercase tracking-widest text-syn-ink-faint">
        {entry.domain}
      </span>
    </TransitionLink>
  );
}

export function WorkIndexList({
  locale,
  featured,
  other,
  statusLabels,
  featuredEyebrow,
  featuredTitle,
  featuredAside,
  moreLabel,
}: WorkIndexListProps) {
  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="mono-eyebrow">{featuredEyebrow}</p>
          <h2 className="text-2xl font-medium tracking-tight mt-3 text-syn-ink-strong">
            {featuredTitle}
          </h2>
        </div>
        <span className="mono-eyebrow">{featuredAside}</span>
      </div>

      <div className="flex flex-col gap-3">
        {featured.map((entry) => (
          <FeaturedRow
            key={entry.slug}
            locale={locale}
            entry={entry}
            statusLabel={statusLabels[entry.status]}
          />
        ))}
      </div>

      {other.length > 0 ? (
        <div className="mt-14">
          <p className="mono-eyebrow mb-6">{moreLabel}</p>
          <div className="flex flex-col gap-3">
            {other.map((entry) => (
              <SupportingRow key={entry.slug} locale={locale} entry={entry} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
