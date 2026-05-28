"use client";

import { useTranslations } from "next-intl";

import { SYNTHESIS_RAIL_SECTIONS } from "@/lib/synthesis-data";

type SynthesisScrollRailProps = {
  active: string;
};

export function SynthesisScrollRail({ active }: SynthesisScrollRailProps) {
  const t = useTranslations("HomePage.synthesis.rail");

  return (
    <nav
      className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 mono text-[10px] uppercase tracking-widest"
      aria-label={t("ariaLabel")}
    >
      {SYNTHESIS_RAIL_SECTIONS.map((s) => {
        const label = t(s.label);
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`transition-colors py-0.5 ${active === s.id ? "text-syn-accent" : "text-syn-ink-faint hover:text-syn-ink-secondary"}`}
            aria-current={active === s.id ? "true" : undefined}
          >
            {active === s.id ? `› ${label}` : label}
          </a>
        );
      })}
    </nav>
  );
}
