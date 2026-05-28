"use client";

import { useState, useEffect, useRef } from "react";
import { MockSwitcher } from "@/components/mock-switcher";

const LOGS = [
  "[SYS] Booting operational sequence...",
  "[SYS] Kernel loaded. Identity: Aliou Wade",
  "[SYS] Role: Product Systems Engineer",
  "[SYS] Location: Dakar, SN",
  "[NET] Connecting to fintech sector...",
  "[OK] Connection established.",
  "",
  "> Loading active deployments..."
];

const WORK = [
  { id: "everest", name: "Everest Finance", status: "PRODUCTION", type: "fintech_stack", desc: "Unified CRM & Customer App. [TS/Postgres/Next.js]" },
  { id: "odoo_qa", name: "Odoo Testing Kit", status: "SHIPPED", type: "qa_pipeline", desc: "Acceptance suite for ERP. [Playwright/Robot]" },
  { id: "bocalbun", name: "BocalBun", status: "FROZEN", type: "framework", desc: "Bun-native entity engine. [Bun/RLS]" },
];

export default function SystemPulsePage() {
  const [bootSequence, setBootSequence] = useState<string[]>([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < LOGS.length) {
        setBootSequence(prev => [...prev, LOGS[i]]);
        i++;
      } else {
        clearInterval(interval);
        setShowPrompt(true);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bootSequence, showPrompt]);

  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-[#00ff41] font-mono p-4 md:p-8 selection:bg-[#00ff41] selection:text-black flex flex-col">
      <style>{`
        .terminal-input { background: transparent; border: none; outline: none; color: #00ff41; width: 100%; }
        .blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .scanline { position: fixed; inset: 0; pointer-events: none; z-index: 50; background: linear-gradient(to bottom, transparent 50%, rgba(0,255,65,0.02) 51%); background-size: 100% 4px; }
      `}</style>

      <div className="scanline" />

      <main className="flex-1 max-w-4xl mx-auto w-full relative z-10 pt-12 pb-32">
        {/* Boot Sequence */}
        <div className="space-y-2 opacity-80 mb-8">
          {bootSequence.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>

        {/* Interactive content revealed after boot */}
        {showPrompt && (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* Work List */}
            <section className="border border-[#00ff41]/30 p-6 relative">
              <div className="absolute -top-3 left-4 bg-[#0a0a0a] px-2 text-xs opacity-70">~/deployments</div>
              <div className="space-y-6">
                {WORK.map(w => (
                  <div key={w.id} className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 md:gap-6 group cursor-pointer hover:bg-[#00ff41]/5 p-2 -m-2 transition-colors">
                    <div className="text-xs opacity-70 pt-1">
                      [{w.status}]
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white group-hover:text-[#00ff41] transition-colors">{w.name}</span>
                        <span className="text-xs opacity-50">&lt;{w.type}&gt;</span>
                      </div>
                      <div className="text-sm opacity-80 mt-1">{w.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Writing */}
            <section className="border border-[#00ff41]/30 p-6 relative">
              <div className="absolute -top-3 left-4 bg-[#0a0a0a] px-2 text-xs opacity-70">~/docs/field_notes</div>
              <div className="group cursor-pointer">
                <div className="text-white group-hover:text-[#00ff41] transition-colors">cat why_i_stopped_bocalbun.md</div>
                <div className="text-sm opacity-70 mt-2 border-l border-[#00ff41]/30 pl-4 py-1">
                  A retrospective on framework gravity, customer absence, and the difference between building a system and building infrastructure for systems that don&apos;t yet exist... <span className="opacity-50">[read more]</span>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <div className="mb-2 opacity-70">Execute connection protocol:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { cmd: "mail", target: "wadealiou00@gmail.com", href: "mailto:wadealiou00@gmail.com" },
                  { cmd: "ping", target: "+221777228845", href: "https://wa.me/221777228845" },
                  { cmd: "ssh", target: "github.com/aliouuuw", href: "https://github.com/aliouuuw" },
                  { cmd: "curl", target: "linkedin.com/aliouuuw", href: "https://www.linkedin.com/in/aliouuuw" }
                ].map(c => (
                  <a key={c.cmd} href={c.href} className="border border-[#00ff41]/30 p-3 hover:bg-[#00ff41] hover:text-black transition-colors block text-sm">
                    <span className="opacity-70 group-hover:opacity-100">$ {c.cmd} </span>
                    {c.target}
                  </a>
                ))}
              </div>
            </section>

            {/* Fake Prompt */}
            <div className="flex items-center gap-2 pt-8 text-xl">
              <span>awade@system ~ %</span>
              <span className="w-3 h-5 bg-[#00ff41] blink inline-block" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      <MockSwitcher />
    </div>
  );
}
