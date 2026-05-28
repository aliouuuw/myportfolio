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

  const activate = () => {
    setHovered(true);
    onHover();
  };

  const handleClick = () => {
    activate();
    const target = document.getElementById("work");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <button
      type="button"
      className={`syn-entity-card p-5 md:p-6 flex flex-col md:flex-row md:items-baseline gap-4 group w-full text-left outline-none ${
        hovered ? "syn-entity-card--active" : ""
      }`}
      onMouseEnter={activate}
      onMouseLeave={() => {
        setHovered(false);
        onLeave();
      }}
      onFocus={activate}
      onBlur={onLeave}
      onClick={handleClick}
      aria-label={`${t("name")} — ${t("tag")}`}
    >
      <div className="md:w-1/3 shrink-0 pl-3">
        <div className="flex items-center gap-2">
          <p
            className={`font-medium transition-colors ${
              hovered ? "text-syn-accent" : "text-syn-ink-strong"
            }`}
          >
            {t("name")}
          </p>
          {team.current ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          ) : null}
        </div>
        <p className="mono text-[10px] text-syn-ink-subtle mt-1">
          {t("role")} · {t("period")}
        </p>
      </div>
      <div className="md:w-2/3 flex flex-col md:flex-row md:items-baseline justify-between gap-4 pl-3">
        <div className="max-w-lg min-h-[2.75rem]">
          {hovered ? (
            <p className="mono text-xs text-syn-accent leading-relaxed transition-opacity duration-200">
              &gt; {t("proof")}
            </p>
          ) : (
            <p className="text-sm text-syn-ink-muted leading-relaxed">{t("proof")}</p>
          )}
        </div>
        <span
          className={`mono text-[10px] uppercase tracking-widest shrink-0 transition-colors ${
            hovered ? "text-syn-ink-secondary" : "text-syn-ink-faint"
          }`}
        >
          {t("tag")}
        </span>
      </div>
    </button>
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
    <div className="syn-entity-card p-5 h-full group">
      <div className="pl-3 flex flex-col h-full">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <p className="font-medium text-syn-ink-strong group-hover:text-syn-accent transition-colors">
            {t("name")}
          </p>
          <div className="flex items-center gap-2">
            {project.note ? (
              <span className="mono text-[10px] uppercase tracking-widest text-amber-400/80">
                {conceptLabel}
              </span>
            ) : null}
            <span className="mono text-[10px] uppercase tracking-widest text-syn-ink-faint">
              {t("domain")}
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-syn-ink-secondary flex-1">
          {t("scope")}
        </p>
      </div>
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
          <h2 className="mt-3 text-2xl font-medium tracking-tight text-syn-ink-strong max-w-2xl">
            {t("title")}
          </h2>
        </div>
        <p className="text-xs text-syn-ink-secondary max-w-xs md:text-right leading-relaxed">
          {t("hint")}
        </p>
      </div>

      <div className="mt-10">
        <p className="mono-eyebrow mb-6">{t("employersLabel")}</p>
        <div className="flex flex-col gap-3">
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
            <p className="mono-eyebrow">{t("clientsLabel")}</p>
            <p className="text-[10px] text-syn-ink-faint mono">{t("clientsTagline")}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
