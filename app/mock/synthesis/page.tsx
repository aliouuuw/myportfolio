"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MockSwitcher } from "@/components/mock-switcher";

const EMAIL = "wadealiou00@gmail.com";
const BOOT_KEY = "synthesis-boot-v1";

const BOOT_LINES = [
  "> teams loaded · 7 employers",
  "> current focus · Everest Finance, ERGOBIT",
  "> availability · Q3 2026",
];

const RAIL_SECTIONS = [
  { id: "profile", label: "profile" },
  { id: "worked-with", label: "teams" },
  { id: "capabilities", label: "focus" },
  { id: "work", label: "work" },
  { id: "approach", label: "approach" },
  { id: "writing", label: "notes" },
  { id: "connect", label: "connect" },
] as const;

const PALETTE_COMMANDS = [
  { label: "Jump to selected work", href: "#work" },
  { label: "Jump to teams", href: "#worked-with" },
  { label: "Jump to connect", href: "#connect" },
  { label: "Copy email", action: "copy-email" as const },
];

/* ──────────────────────────────────────────────────────
   DATA
─────────────────────────────────────────────────────── */
const WORK = [
  { id: "01", name: "Everest Finance", type: "fintech_spine", status: "ACTIVE", year: "2024 → Now", desc: "Sole technical owner for a Senegalese fintech: public site, internal CRM, and the Sama Naffa customer app converging toward one shared operating model.", stack: "Next.js · React Native · PostgreSQL" },
  { id: "02", name: "ERGOBIT / Odoo 18", type: "erp_validation", status: "SHIPPED", year: "2024", desc: "Acceptance-testing starter kit for Odoo 18 migration teams: 39 tests across 9 suites, CI on Azure DevOps, and selector guidelines for maintainable ERP validation.", stack: "Robot Framework · Playwright · Azure DevOps" },
  { id: "03", name: "Africa GreenTec accounting", type: "odoo_automation", status: "SHIPPED", year: "2024", desc: "Custom Odoo accounting module: automated roughly 80% of manual entries and held 10,000+ records per day in production for a renewable-energy operator.", stack: "Odoo · Python · BI" },
  { id: "04", name: "BocalBun retrospective", type: "systems_judgment", status: "FROZEN", year: "2022", desc: "A deliberately stopped Bun toolkit. The proof is not adoption, it is knowing when clean architecture is not the highest-leverage work.", stack: "Bun · TypeScript · PostgreSQL · RLS" },
];

const CAPABILITIES = [
  { label: "Product systems engineering", desc: "Bridging business workflows and software. Internal tools, admin panels, and customer surfaces." },
  { label: "Finance & fintech", desc: "Open-banking APIs, CRM workflows, and secure foundations for regulated markets." },
  { label: "ERP & BI", desc: "Odoo modules, CI/CD pipelines, and acceptance testing for operational teams." },
  { label: "AI-assisted delivery", desc: "Agent-ready repositories and workflows that multiply engineering context." },
];

const TEAMS = [
  { name: "Everest Finance", role: "Solo technical owner", tag: "Fintech", period: "2024 → Now", proof: "Public site, internal CRM, Sama Naffa customer app.", current: true, linkedWork: ["01"] as string[] },
  { name: "ERGOBIT", role: "Software engineer", tag: "ERP / BI", period: "2024 → Now", proof: "Custom ERP and BI modules for Senegalese clients. CI/CD on Azure DevOps cut manual interventions by 80%.", current: true, linkedWork: ["02", "03"] },
  { name: "BankingBook Analytics", role: "Software engineer", tag: "Open banking", period: "2024", proof: "Open-banking APIs for a cloud-native ALM. UEMOA-region i18n. Web and mail server migration to bbafintech.com.", linkedWork: [] as string[] },
  { name: "Purolator", role: "Software engineer", tag: "Logistics", period: "2023", proof: "CI/CD migration across three projects. Internal Power Automate / Azure DevOps tooling. Package-sorter SDK that cut transfer latency.", linkedWork: [] as string[] },
  { name: "Orange", role: "Mobile developer", tag: "Mobile", period: "2022", proof: "React Native fitness community app, 1,000+ members. Impact reports for decision-makers.", linkedWork: [] as string[] },
  { name: "ITech Solutions Afrique", role: "IoT developer", tag: "IoT", period: "2019", proof: "Arduino geolocation system on Azure. Planning rework cut system costs by 20%.", linkedWork: [] as string[] },
  { name: "DAUST", role: "Python tutor", tag: "Education", period: "2018 → 2019", proof: "OOP mentoring for undergraduate students and self-authored course material.", linkedWork: [] as string[] },
];

type FreelanceProject = { name: string; scope: string; domain: string; note?: string };

