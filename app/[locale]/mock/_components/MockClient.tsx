"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ShaderBackground } from "./ShaderBackground";
import { KineticText } from "./KineticText";
import { MagneticButton } from "./MagneticButton";
import { HorizontalLedger } from "./HorizontalLedger";
import { ClaimValidator } from "./ClaimValidator";
import { MOCK_COPY } from "./mock-config";
import { MockChrome } from "./mock-chrome";

import "../instrument.css";

gsap.registerPlugin(ScrollTrigger);

const CLAIMS = [
  { text: "Fintech operational ownership", proof: "Everest Finance stack consolidation", ref: "everest" },
  { text: "ERP acceptance testing at scale", proof: "Odoo 18 migration infrastructure", ref: "odoo" },
  { text: "Architecture judgment under constraint", proof: "Framework halt, lessons retained", ref: "bocalbun" },
];

export function MockClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Section reveal animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="awwwards-mock min-h-screen relative overflow-x-hidden">
      <MockChrome />

      {/* WebGL Background */}
      <ShaderBackground />

      {/* Main content */}
      <main className="relative z-10">
        
        {/* Hero Section */}
        <section className="min-h-screen flex items-center px-8 md:px-16 lg:px-24">
          <div className="max-w-6xl w-full pt-16">
            {/* Label */}
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-px bg-current opacity-30" />
              <span className="text-xs tracking-[0.3em] uppercase text-ink-secondary">
                Product Systems Engineer
              </span>
            </div>

            {/* Name - Kinetic */}
            <KineticText
              as="h1"
              className="font-serif text-6xl md:text-8xl lg:text-9xl text-ink-primary leading-[0.9] mb-8 font-semibold tracking-tight"
              delay={0.2}
              splitBy="chars"
            >
              {MOCK_COPY.name}
            </KineticText>

            {/* Positioning */}
            <p className="text-lg md:text-xl text-ink-secondary max-w-2xl leading-relaxed mb-12">
              {MOCK_COPY.positioning}
            </p>

            {/* Active Anchor (Everest Finance) */}
            <div className="flex items-center gap-4 text-sm text-ink-secondary bg-ink-primary/5 border border-ink-primary/10 rounded-full py-2 px-4 w-max max-w-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="truncate">{MOCK_COPY.currently}</span>
            </div>
          </div>

          {/* Elegant scroll indicator */}
          <div className="absolute bottom-12 left-8 md:left-16 flex items-center gap-4">
            <span className="text-[10px] tracking-[0.3em] uppercase text-ink-tertiary">Scroll</span>
            <div className="w-16 h-px bg-gradient-to-r from-ink-tertiary to-transparent" />
          </div>
        </section>

        {/* Claims Section */}
        <section className="reveal-section min-h-[90vh] flex items-center px-8 md:px-16 lg:px-24 py-24">
          <div className="max-w-4xl w-full">
            <div className="flex items-center gap-4 mb-16">
              <span className="text-[10px] tracking-[0.3em] uppercase text-ink-tertiary font-mono">01 // SOURCE OF TRUTH</span>
              <div className="flex-1 h-px bg-ink-primary/10" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-ink-primary mb-12 tracking-tight">
              Verified Operational Claims
            </h2>
            <ClaimValidator claims={CLAIMS} />
          </div>
        </section>

        {/* Horizontal Ledger */}
        <HorizontalLedger cases={MOCK_COPY.cases} />

        {/* Agency / Social Teaser */}
        <section className="reveal-section min-h-[80vh] flex items-center px-8 md:px-16 lg:px-24 py-24">
          <div className="max-w-5xl w-full">
            <div className="flex items-center gap-4 mb-16">
              <span className="text-[10px] tracking-[0.3em] uppercase text-ink-tertiary font-mono">03 // EXECUTION COLLABORATION</span>
              <div className="flex-1 h-px bg-ink-primary/10" />
            </div>

            <div className="grid md:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="md:col-span-7">
                <h3 className="text-3xl font-serif text-ink-primary tracking-tight mb-6">
                  Open Agency Tracking
                </h3>
                <p className="text-lg text-ink-secondary font-light leading-relaxed mb-8">
                  I believe in transparent work. In the future, developers and partners will be able to request to join active tracks, collaborate on public source nodes, and monitor shipped systems in real-time.
                </p>

                <div>
                  <MagneticButton
                    className="px-8 py-4 bg-ink-primary text-canvas rounded-full font-mono text-xs tracking-wider uppercase hover:scale-105 transition-transform duration-300"
                    strength={0.3}
                  >
                    Request Tracker Access (Soon)
                  </MagneticButton>
                </div>
              </div>

              <div className="md:col-span-5 space-y-6">
                <div className="p-6 rounded-xl border border-ink-primary/10 bg-canvas-elevated/40 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] tracking-wider uppercase text-ink-tertiary font-mono">Platform Integration</span>
                    <span className="text-ink-primary font-mono text-sm">12%</span>
                  </div>
                  <div className="h-1.5 bg-ink-primary/10 rounded-full overflow-hidden">
                    <div className="h-full w-[12%] bg-ink-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Subscribers", value: "73" },
                    { label: "Feedback", value: "28" },
                    { label: "Views", value: "1.2k" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl border border-ink-primary/5 bg-canvas-elevated/20 text-center">
                      <span className="block text-2xl text-ink-primary font-light font-mono num-tick">{stat.value}</span>
                      <span className="text-[10px] tracking-wider uppercase text-ink-tertiary mt-1 block">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-8 md:px-16 lg:px-24 border-t border-ink-primary/10 bg-canvas-elevated/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <p className="text-ink-secondary text-sm font-medium">Source of Truth + Execution Ledger</p>
              <p className="text-ink-muted text-xs mt-1 font-mono">Dakar, Senegal // Bilingual FR/EN</p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {["Work", "Writing", "About", "Contact"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-ink-secondary hover:text-ink-primary transition-colors text-xs tracking-widest uppercase font-mono"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
