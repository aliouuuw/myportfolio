"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { SYNTHESIS_GITHUB_USER } from "@/lib/synthesis-data";
import {
  type GithubContribData,
  type GithubContribDay,
  githubContributionsApiPath,
} from "@/lib/github-contributions";

type ContribDay = GithubContribDay;
type ContribData = GithubContribData;
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
    case 1:
      return "contrib-cell-1";
    case 2:
      return "contrib-cell-2";
    case 3:
      return "contrib-cell-3";
    case 4:
      return "contrib-cell-4";
    default:
      return "contrib-cell-0";
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

function buildWeekGrid(days: ContribDay[]) {
  const firstDay = days[0] ? new Date(`${days[0].date}T12:00:00`).getDay() : 0;
  const blanks: (ContribDay | null)[] = new Array(firstDay).fill(null);
  const padded: (ContribDay | null)[] = [...blanks, ...days];
  const weeks: (ContribDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

function ContributionHeatmap({
  days,
  compact,
  animated,
  ariaLabel,
}: {
  days: ContribDay[];
  compact?: boolean;
  animated?: boolean;
  ariaLabel: string;
}) {
  const weeks = buildWeekGrid(days);
  const CELL = compact ? 9 : 11;
  const GAP = compact ? 2 : 3;
  const width = weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP);

  return (
    <div className="syn-contrib-scroll">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        className="syn-contrib-svg"
        role="img"
        aria-label={ariaLabel}
      >
        {weeks.map((week, x) =>
          week.map((day, y) => {
            if (!day) return null;
            const revealDelay = x * 32 + y * 14;
            const liveDelay = (x * 19 + y * 41 + day.level * 120) % 4800;

            return (
              <rect
                key={`${day.date}-${x}-${y}`}
                x={x * (CELL + GAP)}
                y={y * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2}
                className={[
                  contribLevelClass(day.level),
                  animated ? "contrib-cell-reveal" : "",
                  animated && day.level > 0 ? "contrib-cell-live" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={
                  animated
                    ? ({
                        "--reveal-delay": `${revealDelay}ms`,
                        "--live-delay": `${liveDelay}ms`,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <title>
                  {day.date} · {day.count} contribution
                  {day.count === 1 ? "" : "s"}
                </title>
              </rect>
            );
          }),
        )}
      </svg>
    </div>
  );
}

function ContributionSkeleton() {
  const t = useTranslations("HomePage.synthesis.github");
  const cols = 53;
  return (
    <div className="space-y-4">
      <p className="mono text-xs text-syn-ink-faint">{t("loading")}</p>
      <div
        className="grid gap-[3px] w-full"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols * 7 }).map((_, i) => (
          <span
            key={i}
            className="aspect-square rounded-[2px] bg-contrib-0 animate-pulse"
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
  animated,
}: {
  user: string;
  year: ContribYear;
  animated: boolean;
}) {
  const t = useTranslations("HomePage.synthesis.github");
  const [data, setData] = useState<ContribData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const param =
      year === "last" ? "last" : year === "all" ? "all" : String(year);
    fetch(githubContributionsApiPath(param))
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
  }, [year]);

  if (error) {
    return (
      <p className="mono text-xs text-syn-ink-subtle py-6">
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
    return <ContributionSkeleton />;
  }

  const total = contribTotal(data, year);
  const periodLabel =
    year === "last"
      ? t("periodLast12")
      : year === "all"
        ? t("periodAll")
        : String(year);

  const sortedDays = [...data.contributions].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  return (
    <>
      <div className="syn-contrib-meta">
        <p className="mono text-xs text-syn-ink-secondary">
          <span className="text-emerald-400">{total.toLocaleString()}</span>{" "}
          {t("contributions")} · {periodLabel}
        </p>
        <div className="flex items-center gap-2 mono text-[10px] text-syn-ink-subtle">
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
                  <p className="mono text-[10px] text-syn-ink-subtle mb-2">
                    {y} · <span className="text-syn-ink-muted">{yearTotal}</span>
                  </p>
                  <ContributionHeatmap
                    days={days}
                    compact
                    animated={animated}
                    ariaLabel={t("yearAria", { year: y, total: yearTotal })}
                  />
                </div>
              );
            })}
        </div>
      ) : (
        <ContributionHeatmap
          days={sortedDays}
          animated={animated}
          ariaLabel={t("chartAria", { total, period: periodLabel })}
        />
      )}
    </>
  );
}

function ContributionChart({
  user,
  animated,
}: {
  user: string;
  animated: boolean;
}) {
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
                : "border-syn-border-strong text-syn-ink-subtle hover:text-syn-ink-muted hover:border-syn-border-strong"
            }`}
          >
            {contribYearLabel(y)}
          </button>
        ))}
      </div>
      <ContributionChartBody
        key={String(year)}
        user={user}
        year={year}
        animated={animated}
      />
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export function SynthesisGithubActivity() {
  const t = useTranslations("HomePage.synthesis.github");
  const user = SYNTHESIS_GITHUB_USER;
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="syn-github-band" aria-labelledby="syn-github-title">
      <div className="syn-github-band-inner">
        <div className="syn-github-head">
          <h2 id="syn-github-title" className="text-sm font-medium text-syn-ink-strong">
            {t("title")}
          </h2>
          <a
            href={`https://github.com/${user}`}
            className="mono text-[10px] text-syn-ink-subtle hover:text-syn-ink transition-colors"
          >
            @{user} ↗
          </a>
        </div>
        <ContributionChart user={user} animated={!reducedMotion} />
        <p className="syn-github-scope-note">
          <span className="block">{t("scopeNoteLine1")}</span>
          <span className="block">{t("scopeNoteLine2")}</span>
        </p>
      </div>
    </section>
  );
}
