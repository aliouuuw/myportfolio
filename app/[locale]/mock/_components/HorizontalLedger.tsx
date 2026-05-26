"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { LedgerCase } from "./mock-config";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalLedgerProps {
  cases: LedgerCase[];
}

export function HorizontalLedger({ cases }: HorizontalLedgerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return;

    const scrollWidth = scrollRef.current.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      // Pin and scroll horizontally
      gsap.to(scrollRef.current, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          id: "horizontal", // Added ID so card animation container query works!
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Animate individual cards as they scroll into view
      const cards = scrollRef.current?.querySelectorAll(".ledger-card");
      cards?.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, rotateY: 10 },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: gsap.getById("horizontal"),
              start: "left 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [cases]);

  const statusColor = {
    active: "bg-emerald-500",
    shipped: "bg-blue-500",
    archived: "bg-amber-500",
  };

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Section header */}
      <div className="absolute top-12 left-8 md:left-16 z-20">
        <p className="text-xs tracking-[0.3em] text-ink-tertiary uppercase font-mono">02 // EXECUTION RECORD</p>
        <h2 className="text-4xl md:text-5xl font-serif text-ink-primary mt-2 font-semibold tracking-tight">Systems Shipped</h2>
      </div>

      {/* Horizontal scroll container */}
      <div ref={scrollRef} className="flex h-full items-center gap-8 px-[50vw] w-max">
        {cases.map((c, i) => (
          <article
            key={c.id}
            className="ledger-card relative w-[80vw] max-w-3xl h-[65vh] flex-shrink-0"
          >
            {/* Card container */}
            <div className="ledger-card-inner relative h-full rounded-2xl p-8 md:p-10 pt-20 flex flex-col overflow-hidden group">
              {/* Status indicator */}
              <div className="absolute top-8 left-8 flex items-center gap-2 z-10 bg-canvas/60 backdrop-blur-md rounded-full py-1 px-3 border border-ink-primary/5">
                <span className={`w-2 h-2 rounded-full ${statusColor[c.status]}`} />
                <span className="text-[10px] tracking-[0.2em] uppercase text-ink-secondary font-mono">
                  {c.status}
                </span>
              </div>

              {/* Index */}
              <div className="absolute top-4 right-8 font-mono text-7xl md:text-8xl text-ink-primary/[0.04] font-bold z-10 select-none">
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col z-10">
                <time className="font-mono text-xs text-ink-tertiary tracking-wider block">
                  {c.period}
                </time>
                <h3 className="font-serif text-3xl md:text-4xl text-ink-primary mt-4 font-semibold tracking-tight leading-snug">
                  {c.title}
                </h3>
                <p className="text-[10px] text-ink-tertiary tracking-widest uppercase font-mono mt-1">{c.domain}</p>

                {/* Proof claim */}
                <div className="mt-6 p-4 rounded-xl bg-canvas-elevated/40 border border-ink-primary/5">
                  <p className="text-xs text-ink-secondary italic leading-relaxed">“{c.proofClaim}”</p>
                  <span className="text-[10px] text-ink-tertiary uppercase tracking-wider mt-2 block font-mono">
                    → {c.proofRef}
                  </span>
                </div>

                <p className="text-ink-secondary mt-6 text-sm md:text-base leading-relaxed max-w-xl">
                  {c.summary}
                </p>

                {/* Media placeholders */}
                <div className="mt-auto grid grid-cols-3 gap-3">
                  {c.mediaSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="aspect-[16/10] rounded-xl bg-canvas-elevated/30 border border-ink-primary/5 flex items-center justify-center group-hover:border-ink-primary/10 transition-colors"
                    >
                      <div className="text-center p-2">
                        <Image
                          src="/window.svg"
                          alt=""
                          width={20}
                          height={24}
                          className="opacity-20 mx-auto dark:invert"
                        />
                        <span className="text-[9px] text-ink-tertiary tracking-wider mt-1.5 block font-mono truncate max-w-full">
                          {slot.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* End card */}
        <div className="w-[30vw] flex-shrink-0 flex items-center justify-center">
          <div className="text-center bg-canvas-elevated/20 p-8 rounded-2xl border border-ink-primary/5 backdrop-blur-xl">
            <p className="text-ink-tertiary text-xs tracking-widest uppercase font-mono">More systems</p>
            <p className="text-ink-primary text-xl mt-2 font-serif font-semibold">In Development</p>
          </div>
        </div>
      </div>
    </div>
  );
}
