interface CaseStudyProofStripProps {
  outcome?: string;
}

export function CaseStudyProofStrip({ outcome }: CaseStudyProofStripProps) {
  if (!outcome) return null;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 sm:px-12 lg:px-24">
      <p className="mono text-xs text-emerald-400/90 border-t border-white/5 pt-5 pb-2">
        {outcome}
      </p>
    </div>
  );
}
