"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import {
  SYNTHESIS_TEAMS,
  SYNTHESIS_WORK,
  synthesisWorkHref,
  type SynthesisTeam,
} from "@/lib/synthesis-data";

type SynthesisWorkedWithProps = {
  locale: string;
  onHighlightChange: (workIds: string[]) => void;
};

function primaryCaseHref(
  locale: string,
  linkedWork: string[],
): string | undefined {
  const id = linkedWork[0];
  if (!id) return undefined;
  const row = SYNTHESIS_WORK.find((w) => w.id === id);
  if (!row) return undefined;
  return synthesisWorkHref(locale, row.slug);
}

function TeamRow({
  locale,
  team,
  onHover,
  onLeave,
}: {
  locale: string;
  team: SynthesisTeam;
  onHover: () => void;
  onLeave: () => void;
}) {
  const t = useTranslations(`HomePage.synthesis.workedWith.teams.${team.key}`);
  const caseHref = primaryCaseHref(locale, team.linkedWork);

  const inner = (
    <>
      <div className="flex min-w-0 flex-1 items-baseline gap-3">
        <p className="font-medium text-syn-ink-strong truncate">{t("name")}</p>
        {team.current ? (
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 pulse-dot"
            aria-hidden
          />
        ) : null}
      </div>
      <p className="mono text-[10px] text-syn-ink-subtle shrink-0 hidden sm:block">
        {t("period")}
      </p>
      <span className="mono text-[10px] uppercase tracking-widest text-syn-ink-faint shrink-0">
        {t("tag")}
      </span>
      {caseHref ? (
        <span className="text-syn-ink-faint shrink-0" aria-hidden>
          ↗
        </span>
      ) : null}
    </>
  );

  const className =
    "syn-entity-card flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 w-full text-left transition-colors";

  if (caseHref) {
    return (
      <Link
        href={caseHref}
        className={`${className} group`}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onFocus={onHover}
        onBlur={onLeave}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className={className}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {inner}
    </div>
  );
}

export function SynthesisWorkedWith({
  locale,
  onHighlightChange,
}: SynthesisWorkedWithProps) {
  const t = useTranslations("HomePage.synthesis.workedWith");

  return (
    <SynthesisRevealSection id="worked-with" className="pt-16 scroll-mt-28">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-syn-ink-strong">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-syn-ink-secondary max-w-xl leading-relaxed">
            {t("hint")}
          </p>
        </div>
        <Link
          href={`/${locale}/work`}
          className="text-xs text-syn-ink-muted hover:text-syn-ink transition-colors shrink-0"
        >
          {t("clientsLink")} →
        </Link>
      </div>

      <ul className="mt-6 flex flex-col gap-2">
        {SYNTHESIS_TEAMS.map((team) => (
          <li key={team.key}>
            <TeamRow
              locale={locale}
              team={team}
              onHover={() => onHighlightChange(team.linkedWork)}
              onLeave={() => onHighlightChange([])}
            />
          </li>
        ))}
      </ul>
    </SynthesisRevealSection>
  );
}