// Local / freelance client work. Concrete domains, not adjectives.
const FREELANCE: FreelanceProject[] = [
  { name: "Ndouckmane Transit", scope: "Freight forwarder operations: shipments, customs, dashboards.", domain: "Logistics" },
  { name: "EduPlan", scope: "K-12 school operations dashboard: courses, schedule, grading.", domain: "Education" },
  { name: "Gerpain", scope: "Multi-bakery operations platform: inventory, deliveries, employees, RBAC.", domain: "Operations" },
  { name: "Mansour Motors", scope: "Automotive dealership: public site and internal vehicle inventory for the operating company.", domain: "Automotive" },
  { name: "Mamebimo", scope: "Home-services marketplace in Dakar: booking, messaging, payouts (Everest Finance product).", domain: "Marketplace" },
  { name: "Prescriptos", scope: "Pharmacy and prescription workflow tooling (monorepo, web + API).", domain: "Health" },
  { name: "Asaaman", scope: "Senegalese intelligent-drone startup: semantic video search, surveillance workflows, and reporting.", domain: "Drone / AI" },
  { name: "Bocal Tontine", scope: "Group savings rooted in African tontine traditions. Product and architecture in progress.", domain: "Fintech", note: "Concept" },
  { name: "Dakar Sport", scope: "Retail and community surfaces for a local sports brand.", domain: "Retail" },
  { name: "Les Hirondelles", scope: "Institutional site for a Dakar school: Convex-backed editorial CMS.", domain: "Institution" },
];

// Pinned repos surfaced inline under the contribution chart.
const PINNED_REPOS = [
  { repo: "aliouuuw/myportfolio",                   note: "this site" },
  { repo: "aliouuuw/odoo18-acceptance-testing-kit", note: "Robot + Playwright" },
  { repo: "aliouuuw/agent-ready-repo",              note: "AI-collab conventions" },
  { repo: "aliouuuw/bocalbun",                      note: "frozen retrospective" },
];

const GITHUB_USER = "aliouuuw";

const WRITING = [
  { date: "2025·11", title: "Why I stopped building BocalBun.", desc: "On framework gravity, customer absence, and judgment over ambition.", tag: "Retrospective" },
  { date: "2025·09", title: "Designing agent-ready repositories.", desc: "Conventions, manifests, and persistence for AI-collaborative codebases.", tag: "AI-native" },
  { date: "2025·07", title: "Acceptance testing Odoo 18 migrations.", desc: "Robot Framework + Playwright. Selectors, profiles, CI-friendly output.", tag: "ERP" },
];

const STACK_GROUPS = [
  { k: "Language", v: "TypeScript, Python" },
  { k: "Runtime", v: "Bun, Node, Deno" },
  { k: "Frontend", v: "Next.js, React, Tailwind" },
  { k: "Backend", v: "Postgres, Drizzle, RLS" },
  { k: "ERP / QA", v: "Odoo 18, Robot, Playwright" },
  { k: "Infra", v: "Vercel, Resend, Cloudflare" },
];

const PROCESS = [
  { n: "01", title: "Discovery", desc: "Workflows, spreadsheets, pain. Where the business actually leaks time." },
  { n: "02", title: "Architecture", desc: "One stack. Boring choices. Documented tradeoffs. No premature abstraction." },
  { n: "03", title: "Ship & operate", desc: "Live systems with real users. Iterate based on operational reality, not aesthetics." },
];

/* ──────────────────────────────────────────────────────
   HOOKS
─────────────────────────────────────────────────────── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function getInitialBoot() {
  if (typeof window === "undefined") return { done: false, lines: 0 };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return { done: true, lines: BOOT_LINES.length };
  }
  try {
    if (sessionStorage.getItem(BOOT_KEY) === "1") {
      return { done: true, lines: BOOT_LINES.length };
    }
  } catch {
    /* ignore */
  }
  return { done: false, lines: 0 };
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function useActiveSection(sectionIds: readonly string[]) {
  const [active, setActive] = useState(sectionIds[0]);
  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);
  return active;
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ──────────────────────────────────────────────────────
   COMPONENTS
─────────────────────────────────────────────────────── */
function GlowCard({
  children,
  className = "",
  as = "div",
  spotlight = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { as?: "div" | "a"; href?: string; spotlight?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlight || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };
  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`glow-card relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 ${spotlight ? "glow-card--spotlight" : ""} ${className}`}
      {...props}
    >
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </Tag>
  );
}

