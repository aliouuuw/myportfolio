"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import {
  SYNTHESIS_GITHUB_USER,
  SYNTHESIS_PINNED_REPOS,
} from "@/lib/synthesis-data";

type ContribDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type ContribData = {
  total: { lastYear: number } | Record<string, number>;
  contributions: ContribDay[];
};
type ContribYear = "last" | "all" | number;

const CONTRIB_YEARS: ContribYear[] = [
  "last",
  2026,
  2025,
  2024,
  2023,
  2022,
  2021,
  2020,
  2019,
  "all",
];

function contribLevelClass(level: number) {
  switch (level) {
    case 0:
      return "fill-white/[0.04]";
    case 1:
      return "fill-emerald-500/25";
    case 2:
      return "fill-emerald-500/50";
    case 3:
      return "fill-emerald-400/75";
    case 4:
      return "fill-emerald-300";
    default:
      return "fill-white/[0.04]";
  }
}

function contribTotal(data: ContribData, year: ContribYear): number {
  const t = data.total;
  if (typeof t !== "object" || t === null) return 0;
  if (year === "last" && "lastYear" in t) return t.lastYear;
  if (year === "all")
    return Object.values(t as Record<string, number>).reduce((a, b) => a + b, 0);
  if (typeof year === "number")
    return (t as Record<string, number>)[String(year)] ?? 0;
  return 0;
}

function contribYearLabel(year: ContribYear) {
  if (year === "last") return "12 mo";
  if (year === "all") return "All";
  return String(year);
}

function groupDaysByYear(days: ContribDay[]): Map<number, ContribDay[]> {
  const map = new Map<number, ContribDay[]>();
  for (const day of days) {
    const y = Number(day.date.slice(0, 4));
    const list = map.get(y) ?? [];
    list.push(day);
    map.set(y, list);
  }
  for (const [, list] of map) {
    list.sort((a, b) => a.date.localeCompare(b.date));
  }
  return map;
}

function ContributionHeatmap({
  days,
  compact,
  ariaLabel,
}: {
  days: ContribDay[];
  compact?: boolean;
  ariaLabel: string;
}) {
  const firstDay = days[0] ? new Date(`${days[0].date}T12:00:00`).getDay() : 0;
  const blanks: (ContribDay | null)[] = new Array(firstDay).fill(null);
  const padded: (ContribDay | null)[] = [...blanks, ...days];
  const weeks: (ContribDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

  const CELL = compact ? 9 : 11;
  const GAP = compact ? 2 : 3;
  const width = weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP);

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        style={{ minWidth: compact ? width / 2.2 : width / 1.6 }}
        role="img"
        aria-label={ariaLabel}
      >
        {weeks.map((week, x) =>
          week.map((day, y) =>
            day ? (
              <rect
                key={`${day.date}-${x}-${y}`}
                x={x * (CELL + GAP)}
                y={y * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2}
                className={contribLevelClass(day.level)}
              >
                <title>
                  {day.date} · {day.count} contribution
                  {day.count === 1 ? "" : "s"}
                </title>
              </rect>
            ) : null,
          ),
        )}
      </svg>
    </div>
  );
}

