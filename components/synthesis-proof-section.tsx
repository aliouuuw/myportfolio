"use client";

import { useCallback, useState } from "react";
import { TransitionLink } from "@/components/transition-link";
import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";
import { SynthesisSectionHeader } from "@/components/synthesis-section-header";
import { SynthesisWorkModal } from "@/components/synthesis-work-modal";
import { SynthesisWorkStories } from "@/components/synthesis-work-stories";
import { SynthesisCareerGraph } from "@/components/synthesis-career-graph";
import { SYNTHESIS_WORK } from "@/lib/synthesis-data";

type SynthesisProofSectionProps = {
  locale: string;
};

export function SynthesisProofSection({ locale }: SynthesisProofSectionProps) {
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
              {tTeams("employersLead")}
            </p>
          </div>
          <TransitionLink
            href={`/${locale}/work`}
            className="text-xs text-syn-ink-muted hover:text-syn-ink transition-colors shrink-0"
          >
            {tTeams("clientsLink")} →
          </TransitionLink>
        </div>
        <SynthesisCareerGraph locale={locale} />
      </div>
    </SynthesisRevealSection>
  );
}