function RevealSection({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <section
      id={id}
      ref={ref as React.RefObject<HTMLElement>}
      className={`reveal-section ${inView ? "reveal-section--visible" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

function ScrollRail({ active }: { active: string }) {
  return (
    <nav
      className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 mono text-[10px] uppercase tracking-widest"
      aria-label="Section index"
    >
      {RAIL_SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`transition-colors py-0.5 ${active === s.id ? "text-emerald-400" : "text-white/25 hover:text-white/55"}`}
        >
          {active === s.id ? `› ${s.label}` : s.label}
        </a>
      ))}
    </nav>
  );
}

function CommandPalette({
  open,
  onClose,
  onCopyEmail,
}: {
  open: boolean;
  onClose: () => void;
  onCopyEmail: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4" role="dialog" aria-modal aria-label="Command palette">
      <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden">
        <p className="mono-eyebrow px-4 py-3 border-b border-white/5 text-white/40">⌘K · operator commands</p>
        <ul className="py-2">
          {PALETTE_COMMANDS.map((cmd) => (
            <li key={cmd.label}>
              {"href" in cmd ? (
                <a
                  href={cmd.href}
                  className="flex px-4 py-2.5 text-sm text-white/75 hover:bg-white/5 hover:text-white transition-colors"
                  onClick={onClose}
                >
                  {cmd.label}
                </a>
              ) : (
                <button
                  type="button"
                  className="w-full text-left flex px-4 py-2.5 text-sm text-white/75 hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => {
                    onCopyEmail();
                    onClose();
                  }}
                >
                  {cmd.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CopyToast({ visible }: { visible: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] mono text-xs px-4 py-2 rounded-full border border-emerald-500/30 bg-[#0a0a0a] text-emerald-400 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      copied to clipboard
    </div>
  );
}

function TeamRow({
  team,
  onHover,
  onLeave,
}: {
  team: (typeof TEAMS)[number];
  onHover: () => void;
  onLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="py-5 flex flex-col md:flex-row md:items-baseline gap-4 hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg group"
      onMouseEnter={() => {
        setHovered(true);
        onHover();
      }}
      onMouseLeave={() => {
        setHovered(false);
        onLeave();
      }}
      onFocus={() => {
        setHovered(true);
        onHover();
      }}
      onBlur={onLeave}
      tabIndex={0}
    >
      <div className="md:w-1/3 shrink-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white/90">{team.name}</p>
          {team.current && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />}
        </div>
        <p className="mono text-[10px] text-white/40 mt-1">
          {team.role} · {team.period}
        </p>
      </div>
      <div className="md:w-2/3 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div className="max-w-lg min-h-[2.75rem]">
          {hovered ? (
            <p className="mono text-xs text-emerald-400/90 leading-relaxed transition-opacity duration-200">&gt; {team.proof}</p>
          ) : (
            <p className="text-sm text-white/60 leading-relaxed">{team.proof}</p>
          )}
        </div>
        <span className="mono text-[10px] uppercase tracking-widest text-white/30 shrink-0">{team.tag}</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   PAGE
─────────────────────────────────────────────────────── */
export default function SynthesisPage() {
  const [time, setTime] = useState("");
  const [boot, setBoot] = useState(getInitialBoot);
  const bootDone = boot.done;
  const bootLines = boot.lines;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const [highlightedWork, setHighlightedWork] = useState<string[]>([]);
  const [ambientHour, setAmbientHour] = useState(12);

  const reducedMotion = usePrefersReducedMotion();
  const scrollProgress = useScrollProgress();
  const sectionIds = RAIL_SECTIONS.map((s) => s.id);
  const activeSection = useActiveSection(sectionIds);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyToast(true);
      window.setTimeout(() => setCopyToast(false), 2200);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }, []);

  const finishBoot = useCallback(() => {
    setBoot({ done: true, lines: BOOT_LINES.length });
    try {
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const u = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { timeZone: "Africa/Dakar", hour12: false }));
      setAmbientHour(
        Number(
          now.toLocaleString("en-US", { timeZone: "Africa/Dakar", hour: "numeric", hour12: false }),
        ),
      );
    };
    u();
    const i = setInterval(u, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (bootDone || reducedMotion) return;
    let line = 0;
    const interval = window.setInterval(() => {
      line += 1;
      setBoot((prev) => ({ ...prev, lines: line }));
      if (line >= BOOT_LINES.length) {
        window.clearInterval(interval);
        window.setTimeout(finishBoot, 380);
      }
    }, 520);
    return () => window.clearInterval(interval);
  }, [bootDone, reducedMotion, finishBoot]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const heroReady = bootDone;
  const navLinks = [
    { label: "Work", id: "work" },
    { label: "Approach", id: "approach" },
    { label: "Writing", id: "writing" },
    { label: "Connect", id: "connect" },
  ];

  const ambientClass =
    ambientHour >= 6 && ambientHour < 18 ? "ambient--day" : ambientHour >= 18 && ambientHour < 22 ? "ambient--evening" : "ambient--night";

  return (
    <div className={`min-h-dvh bg-[#050505] text-[#ededed] font-sans selection:bg-white/20 pb-20 synthesis-page ${ambientClass} ${heroReady ? "hero-ready" : ""} ${reducedMotion ? "motion-reduced" : ""}`}>
      <style>{`
        .synthesis-page {
          --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
        }
        .glow-card--spotlight::before {
          content: "";
          position: absolute; inset: 0;
          background: radial-gradient(600px circle at var(--x, 0px) var(--y, 0px), rgba(255,255,255,0.04), transparent 40%);
          opacity: 0; transition: opacity 0.45s var(--ease-out-quart); pointer-events: none; z-index: 0;
        }
        .glow-card--spotlight:hover::before { opacity: 1; }
        .grid-bento { display: grid; gap: 16px; grid-template-columns: repeat(1, 1fr); }
        @media (min-width: 768px) { .grid-bento { grid-template-columns: repeat(12, 1fr); gap: 20px; } }
        .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
        .mono-eyebrow { font-family: ui-monospace, SFMono-Regular, monospace; text-transform: uppercase; letter-spacing: 0.14em; font-size: 10px; color: rgba(255,255,255,0.35); }
        .hairline { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }
        .pulse-dot { box-shadow: 0 0 12px currentColor; }

        .scroll-progress {
          position: fixed; top: 0; left: 0; height: 2px; z-index: 60;
          background: rgba(52, 211, 153, 0.85);
          transform-origin: left;
          transition: transform 0.12s var(--ease-out-quart);
        }

        .bg-dot-grid {
          background-image: radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .bg-grain {
          opacity: 0.045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .ambient-accent {
          position: absolute;
          width: min(70vw, 720px);
          height: min(70vw, 720px);
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.35;
          animation: ambient-drift 28s ease-in-out infinite alternate;
        }
        .ambient--day .ambient-accent { background: rgba(245, 240, 230, 0.06); }
        .ambient--evening .ambient-accent { background: rgba(180, 140, 100, 0.07); }
        .ambient--night .ambient-accent { background: rgba(120, 160, 140, 0.06); }
        @keyframes ambient-drift {
          from { transform: translate(-8%, -5%); }
          to { transform: translate(12%, 8%); }
        }

        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .scan-bar { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .scan-bar::after {
          content: "";
          position: absolute; inset-y: 0; width: 28%; left: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.035), transparent);
          animation: scan 14s linear infinite;
        }
        .motion-reduced .scan-bar::after { animation: none; opacity: 0; }

        .hero-reveal {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.45s var(--ease-out-quart), transform 0.45s var(--ease-out-quart);
        }
        .hero-ready .hero-reveal {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-ready .hero-reveal--1 { transition-delay: 0ms; }
        .hero-ready .hero-reveal--2 { transition-delay: 70ms; }
        .hero-ready .hero-reveal--3 { transition-delay: 140ms; }
        .hero-ready .hero-reveal--4 { transition-delay: 210ms; }
        .hero-ready .hero-reveal--5 { transition-delay: 280ms; }
        .motion-reduced .hero-reveal { opacity: 1; transform: none; transition: none; }

        .boot-line {
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.3s var(--ease-out-quart), transform 0.3s var(--ease-out-quart);
        }
        .boot-line--visible { opacity: 1; transform: translateY(0); }

        .reveal-section {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.5s var(--ease-out-quart), transform 0.5s var(--ease-out-quart);
        }
        .reveal-section--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .motion-reduced .reveal-section {
          opacity: 1;
          transform: none;
          transition: none;
        }

        .github-card {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.4s var(--ease-out-quart), transform 0.4s var(--ease-out-quart);
        }
        .github-card--in { opacity: 1; transform: translateY(0); }
        .motion-reduced .github-card { opacity: 1; transform: none; }

        .work-row--highlight {
          background: rgba(52, 211, 153, 0.06);
        }
        .status-pulse-once { animation: status-pulse 0.6s var(--ease-out-quart) 1; }
        @keyframes status-pulse {
          0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.35); }
          100% { box-shadow: 0 0 0 6px rgba(52, 211, 153, 0); }
        }
        .motion-reduced .status-pulse-once { animation: none; }

        .btn-press:active { transform: scale(0.98); }
      `}</style>

      {/* Scroll progress */}
      <div
        className="scroll-progress"
        style={{ width: "100%", transform: `scaleX(${scrollProgress})` }}
        aria-hidden
      />

      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-dot-grid" aria-hidden>
        <div className="absolute inset-0 bg-grain" />
        <div className="ambient-accent top-[-15%] left-[-5%]" />
      </div>

      <ScrollRail active={activeSection} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onCopyEmail={copyEmail} />
      <CopyToast visible={copyToast} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#050505]/85 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-medium text-sm border border-white/5">A</div>
            <span className="font-medium text-sm">Aliou Wade</span>
            <span className="hidden sm:inline mono-eyebrow ml-2">Product Systems Eng.</span>
          </div>
          <div className="flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`hidden md:inline-flex px-3 py-1.5 rounded-full text-xs transition-colors ${
                  activeSection === l.id ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden md:inline-flex mono text-[10px] text-white/35 hover:text-white/60 px-2 py-1 transition-colors"
              aria-label="Open command palette"
            >
              ⌘K
            </button>
            <a
              href="#connect"
              className="ml-2 inline-flex items-center gap-2 bg-[#0a0a0a] border border-white/5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot text-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Available Q3 2026</span>
              <span className="sm:hidden">Available</span>
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-4 md:p-6 lg:px-8 xl:pl-24 space-y-5 md:space-y-6 pt-12 md:pt-16">

        {/* Profile — hero, GitHub activity, background, credentials */}
        <section id="profile" className="grid-bento scroll-mt-24">
          <GlowCard spotlight className="md:col-span-7 p-8 md:p-12 min-h-[320px] justify-between">
            {!reducedMotion && <div className="scan-bar" aria-hidden />}
            <div className="flex flex-wrap justify-between items-start gap-3">
              <p className="text-sm text-white/50">
                Dakar, Senegal · <span className="text-white/70">FR / EN</span>
              </p>
              <p className="mono text-xs text-white/35 hidden sm:block">{time || "00:00:00"} WAT</p>
            </div>

            {!bootDone && !reducedMotion ? (
              <button
                type="button"
                className="mt-10 text-left w-full cursor-pointer"
                onClick={finishBoot}
                aria-label="Skip intro"
              >
                <p className="text-xs text-white/35 mb-4">Loading profile · click to skip</p>
                <div className="space-y-2 mono text-sm text-emerald-400/90">
                  {BOOT_LINES.map((line, i) => (
                    <p key={line} className={`boot-line ${i < bootLines ? "boot-line--visible" : ""}`}>
                      {line}
                    </p>
                  ))}
                </div>
              </button>
            ) : (
              <div className="mt-10">
                <h1 className="hero-reveal hero-reveal--1 text-[clamp(2rem,4.5vw,4.5rem)] font-medium tracking-[-0.03em] leading-[1.05] max-w-3xl text-white">
                  I build the software layer between business operations and product ambition.
                </h1>
                <p className="hero-reveal hero-reveal--2 mt-6 max-w-2xl text-white/60 text-lg leading-relaxed">
                  Product systems engineer in Dakar. I ship finance and ERP tooling, internal ops software, and AI-assisted workflows for teams that need one engineer to hold the full stack.
                </p>
                <p className="hero-reveal hero-reveal--3 mt-4 text-sm text-white/45">
                  Two client slots open Q3 2026 · replies within 48h on business days
                </p>
                <div className="hero-reveal hero-reveal--4 mt-10 flex flex-wrap gap-4">
                  <a
                    href="#work"
                    className="btn-press inline-flex items-center gap-2 rounded-full bg-white text-[#050505] px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.02]"
                  >
                    See selected work <span aria-hidden>↓</span>
                  </a>
                  <a
                    href="#connect"
                    className="btn-press inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] border border-white/10 px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Get in touch
                  </a>
                </div>
              </div>
            )}
          </GlowCard>

          <div className="md:col-span-5 p-6 md:p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col min-h-[280px] md:min-h-[320px]">
            <div className="flex items-baseline justify-between gap-3 mb-4 shrink-0">
              <h2 className="text-sm font-medium text-white/90">GitHub activity</h2>
              <a
                href={`https://github.com/${GITHUB_USER}`}
                className="mono text-[10px] text-white/45 hover:text-white transition-colors"
              >
                @{GITHUB_USER} ↗
              </a>
            </div>
            <div className="flex-1 min-h-0">
              <ContributionChart user={GITHUB_USER} />
            </div>
            <div className="mt-5 pt-5 border-t border-white/5 shrink-0">
              <p className="text-[10px] uppercase tracking-wide text-white/40 mb-2">Pinned</p>
              <ul className="space-y-1.5">
                {PINNED_REPOS.map((r) => (
                  <li key={r.repo}>
                    <a
                      href={`https://github.com/${r.repo}`}
                      className="group flex items-baseline justify-between gap-2 text-xs hover:bg-white/[0.02] rounded -mx-1 px-1 py-0.5 transition-colors"
                    >
                      <span className="mono text-white/70 group-hover:text-white truncate">{r.repo.split("/")[1]}</span>
                      <span className="text-white/40 shrink-0">{r.note}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="p-8 md:p-10 rounded-2xl bg-[#0a0a0a] border border-white/5 h-full">
              <h2 className="text-lg font-medium text-white/90">Background</h2>
              <div className="mt-5 space-y-4 text-white/60 leading-relaxed text-sm max-w-xl">
                <p>
                  I work where business workflows meet software: CRMs, ERP modules, customer apps, and the glue that keeps them coherent. Less framework theater, more systems people can run every day.
                </p>
                <p>
                  The path ran through open banking in Ottawa, logistics automation, React Native, IoT, Python teaching, and now a steady load of Dakar client work alongside Everest Finance and ERGOBIT.
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5">
                <h3 className="text-sm font-medium text-white/85">Chess</h3>
                <p className="mt-3 text-sm text-white/55 leading-relaxed max-w-xl">
                  I play competitive chess online. Peak ratings: <span className="text-white/80">2043 bullet</span>, <span className="text-white/80">1856 blitz</span>. It is the same muscle I use in engineering: pattern recognition under a clock, weighing tradeoffs quickly, and staying composed when a production system is under pressure.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="p-8 md:p-10 rounded-2xl bg-[#0a0a0a] border border-white/5 h-full">
              <h2 className="text-lg font-medium text-white/90">Credentials</h2>
              <dl className="mt-6 space-y-6 text-sm">
                <div>
                  <dt className="text-white/45 text-xs uppercase tracking-wide">Experience</dt>
                  <dd className="mt-1.5 text-white/80 leading-relaxed">
                    Six years building production software across fintech, ERP, logistics, mobile, IoT, and education.
                  </dd>
                </div>
                <div>
                  <dt className="text-white/45 text-xs uppercase tracking-wide">Education</dt>
                  <dd className="mt-1.5 text-white/80 leading-relaxed">
                    B.Sc. Software Engineering, University of Ottawa
                    <br />
                    <span className="text-white/55">B.Sc. Computer Science, DAUST</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-white/45 text-xs uppercase tracking-wide">Certifications</dt>
                  <dd className="mt-1.5 text-white/80 leading-relaxed">
                    Odoo 18 Functional
                    <br />
                    Meta Front-End Developer Professional
                    <br />
                    <span className="text-white/55">Datacamp Python Data Science</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Worked with */}
        <RevealSection id="worked-with" className="pt-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="mono-eyebrow shrink-0">Work history</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight text-white/90 max-w-2xl">Employers and client builds</h2>
            </div>
            <p className="text-xs text-white/50 max-w-xs md:text-right leading-relaxed">Hover an employer to highlight related case studies.</p>
          </div>

          <div className="mt-10">
            <p className="mono-eyebrow mb-6 text-white/40">Employers</p>
            <div className="divide-y divide-white/5 border-y border-white/5">
              {TEAMS.map((t) => (
                <TeamRow
                  key={t.name}
                  team={t}
                  onHover={() => setHighlightedWork(t.linkedWork)}
                  onLeave={() => setHighlightedWork([])}
                />
              ))}
            </div>
          </div>

          <div className="mt-12">
            <div className="flex items-baseline justify-between gap-3 mb-6 flex-wrap">
              <div className="flex items-baseline gap-3">
                <p className="mono-eyebrow text-white/40">Client projects</p>
                <p className="text-[10px] text-white/30 mono">Dakar · freelance & product</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
              {FREELANCE.map((f) => (
                <div key={f.name} className="flex flex-col">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <p className="font-medium text-white/85">{f.name}</p>
                    <div className="flex items-center gap-2">
                      {f.note ? (
                        <span className="mono text-[10px] uppercase tracking-widest text-amber-400/80">{f.note}</span>
                      ) : null}
                      <span className="mono text-[10px] uppercase tracking-widest text-white/30">{f.domain}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{f.scope}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Capabilities */}
        <RevealSection id="capabilities" className="pt-16 mt-16 border-t border-white/5 scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <p className="mono-eyebrow">Focus</p>
              <h2 className="text-2xl font-medium tracking-tight mt-3 text-white/90">What I build</h2>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {CAPABILITIES.map((c, i) => (
                <div key={c.label} className="flex flex-col">
                  <span className="mono-eyebrow text-white/30 mb-3">0{i + 1}</span>
                  <h3 className="text-base font-medium text-white/90">{c.label}</h3>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Work */}
        <RevealSection id="work" className="pt-16 scroll-mt-24">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="mono-eyebrow">Case studies</p>
              <h2 className="text-2xl font-medium tracking-tight mt-3 text-white/90">Selected work</h2>
            </div>
            <span className="mono-eyebrow text-white/40">Depth over breadth</span>
          </div>
          <div className="divide-y divide-white/5 border-y border-white/5">
            {WORK.map((w) => (
              <WorkRow key={w.id} work={w} highlighted={highlightedWork.includes(w.id)} />
            ))}
          </div>
        </RevealSection>

        {/* Approach */}
        <RevealSection id="approach" className="pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 scroll-mt-24">
          <div className="lg:col-span-7">
            <p className="mono-eyebrow">Approach</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-white/90">Start from the workflow, not the framework.</h2>
            <p className="mt-4 text-white/50 text-sm leading-relaxed max-w-md">
              The useful work is often less glamorous than the architecture: a reliable CRM state transition, a migration test that catches regressions, a CI pipeline that saves a team from manual checking.
            </p>
            <div className="mt-10 space-y-8">
              {PROCESS.map((p) => (
                <div key={p.n} className="flex gap-6">
                  <span className="mono text-xs text-white/30 pt-0.5">{p.n}</span>
                  <div>
                    <h3 className="text-base font-medium text-white/90">{p.title}</h3>
                    <p className="mt-1 text-sm text-white/50 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-8">
            <GlowCard className="p-8">
              <p className="mono-eyebrow mb-6">Principles</p>
              <ul className="space-y-4 text-sm text-white/70 leading-relaxed">
                {[
                  "Prefer evidence over breadth.",
                  "A system is done when someone can operate it.",
                  "Architecture should reduce drift, not impress engineers.",
                  "Use AI to increase throughput without losing ownership.",
                ].map((p, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-white/30">·</span>
                    {p}
                  </li>
                ))}
              </ul>
            </GlowCard>
            <GlowCard className="p-8">
              <p className="mono-eyebrow mb-6">Stack</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
                {STACK_GROUPS.map((s) => (
                  <div key={s.k}>
                    <p className="text-white/40 mono-eyebrow mb-1.5">{s.k}</p>
                    <p className="text-white/80 leading-snug">{s.v}</p>
                  </div>
                ))}
              </div>
            </GlowCard>
          </div>
        </RevealSection>

        {/* Writing */}
        <RevealSection id="writing" className="pt-16 scroll-mt-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="mono-eyebrow">Writing</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight text-white/90">Field notes</h2>
            </div>
            <a href="#" className="text-xs text-white/50 hover:text-white transition-colors">
              All writing →
            </a>
          </div>
          <div className="divide-y divide-white/5 border-y border-white/5">
            {WRITING.map((w) => (
              <a
                key={w.title}
                href="#"
                className="group flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-8 py-6 hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg"
              >
                <span className="mono text-xs text-white/40 w-16 shrink-0">{w.date}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-medium text-white/90 group-hover:text-white">{w.title}</h3>
                    <span className="mono text-[10px] uppercase tracking-widest text-white/40 border border-white/10 px-2 py-0.5 rounded-full">{w.tag}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed max-w-2xl">{w.desc}</p>
                </div>
                <span className="text-white/30 group-hover:text-white/70 transition-colors shrink-0">↗</span>
              </a>
            ))}
          </div>
        </RevealSection>

        {/* Connect */}
        <RevealSection id="connect" className="pt-20 pb-12 scroll-mt-24">
          <GlowCard spotlight className="p-10 md:p-14">
            <p className="mono-eyebrow">Contact</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-tight text-white max-w-2xl leading-[1.1]">
              Tell me what you are building and where it hurts.
            </h2>
            <p className="mt-5 text-white/60 text-base md:text-lg leading-relaxed max-w-2xl">
              Fintech, ERP migrations, internal tools, or AI-assisted delivery. Two slots for Q3 2026. I reply within 48 hours on business days.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="btn-press inline-flex items-center gap-2 rounded-full bg-white text-[#050505] px-5 py-2.5 text-sm font-medium hover:scale-[1.02] transition-transform"
              >
                Send a message →
              </a>
              <a
                href="https://wa.me/221777228845"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-transparent border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                WhatsApp ↗
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="btn-press inline-flex items-center gap-2 rounded-full bg-transparent border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                Copy email
              </button>
            </div>
            <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
              <ChannelRow k="Email" v={EMAIL} href={`mailto:${EMAIL}`} />
              <ChannelRow k="WhatsApp" v="+221 77 722 88 45" href="https://wa.me/221777228845" />
              <ChannelRow k="LinkedIn" v="/in/aliouuuw" href="https://www.linkedin.com/in/aliouuuw" />
              <ChannelRow k="GitHub" v={`@${GITHUB_USER}`} href={`https://github.com/${GITHUB_USER}`} />
            </div>
          </GlowCard>
        </RevealSection>

        <footer className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-white/30 border-t border-white/5 pt-8">
          <span className="mono">© 2026 Aliou Wade · Product Systems Engineer</span>
          <span className="mono">DKR · 14.7°N · {time || "00:00:00"}</span>
          <div className="flex gap-4 items-center">
            <button type="button" onClick={() => setPaletteOpen(true)} className="mono hover:text-white/70 transition-colors md:hidden">
              ⌘K
            </button>
            <a href="#" className="hover:text-white/70 transition-colors">
              EN
            </a>
            <span className="text-white/10">/</span>
            <a href="#" className="hover:text-white/70 transition-colors">
              FR
            </a>
          </div>
        </footer>
      </main>

      <MockSwitcher />
    </div>
  );
}

function WorkRow({ work, highlighted }: { work: (typeof WORK)[number]; highlighted: boolean }) {
  const { ref, inView } = useInView(0.2);
  const statusClass =
    work.status === "ACTIVE"
      ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
      : work.status === "SHIPPED"
        ? "border-blue-500/20 text-blue-400 bg-blue-500/5"
        : "border-white/10 text-white/40";

  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href="#"
      className={`group flex flex-col lg:flex-row lg:items-center justify-between py-6 gap-4 lg:gap-6 hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg ${highlighted ? "work-row--highlight" : ""}`}
    >
      <div className="flex items-center gap-5 lg:w-1/4 shrink-0">
        <span className="mono text-xs text-white/30">{work.id}</span>
        <div>
          <h4 className="font-medium text-white/90 group-hover:text-white">{work.name}</h4>
          <p className="mono-eyebrow mt-1">
            &lt;{work.type}&gt; · {work.year}
          </p>
        </div>
      </div>
      <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors flex-1 leading-relaxed">{work.desc}</p>
      <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-1/4 shrink-0">
        <span className="mono text-[10px] text-white/40 hidden xl:inline truncate">{work.stack}</span>
        <span className={`mono text-[10px] tracking-widest px-2 py-1 rounded-full border ${statusClass} ${inView ? "status-pulse-once" : ""}`}>{work.status}</span>
        <span className="text-white/30 group-hover:text-white/70 transition-colors">↗</span>
      </div>
    </a>
  );
}

type ContribDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type ContribData = { total: { lastYear: number } | Record<string, number>; contributions: ContribDay[] };
type ContribYear = "last" | "all" | number;

const CONTRIB_YEARS: ContribYear[] = ["last", 2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, "all"];

function contribLevelClass(level: number) {
  switch (level) {
    case 0:
      return "fill-white/[0.04]";
    case 1:
      return "fill-emerald-500/25";
    case 2:
      return "fill-emerald-500/50";
    case 3:
      return "fill-emerald-400/75";
    case 4:
      return "fill-emerald-300";
    default:
      return "fill-white/[0.04]";
  }
}

function contribTotal(data: ContribData, year: ContribYear): number {
  const t = data.total;
  if (typeof t !== "object" || t === null) return 0;
  if (year === "last" && "lastYear" in t) return t.lastYear;
  if (year === "all") return Object.values(t as Record<string, number>).reduce((a, b) => a + b, 0);
  if (typeof year === "number") return (t as Record<string, number>)[String(year)] ?? 0;
  return 0;
}

function contribYearLabel(year: ContribYear) {
  if (year === "last") return "12 mo";
  if (year === "all") return "All";
  return String(year);
}

function groupDaysByYear(days: ContribDay[]): Map<number, ContribDay[]> {
  const map = new Map<number, ContribDay[]>();
  for (const day of days) {
    const y = Number(day.date.slice(0, 4));
    const list = map.get(y) ?? [];
    list.push(day);
    map.set(y, list);
  }
  for (const [, list] of map) {
    list.sort((a, b) => a.date.localeCompare(b.date));
  }
  return map;
}

function ContributionHeatmap({
  days,
  compact,
  ariaLabel,
}: {
  days: ContribDay[];
  compact?: boolean;
  ariaLabel: string;
}) {
  const firstDay = days[0] ? new Date(`${days[0].date}T12:00:00`).getDay() : 0;
  const blanks: (ContribDay | null)[] = new Array(firstDay).fill(null);
  const padded: (ContribDay | null)[] = [...blanks, ...days];
  const weeks: (ContribDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

  const CELL = compact ? 9 : 11;
  const GAP = compact ? 2 : 3;
  const width = weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP);

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        style={{ minWidth: compact ? width / 2.2 : width / 1.6 }}
        role="img"
        aria-label={ariaLabel}
      >
        {weeks.map((week, x) =>
          week.map((day, y) =>
            day ? (
              <rect
                key={`${day.date}-${x}-${y}`}
                x={x * (CELL + GAP)}
                y={y * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={2}
                className={contribLevelClass(day.level)}
              >
                <title>
                  {day.date} · {day.count} contribution{day.count === 1 ? "" : "s"}
                </title>
              </rect>
            ) : null,
          ),
        )}
      </svg>
    </div>
  );
}

function ContributionChartBody({ user, year }: { user: string; year: ContribYear }) {
  const [data, setData] = useState<ContribData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const param = year === "last" ? "last" : year === "all" ? "all" : String(year);
    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=${param}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("fetch failed"))))
      .then((json: ContribData) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, year]);

  if (error) {
    return (
      <p className="mono text-xs text-white/40 py-6">
        chart unavailable · view on{" "}
        <a href={`https://github.com/${user}`} className="text-emerald-400 hover:text-emerald-300">
          github.com/{user}
        </a>
      </p>
    );
  }

  if (!data) {
    return <ContributionSkeleton compact={year === "all"} />;
  }

  const total = contribTotal(data, year);
  const periodLabel =
    year === "last" ? "last 12 months" : year === "all" ? "all years" : String(year);

  return (
    <>
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <p className="mono text-xs text-white/55">
          <span className="text-emerald-400">{total.toLocaleString()}</span> contributions · {periodLabel}
        </p>
        <div className="flex items-center gap-2 mono text-[10px] text-white/40">
          <span>less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <svg key={l} width={11} height={11} aria-hidden>
              <rect width={11} height={11} rx={2} className={contribLevelClass(l)} />
            </svg>
          ))}
          <span>more</span>
        </div>
      </div>

      {year === "all" ? (
        <div className="space-y-5 max-h-[420px] overflow-y-auto pr-1">
          {[...groupDaysByYear(data.contributions).entries()]
            .sort(([a], [b]) => b - a)
            .map(([y, days]) => {
              const yearTotal = (data.total as Record<string, number>)[String(y)] ?? 0;
              return (
                <div key={y}>
                  <p className="mono text-[10px] text-white/45 mb-2">
                    {y} · <span className="text-white/65">{yearTotal}</span>
                  </p>
                  <ContributionHeatmap
                    days={days}
                    compact
                    ariaLabel={`${yearTotal} contributions in ${y}`}
                  />
                </div>
              );
            })}
        </div>
      ) : (
        <ContributionHeatmap
          days={[...data.contributions].sort((a, b) => a.date.localeCompare(b.date))}
          ariaLabel={`${total} GitHub contributions in ${periodLabel}`}
        />
      )}
    </>
  );
}

function ContributionChart({ user }: { user: string }) {
  const [year, setYear] = useState<ContribYear>("last");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Contribution year">
        {CONTRIB_YEARS.map((y) => (
          <button
            key={String(y)}
            type="button"
            role="tab"
            aria-selected={year === y}
            onClick={() => setYear(y)}
            className={`mono text-[10px] px-2 py-1 rounded-md border transition-colors ${
              year === y
                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
            }`}
          >
            {contribYearLabel(y)}
          </button>
        ))}
      </div>
      <ContributionChartBody key={String(year)} user={user} year={year} />
    </div>
  );
}

function ContributionSkeleton({ compact }: { compact?: boolean }) {
  const cols = compact ? 26 : 53;
  return (
    <div className="space-y-4">
      <p className="mono text-xs text-white/30">Loading contributions…</p>
      <div className="grid gap-[3px] max-w-full overflow-hidden" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: cols * 7 }).map((_, i) => (
          <span
            key={i}
            className="aspect-square rounded-[2px] bg-white/[0.04] animate-pulse"
            style={{ animationDelay: `${(i % cols) * 8}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function ChannelRow({ k, v, href }: { k: string; v: string; href: string }) {
  return (
    <a href={href} className="group flex flex-col">
      <span className="mono-eyebrow text-white/40 group-hover:text-white/70 transition-colors">{k}</span>
      <span className="mt-1 text-white/85 group-hover:text-white truncate transition-colors">{v}</span>
    </a>
  );
}

