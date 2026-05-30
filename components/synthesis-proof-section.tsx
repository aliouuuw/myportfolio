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
        lead={tWork("lead")}
        aside={
          <TransitionLink
            href={`/${locale}/work`}
            className="syn-work-see-all text-xs text-syn-ink-muted hover:text-syn-ink transition-colors"
          >
            {tWork("seeAll")} →
          </TransitionLink>
        }
      />

      <div className="mt-8">
        <SynthesisWorkStories
          locale={locale}
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
        <SynthesisSectionHeader
          eyebrow={tTeams("eyebrow")}
          title={tTeams("title")}
          lead={tTeams("lead")}
          className="mb-6"
        />
        <SynthesisCareerGraph locale={locale} />
      </div>
    </SynthesisRevealSection>
  );
}
