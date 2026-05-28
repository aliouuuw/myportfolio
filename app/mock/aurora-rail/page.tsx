"use client";

import { useEffect, useRef } from "react";
import { MockSwitcher } from "@/components/mock-switcher";

const WORK = [
  { id: "I.", name: "Everest Finance", category: "Fintech Platform", client: "Internal", year: "2024" },
  { id: "II.", name: "Odoo Testing Toolkit", category: "QA Automation", client: "Ergobit", year: "2023" },
  { id: "III.", name: "BocalBun", category: "Framework Design", client: "Open Source", year: "2023" },
];

export default function AuroraRailPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Smooth horizontal scroll effect on mouse wheel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      // if not scrolling horizontally naturally, convert vertical to horizontal
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 2, behavior: "auto" });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div className="h-dvh bg-[#dfdbd3] text-[#1c1a17] overflow-hidden flex flex-col font-serif selection:bg-[#c4785a] selection:text-[#dfdbd3]">
      {/* Header */}
      <header className="flex-none p-6 md:p-10 flex justify-between items-start z-10 relative mix-blend-difference text-[#dfdbd3]">
        <div className="max-w-[200px]">
          <h1 className="text-xl font-medium tracking-tight">Aliou Wade</h1>
          <p className="text-sm font-sans mt-2 opacity-80">Product Systems Engineer. Bilingual FR/EN. Operating out of Dakar.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-sans uppercase tracking-[0.2em] opacity-80">Portfolio <span className="opacity-50">—</span> 2026</p>
        </div>
      </header>

      {/* Main Horizontal Scroll Container */}
      <main ref={scrollRef} className="flex-1 flex overflow-x-auto overflow-y-hidden items-end pb-20 md:pb-32 px-6 md:px-10 gap-16 md:gap-32 snap-x snap-mandatory hide-scrollbar relative z-0">
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .editorial-title { font-size: clamp(6rem, 15vw, 14rem); line-height: 0.85; letter-spacing: -0.04em; }
          .noise-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.04; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
        `}</style>
        
        <div className="noise-overlay" />

        {/* Ambient Gradient fixed in background */}
        <div className="fixed inset-0 pointer-events-none -z-10 opacity-60">
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#c4785a] blur-[120px] mix-blend-multiply opacity-40 animate-pulse" style={{ animationDuration: "12s" }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#a8c8e8] blur-[120px] mix-blend-multiply opacity-50 animate-pulse" style={{ animationDuration: "15s" }} />
        </div>

        {/* Intro Panel */}
        <section className="flex-none w-[85vw] md:w-[60vw] snap-center shrink-0 h-full flex flex-col justify-end">
          <h2 className="editorial-title font-light mb-8">
            Operational<br />
            <span className="italic">Systems.</span>
          </h2>
          <div className="font-sans max-w-sm flex gap-4 items-center">
            <span className="w-12 h-[1px] bg-[#1c1a17]" />
            <p className="text-lg">Building internal tools, CRMs, and customer surfaces for high-stakes environments.</p>
          </div>
        </section>

        {/* Work Panels */}
        {WORK.map((w) => (
          <section key={w.id} className="flex-none w-[75vw] md:w-[45vw] snap-center shrink-0 h-full flex flex-col justify-end group">
            <div className="flex justify-between items-end border-b border-[#1c1a17]/20 pb-4 mb-4">
              <span className="font-sans text-xl opacity-40">{w.id}</span>
              <span className="font-sans uppercase text-xs tracking-widest">{w.year}</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-normal tracking-tight mb-4 group-hover:italic transition-all duration-500 cursor-pointer">{w.name}</h3>
            <div className="flex justify-between items-center font-sans text-sm mt-4">
              <span className="opacity-60">{w.category}</span>
              <span className="px-3 py-1 border border-[#1c1a17]/20 rounded-full">{w.client}</span>
            </div>
            {/* Hover Image Placeholder */}
            <div className="absolute inset-0 top-32 bottom-64 opacity-0 group-hover:opacity-10 scale-95 group-hover:scale-100 transition-all duration-700 pointer-events-none bg-[#1c1a17] rounded-3xl" />
          </section>
        ))}

        {/* Writing Panel */}
        <section className="flex-none w-[85vw] md:w-[50vw] snap-center shrink-0 h-full flex flex-col justify-end">
          <p className="font-sans uppercase text-xs tracking-widest opacity-60 mb-6">Field Note</p>
          <h3 className="text-4xl md:text-6xl font-normal leading-tight mb-8">
            Why I stopped building <span className="italic">BocalBun</span>.
          </h3>
          <a href="#" className="font-sans flex items-center gap-4 group">
            <span className="w-12 h-[1px] bg-[#1c1a17] group-hover:w-24 transition-all duration-500" />
            <span className="text-sm uppercase tracking-widest">Read Essay</span>
          </a>
        </section>

        {/* Contact Panel */}
        <section className="flex-none w-[90vw] md:w-[70vw] snap-center shrink-0 h-full flex flex-col justify-end pr-10">
          <h2 className="editorial-title font-light mb-12">
            Let&apos;s <span className="italic">Talk.</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-sans uppercase text-xs tracking-widest border-t border-[#1c1a17]/20 pt-8">
            <a href="mailto:wadealiou00@gmail.com" className="hover:opacity-50 transition-opacity">Email ↗</a>
            <a href="https://wa.me/221777228845" className="hover:opacity-50 transition-opacity">WhatsApp ↗</a>
            <a href="https://github.com/aliouuuw" className="hover:opacity-50 transition-opacity">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/aliouuuw" className="hover:opacity-50 transition-opacity">LinkedIn ↗</a>
          </div>
        </section>
      </main>

      <MockSwitcher />
    </div>
  );
}
