"use client";

import { useTranslations } from "next-intl";

import { SynthesisRevealSection } from "@/components/synthesis-reveal-section";

const PROCESS_KEYS = ["discovery", "architecture", "ship"] as const;
const PRINCIPLE_KEYS = ["p1", "p2", "p3", "p4"] as const;
const STACK_KEYS = [
  "language",
  "runtime",
  "frontend",
  "backend",
  "erpQa",
  "infra",
] as const;

function GlowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`glow-card relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 ${className}`}
    >
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}

function ProcessStep({ stepKey, index }: { stepKey: string; index: number }) {
  const t = useTranslations(`HomePage.synthesis.approach.process.${stepKey}`);

  return (
    <div className="flex gap-6">
      <span className="mono text-xs text-white/30 pt-0.5">
        0{index + 1}
      </span>
      <div>
        <h3 className="text-base font-medium text-white/90">{t("title")}</h3>
        <p className="mt-1 text-sm text-white/50 leading-relaxed">{t("desc")}</p>
      </div>
    </div>
  );
}

function StackRow({ stackKey }: { stackKey: string }) {
  const t = useTranslations(`HomePage.synthesis.approach.stack.${stackKey}`);

  return (
    <div>
      <p className="text-white/40 mono-eyebrow mb-1.5">{t("label")}</p>
      <p className="text-white/80 leading-snug">{t("value")}</p>
    </div>
  );
}

export function SynthesisApproach() {
  const t = useTranslations("HomePage.synthesis.approach");

  return (
    <SynthesisRevealSection
      id="approach"
      className="pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 scroll-mt-28"
    >
      <div className="lg:col-span-7">
        <p className="mono-eyebrow">{t("eyebrow")}</p>
        <h2 className="mt-3 text-2xl font-medium tracking-tight text-white/90">
          {t("title")}
        </h2>
        <p className="mt-4 text-white/50 text-sm leading-relaxed max-w-md">
          {t("lead")}
        </p>
        <div className="mt-10 space-y-8">
          {PROCESS_KEYS.map((key, i) => (
            <ProcessStep key={key} stepKey={key} index={i} />
          ))}
        </div>
      </div>
      <div className="lg:col-span-5 flex flex-col gap-8">
        <GlowCard className="p-8">
          <p className="mono-eyebrow mb-6">{t("principlesLabel")}</p>
          <ul className="space-y-4 text-sm text-white/70 leading-relaxed">
            {PRINCIPLE_KEYS.map((key) => (
              <li key={key} className="flex gap-3">
                <span className="text-white/30">·</span>
                {t(`principles.${key}`)}
              </li>
            ))}
          </ul>
        </GlowCard>
        <GlowCard className="p-8">
          <p className="mono-eyebrow mb-6">{t("stackLabel")}</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
            {STACK_KEYS.map((key) => (
              <StackRow key={key} stackKey={key} />
            ))}
          </div>
        </GlowCard>
      </div>
    </SynthesisRevealSection>
  );
}
