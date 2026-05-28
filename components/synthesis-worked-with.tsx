"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import {
  SYNTHESIS_FREELANCE,
  SYNTHESIS_TEAMS,
  type SynthesisFreelanceProject,
  type SynthesisTeam,
} from "@/lib/synthesis-data";

type SynthesisWorkedWithProps = {
  onHighlightChange: (workIds: string[]) => void;
};

function TeamRow({
  team,
  onHover,
  onLeave,
}: {
  team: SynthesisTeam;
  onHover: () => void;
  onLeave: () => void;
}) {
  const t = useTranslations(`HomePage.synthesis.workedWith.teams.${team.key}`);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="py-5 flex flex-col md:flex-row md:items-baseline gap-4 hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg group"
      onMouseEnter={() => {
        setHovered(true);
        onHover();
      }}
      onMouseLeave={() => {
        setHovered(false);
        onLeave();
      }}
      onFocus={() => {
        setHovered(true);
        onHover();
      }}
      onBlur={onLeave}
      tabIndex={0}
    >
      <div className="md:w-1/3 shrink-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white/90">{t("name")}</p>
          {team.current ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          ) : null}
        </div>
        <p className="mono text-[10px] text-white/40 mt-1">
          {t("role")} · {t("period")}
        </p>
      </div>
      <div className="md:w-2/3 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div className="max-w-lg min-h-[2.75rem]">
          {hovered ? (
            <p className="mono text-xs text-emerald-400/90 leading-relaxed transition-opacity duration-200">
              &gt; {t("proof")}
            </p>
          ) : (
            <p className="text-sm text-white/60 leading-relaxed">{t("proof")}</p>
          )}
        </div>
        <span className="mono text-[10px] uppercase tracking-widest text-white/30 shrink-0">
          {t("tag")}
        </span>
      </div>
    </div>
  );
}

function FreelanceProjectCard({
  project,
  conceptLabel,
}: {
  project: SynthesisFreelanceProject;
  conceptLabel: string;
}) {
  const t = useTranslations(
    `HomePage.synthesis.workedWith.clients.${project.key}`,
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <p className="font-medium text-white/85">{t("name")}</p>
        <div className="flex items-center gap-2">
          {project.note ? (
            <span className="mono text-[10px] uppercase tracking-widest text-amber-400/80">
              {conceptLabel}
            </span>
          ) : null}
          <span className="mono text-[10px] uppercase tracking-widest text-white/30">
            {t("domain")}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{t("scope")}</p>
    </div>
  );
}

export function SynthesisWorkedWith({ onHighlightChange }: SynthesisWorkedWithProps) {
  const t = useTranslations("HomePage.synthesis.workedWith");

  return (
    <SynthesisRevealSection id="worked-with" className="pt-16 scroll-mt-28">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="mono-eyebrow shrink-0">{t("eyebrow")}</p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight text-white/90 max-w-2xl">
            {t("title")}
          </h2>
        </div>
        <p className="text-xs text-white/50 max-w-xs md:text-right leading-relaxed">
          {t("hint")}
        </p>
      </div>

      <div className="mt-10">
        <p className="mono-eyebrow mb-6 text-white/40">{t("employersLabel")}</p>
        <div className="divide-y divide-white/5 border-y border-white/5">
          {SYNTHESIS_TEAMS.map((team) => (
            <TeamRow
              key={team.key}
              team={team}
              onHover={() => onHighlightChange(team.linkedWork)}
              onLeave={() => onHighlightChange([])}
            />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-baseline justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-baseline gap-3">
            <p className="mono-eyebrow text-white/40">{t("clientsLabel")}</p>
            <p className="text-[10px] text-white/30 mono">{t("clientsTagline")}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
          {SYNTHESIS_FREELANCE.map((project) => (
            <FreelanceProjectCard
              key={project.key}
              project={project}
              conceptLabel={t("conceptBadge")}
            />
          ))}
        </div>
      </div>
    </SynthesisRevealSection>
  );
}
