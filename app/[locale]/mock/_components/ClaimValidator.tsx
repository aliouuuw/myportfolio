"use client";

import { useState } from "react";
import { gsap } from "gsap";
import { MagneticButton } from "./MagneticButton";

interface Claim {
  text: string;
  proof: string;
  ref: string;
}

interface ClaimValidatorProps {
  claims: Claim[];
}

export function ClaimValidator({ claims }: ClaimValidatorProps) {
  const [validated, setValidated] = useState<Record<number, boolean>>({});

  const validate = (index: number, element: HTMLElement | null) => {
    if (!element || validated[index]) return;

    // Animate the reveal
    const proofEl = element.querySelector(".claim-proof");
    const lineEl = element.querySelector(".claim-line");

    gsap.to(lineEl, {
      width: "100%",
      duration: 0.8,
      ease: "power2.inOut",
    });

    gsap.to(proofEl, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: 0.4,
      ease: "power2.out",
    });

    setValidated((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="space-y-6">
      {claims.map((claim, i) => (
        <div
          key={i}
          className="claim-item relative group cursor-pointer p-6 rounded-2xl border border-ink-primary/5 bg-canvas-elevated/10 hover:bg-canvas-elevated/30 transition-all duration-300"
          onMouseEnter={(e) => validate(i, e.currentTarget)}
        >
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <p className="text-xl md:text-2xl text-ink-primary font-light leading-relaxed">
                {claim.text}
              </p>

              {/* Proof reveal */}
              <div className="claim-proof opacity-0 translate-x-4 mt-4 flex items-center gap-4">
                <span className="text-xs text-ink-primary bg-ink-primary/5 border border-ink-primary/10 rounded px-2 py-0.5 font-mono tracking-wider uppercase">
                  {claim.ref}
                </span>
                <span className="text-sm text-ink-secondary italic">{claim.proof}</span>
              </div>

              {/* Animated line */}
              <div className="claim-line h-px bg-gradient-to-r from-ink-primary/30 to-transparent w-0 mt-4" />
            </div>

            <MagneticButton
              className="flex-shrink-0 w-12 h-12 rounded-full border border-ink-primary/15 flex items-center justify-center text-ink-secondary hover:border-ink-primary hover:text-ink-primary transition-colors bg-canvas-elevated/40"
              strength={0.6}
            >
              <span className={`text-lg transition-transform duration-300 ${validated[i] ? "rotate-45" : ""}`}>
                {validated[i] ? "✓" : "→"}
              </span>
            </MagneticButton>
          </div>
        </div>
      ))}
    </div>
  );
}
