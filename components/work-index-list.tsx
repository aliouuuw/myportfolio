import Link from "next/link";

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
      return "border-white/10 text-white/40 bg-transparent";
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
    <Link
      href={`/${locale}/work/${entry.slug}`}
      className="group flex flex-col lg:flex-row lg:items-center justify-between py-6 gap-4 lg:gap-6 hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg"
    >
      <div className="flex items-center gap-5 lg:w-1/3 shrink-0">
        {entry.indexId ? (
          <span className="mono text-xs text-white/30">{entry.indexId}</span>
        ) : null}
        <div>
          <h2 className="font-medium text-white/90 group-hover:text-white">
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
        <span className="text-white/30 group-hover:text-white/70 transition-colors">
          ↗
        </span>
      </div>
    </Link>
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
    <Link
      href={`/${locale}/work/${entry.slug}`}
      className="group flex flex-wrap items-baseline justify-between gap-3 py-4 hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg"
    >
      <span className="text-white/75 group-hover:text-white transition-colors">
        {entry.title}
      </span>
      <span className="mono text-[10px] uppercase tracking-widest text-white/30">
        {entry.domain}
      </span>
    </Link>
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
          <h2 className="text-2xl font-medium tracking-tight mt-3 text-white/90">
            {featuredTitle}
          </h2>
        </div>
        <span className="mono-eyebrow text-white/40">{featuredAside}</span>
      </div>

      <div className="divide-y divide-white/5 border-y border-white/5">
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
          <p className="mono-eyebrow mb-6 text-white/40">{moreLabel}</p>
          <div className="divide-y divide-white/5 border-y border-white/5">
            {other.map((entry) => (
              <SupportingRow key={entry.slug} locale={locale} entry={entry} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