function ContributionSkeleton({ compact }: { compact?: boolean }) {
  const cols = compact ? 26 : 53;
  const t = useTranslations("HomePage.synthesis.github");
  return (
    <div className="space-y-4">
      <p className="mono text-xs text-white/30">{t("loading")}</p>
      <div
        className="grid gap-[3px] max-w-full overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols * 7 }).map((_, i) => (
          <span
            key={i}
            className="aspect-square rounded-[2px] bg-white/[0.04] animate-pulse"
            style={{ animationDelay: `${(i % cols) * 8}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function ContributionChartBody({
  user,
  year,
}: {
  user: string;
  year: ContribYear;
}) {
  const t = useTranslations("HomePage.synthesis.github");
  const [data, setData] = useState<ContribData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const param =
      year === "last" ? "last" : year === "all" ? "all" : String(year);
    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=${param}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("fetch failed"))))
      .then((json: ContribData) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, year]);

  if (error) {
    return (
      <p className="mono text-xs text-white/40 py-6">
        {t("unavailable")}{" "}
        <a
          href={`https://github.com/${user}`}
          className="text-emerald-400 hover:text-emerald-300"
        >
          github.com/{user}
        </a>
      </p>
    );
  }

  if (!data) {
    return <ContributionSkeleton compact={year === "all"} />;
  }

  const total = contribTotal(data, year);
  const periodLabel =
    year === "last"
      ? t("periodLast12")
      : year === "all"
        ? t("periodAll")
        : String(year);

  return (
    <>
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <p className="mono text-xs text-white/55">
          <span className="text-emerald-400">{total.toLocaleString()}</span>{" "}
          {t("contributions")} · {periodLabel}
        </p>
        <div className="flex items-center gap-2 mono text-[10px] text-white/40">
          <span>{t("less")}</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <svg key={l} width={11} height={11} aria-hidden>
              <rect width={11} height={11} rx={2} className={contribLevelClass(l)} />
            </svg>
          ))}
          <span>{t("more")}</span>
        </div>
      </div>

      {year === "all" ? (
        <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
          {[...groupDaysByYear(data.contributions).entries()]
            .sort(([a], [b]) => b - a)
            .map(([y, days]) => {
              const yearTotal =
                (data.total as Record<string, number>)[String(y)] ?? 0;
              return (
                <div key={y}>
                  <p className="mono text-[10px] text-white/45 mb-2">
                    {y} · <span className="text-white/65">{yearTotal}</span>
                  </p>
                  <ContributionHeatmap
                    days={days}
                    compact
                    ariaLabel={t("yearAria", { year: y, total: yearTotal })}
                  />
                </div>
              );
            })}
        </div>
      ) : (
        <ContributionHeatmap
          days={[...data.contributions].sort((a, b) =>
            a.date.localeCompare(b.date),
          )}
          ariaLabel={t("chartAria", { total, period: periodLabel })}
        />
      )}
    </>
  );
}

function ContributionChart({ user }: { user: string }) {
  const [year, setYear] = useState<ContribYear>("last");

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-1.5"
        role="tablist"
        aria-label="Contribution year"
      >
        {CONTRIB_YEARS.map((y) => (
          <button
            key={String(y)}
            type="button"
            role="tab"
            aria-selected={year === y}
            onClick={() => setYear(y)}
            className={`mono text-[10px] px-2 py-1 rounded-md border transition-colors ${
              year === y
                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
            }`}
          >
            {contribYearLabel(y)}
          </button>
        ))}
      </div>
      <ContributionChartBody key={String(year)} user={user} year={year} />
    </div>
  );
}

export function SynthesisGithubActivity() {
  const t = useTranslations("HomePage.synthesis.github");
  const user = SYNTHESIS_GITHUB_USER;

  return (
    <div className="md:col-span-5 p-6 md:p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col min-h-[280px] md:min-h-[320px]">
      <div className="flex items-baseline justify-between gap-3 mb-4 shrink-0">
        <h2 className="text-sm font-medium text-white/90">{t("title")}</h2>
        <a
          href={`https://github.com/${user}`}
          className="mono text-[10px] text-white/45 hover:text-white transition-colors"
        >
          @{user} ↗
        </a>
      </div>
      <div className="flex-1 min-h-0">
        <ContributionChart user={user} />
      </div>
      <div className="mt-5 pt-5 border-t border-white/5 shrink-0">
        <p className="text-[10px] uppercase tracking-wide text-white/40 mb-2">
          {t("pinned")}
        </p>
        <ul className="space-y-1.5">
          {SYNTHESIS_PINNED_REPOS.map((r) => (
            <li key={r.repo}>
              <a
                href={`https://github.com/${r.repo}`}
                className="group flex items-baseline justify-between gap-2 text-xs hover:bg-white/[0.02] rounded -mx-1 px-1 py-0.5 transition-colors"
              >
                <span className="mono text-white/70 group-hover:text-white truncate">
                  {r.repo.split("/")[1]}
                </span>
                <span className="text-white/40 shrink-0">{r.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
