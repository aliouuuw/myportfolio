"use client";

import { useEffect, useState } from "react";
import { MockSwitcher } from "@/components/mock-switcher";

const WORK = [
  { id: "01", name: "Everest Finance", role: "Architecture & Frontend", status: "Production", summary: "Unified TypeScript stack for fintech operations." },
  { id: "02", name: "Odoo 18 Testing Toolkit", role: "QA Automation", status: "Shipped", summary: "Acceptance suite for ERP migrations." },
  { id: "03", name: "BocalBun", role: "Framework Design", status: "Frozen", summary: "Bun-native business framework." },
];

export default function OperatorGraphPage() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString("en-US", { timeZone: "Africa/Dakar", hour12: false }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-dvh bg-[#f2f2f4] text-[#111113] selection:bg-[#000] selection:text-white p-4 md:p-6 lg:p-8 font-sans pb-24">
      <style>{`
        .bento-grid { display: grid; gap: 16px; grid-template-columns: repeat(12, 1fr); grid-auto-rows: minmax(120px, auto); }
        .bento-card { background: #ffffff; border-radius: 20px; padding: 24px; box-shadow: 0 4px 24px -12px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; }
        .bento-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px -12px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.08); }
        .bento-hero { grid-column: span 12; grid-row: span 3; }
        .bento-work { grid-column: span 12; grid-row: span 4; }
        .bento-about { grid-column: span 12; grid-row: span 2; }
        .bento-contact { grid-column: span 12; grid-row: span 2; }
        @media (min-width: 768px) {
          .bento-hero { grid-column: span 8; }
          .bento-about { grid-column: span 4; grid-row: span 3; }
          .bento-work { grid-column: span 8; }
          .bento-contact { grid-column: span 4; grid-row: span 4; }
        }
        @media (min-width: 1024px) {
          .bento-hero { grid-column: span 7; }
          .bento-about { grid-column: span 5; }
          .bento-work { grid-column: span 7; }
          .bento-contact { grid-column: span 5; }
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto bento-grid pb-24">
        
        {/* HERO WIDGET */}
        <div className="bento-card bento-hero flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#111113] flex items-center justify-center text-white font-medium text-lg">A</div>
              <div>
                <h1 className="font-semibold text-lg leading-none">Aliou Wade</h1>
                <p className="text-[#66666e] text-sm mt-1">Product Systems Engineer</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#f2f2f4] px-3 py-1.5 rounded-full text-xs font-medium text-[#66666e]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available Q3 2026
            </div>
          </div>
          <div className="mt-12 relative z-10">
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold tracking-tight text-balance max-w-2xl leading-[1.05]">
              Engineering operational systems for <span className="text-blue-600">fintech</span> & high-stakes ops teams.
            </h2>
          </div>
        </div>

        {/* ABOUT / METRICS WIDGET */}
        <div className="bento-card bento-about flex flex-col justify-between bg-[#111113] text-white group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
          <div className="relative z-10">
            <p className="text-[#888892] text-xs font-mono uppercase tracking-wider mb-6">Current Coordinates</p>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-[#888892]">Location</span>
                <span className="font-mono">Dakar, SN (14.7°N)</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-[#888892]">Local Time</span>
                <span className="font-mono tabular-nums text-blue-400">{time || "00:00:00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888892]">Stack</span>
                <span className="text-right max-w-[150px]">TypeScript, Postgres, Next.js</span>
              </div>
            </div>
          </div>
          <div className="mt-8 relative z-10">
            <a href="mailto:wadealiou00@gmail.com" className="w-full block text-center bg-white text-[#111113] py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors">
              Initiate Contact
            </a>
          </div>
        </div>

        {/* WORK WIDGET */}
        <div className="bento-card bento-work flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-semibold text-lg">System Deployments</h3>
            <span className="text-xs font-mono bg-[#f2f2f4] px-2 py-1 rounded text-[#66666e]">03 ACTIVE</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2">
            {WORK.map((w) => (
              <div key={w.id} className="group/item relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-[#f8f8f9] transition-colors cursor-pointer border border-transparent hover:border-[#e5e5e8] gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-[#888892] opacity-50 group-hover/item:opacity-100 transition-opacity">{w.id}</span>
                  <div>
                    <h4 className="font-medium text-[#111113]">{w.name}</h4>
                    <p className="text-sm text-[#66666e]">{w.role}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right flex-1 sm:ml-8">
                  <p className="text-sm text-[#66666e]">{w.summary}</p>
                </div>
                <div className="hidden sm:block opacity-0 group-hover/item:opacity-100 transform translate-x-2 group-hover/item:translate-x-0 transition-all text-blue-600">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WRITING / ESSAY WIDGET */}
        <div className="bento-card bento-contact flex flex-col justify-between group cursor-pointer bg-gradient-to-br from-white to-[#f8f8f9]">
          <div>
            <p className="text-[#888892] text-xs font-mono uppercase tracking-wider mb-4">Latest Field Note</p>
            <h3 className="text-2xl font-serif leading-tight">Why I stopped building BocalBun.</h3>
            <p className="mt-4 text-[#66666e] text-sm leading-relaxed">
              A retrospective on framework gravity, customer absence, and the difference between building a system and building infrastructure for systems that don&apos;t yet exist.
            </p>
          </div>
          <div className="mt-8 flex justify-between items-center text-sm font-medium text-blue-600">
            <span>Read Essay</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

      </div>
      <MockSwitcher />
    </div>
  );
}
