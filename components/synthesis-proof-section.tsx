"use client";

import { useCallback, useState } from "react";
import { TransitionLink } from "@/components/transition-link";
import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import { SynthesisSectionHeader } from "@/components/synthesis-section-header";
import { SynthesisWorkModal } from "@/components/synthesis-work-modal";
import { SynthesisWorkStories } from "@/components/synthesis-work-stories";
import {
  SYNTHESIS_TEAMS,
  SYNTHESIS_WORK,
  synthesisWorkHref,
  type SynthesisTeam,
} from "@/lib/synthesis-data";

type SynthesisProofSectionProps = {
  locale: string;
  highlightedWork: string[];
  onHighlightChange: (workIds: string[]) => void;
};

function EmployerPill({
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
  const caseHref = (() => {
    const id = team.linkedWork[0];
    if (!id) return undefined;
    const row = SYNTHESIS_WORK.find((w) => w.id === id);
    return row ? synthesisWorkHref(locale, row.slug) : undefined;
  })();

  const className =
    "syn-employer-pill group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-syn-border bg-syn-surface px-4 py-2.5 text-left transition-[border-color,background-color,transform,box-shadow] duration-300 hover:border-syn-border-strong hover:bg-syn-surface-hover";

  const inner = (
    <>
      <span className="font-medium text-sm text-syn-ink-strong whitespace-nowrap">
        {t("name")}
      </span>
      <span className="mono text-[10px] text-syn-ink-subtle whitespace-nowrap hidden sm:inline">
        {t("period")}
      </span>
      {team.current ? (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 pulse-dot"
          aria-hidden
        />
      ) : null}
      {caseHref ? (
        <span className="text-syn-ink-faint group-hover:text-syn-accent transition-colors text-xs" aria-hidden>
          ↗
        </span>
      ) : null}
    </>
  );

  if (caseHref) {
    return (
      <TransitionLink
        href={caseHref}
        className={className}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onFocus={onHover}
        onBlur={onLeave}
      >
        {inner}
      </TransitionLink>
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

export function SynthesisProofSection({
  locale,
  highlightedWork,
  onHighlightChange,
}: SynthesisProofSectionProps) {
  const tWork = useTranslations("HomePage.synthesis.work");
  const tTeams = useTranslations("HomePage.synthesis.workedWith");

  const [openWorkId, setOpenWorkId] = useState<string | null>(null);
  const openWork =
    SYNTHESIS_WORK.find((w) => w.id === openWorkId) ?? null;

  const handleOpenWork = useCallback((workId: string) => {
    setOpenWorkId(workId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenWorkId(null);
  }, []);

  return (
    <SynthesisRevealSection id="work" className="scroll-mt-28">
      <SynthesisSectionHeader
        eyebrow={tWork("eyebrow")}
        title={tWork("title")}
        lead={tWork("aside")}
        aside={
          <TransitionLink
            href={`/${locale}/work`}
            className="text-xs text-syn-ink-muted hover:text-syn-ink transition-colors"
          >
            {tWork("seeAll")} →
          </TransitionLink>
        }
      />

      <div className="mt-8">
        <SynthesisWorkStories
          highlightedWork={highlightedWork}
          activeWorkId={openWorkId}
          onOpenWork={handleOpenWork}
        />
      </div>

      <SynthesisWorkModal
        work={openWork}
        onClose={handleCloseModal}
        onNavigate={handleOpenWork}
      />

      <div className="mt-14 pt-10 border-t border-syn-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-5">
          <div>
            <p className="mono-eyebrow">{tTeams("employersLabel")}</p>
            <p className="mt-2 text-sm text-syn-ink-secondary max-w-xl leading-relaxed">
              {tTeams("contextHint")}
            </p>
          </div>
          <TransitionLink
            href={`/${locale}/work`}
            className="text-xs text-syn-ink-muted hover:text-syn-ink transition-colors shrink-0"
          >
            {tTeams("clientsLink")} →
          </TransitionLink>
        </div>
        <div className="syn-employer-rail -mx-4 px-4 md:mx-0 md:px-0">
          {SYNTHESIS_TEAMS.map((team) => (
            <EmployerPill
              key={team.key}
              locale={locale}
              team={team}
              onHover={() => onHighlightChange(team.linkedWork)}
              onLeave={() => onHighlightChange([])}
            />
          ))}
        </div>
      </div>
    </SynthesisRevealSection>
  );
}
