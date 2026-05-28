"use client";

import { useEffect, useRef } from "react";
import { MockSwitcher } from "@/components/mock-switcher";

const WORK = [
  { id: "01", name: "Everest Finance", label: "Fintech", color: "from-blue-500/20 to-purple-500/20" },
  { id: "02", name: "Odoo Toolkit", label: "ERP/QA", color: "from-emerald-500/20 to-teal-500/20" },
  { id: "03", name: "BocalBun", label: "Framework", color: "from-orange-500/20 to-red-500/20" },
];

export default function MagneticFieldPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax effect for cards
    const handleScroll = () => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll('.spatial-card');
      
      
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        
        // Scale down cards as they move up
        if (rect.top < 100) {
          const scale = Math.max(0.9, 1 - (100 - rect.top) * 0.001);
          const yOffset = (100 - rect.top) * 0.5;
          (card as HTMLElement).style.transform = `scale(${scale}) translateY(${yOffset}px)`;
          (card as HTMLElement).style.opacity = Math.max(0, scale).toString();
        } else {
          (card as HTMLElement).style.transform = `scale(1) translateY(0px)`;
          (card as HTMLElement).style.opacity = "1";
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="bg-[#050505] text-[#ededed] font-sans selection:bg-white/20 pb-32">
      <style>{`
        .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .spatial-card { position: sticky; top: 100px; transform-origin: top center; transition: transform 0.1s linear, opacity 0.1s linear; }
      `}</style>

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="min-h-dvh flex flex-col items-center justify-center text-center px-6 relative">
        <div className="glass-panel px-4 py-1.5 rounded-full text-xs font-medium tracking-wide mb-8 inline-flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>Aliou Wade — Product Systems Engineer</span>
        </div>
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-medium tracking-tighter leading-[1.1] max-w-4xl bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
          Crafting operational software for complex systems.
        </h1>
        <p className="mt-8 text-xl text-white/50 max-w-xl font-light">
          Internal tools, CRMs, and administrative surfaces engineered for scale and precision.
        </p>
      </section>

      {/* Spatial Cards (Work) */}
      <section className="max-w-3xl mx-auto px-6 pt-32 pb-64">
        <div className="text-center mb-32">
          <h2 className="text-3xl font-medium tracking-tight">Selected Systems</h2>
        </div>
        
        <div className="space-y-8 relative">
          {WORK.map((w, i) => (
            <div 
              key={w.id} 
              className={`spatial-card glass-panel rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col justify-between bg-gradient-to-br ${w.color} overflow-hidden group cursor-pointer`}
              style={{ zIndex: i + 10 }}
            >
              <div className="flex justify-between items-start">
                <span className="glass-panel px-3 py-1 rounded-full text-xs">{w.label}</span>
                <span className="text-sm font-mono opacity-50">{w.id}</span>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-medium tracking-tight group-hover:scale-105 transition-transform duration-500 origin-left">{w.name}</h3>
                <div className="mt-8 flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <span>Explore system</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Writing & Contact */}
      <section className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-50 bg-[#050505] pt-32">
        <div className="glass-panel rounded-3xl p-8 md:p-10 flex flex-col justify-between group hover:bg-white/5 transition-colors cursor-pointer">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Field Note</p>
            <h3 className="text-2xl font-medium tracking-tight text-white/90 group-hover:text-white transition-colors">Why I stopped building BocalBun</h3>
          </div>
          <div className="mt-12 text-sm text-white/50">Read essay →</div>
        </div>

        <div className="glass-panel rounded-3xl p-8 md:p-10 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Engage</p>
            <h3 className="text-2xl font-medium tracking-tight text-white/90">Available for Q3 2026</h3>
          </div>
          <div className="mt-12 flex flex-col gap-4">
            <a href="mailto:wadealiou00@gmail.com" className="flex justify-between items-center text-sm hover:text-white transition-colors text-white/60">
              Email <span>↗</span>
            </a>
            <div className="h-px bg-white/10 w-full" />
            <a href="https://github.com/aliouuuw" className="flex justify-between items-center text-sm hover:text-white transition-colors text-white/60">
              GitHub <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <MockSwitcher />
    </div>
  );
}
