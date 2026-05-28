"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const OPTIONS = [
  { slug: "operator-graph", label: "Operator graph", short: "01" },
  { slug: "aurora-rail", label: "Aurora rail", short: "02" },
  { slug: "system-pulse", label: "System pulse", short: "03" },
  { slug: "magnetic-field", label: "Magnetic field", short: "04" },
  { slug: "synthesis", label: "Synthesis", short: "05" },
] as const;

export function MockSwitcher() {
  const pathname = usePathname();
  const active = pathname.split("/").pop() ?? "";

  return (
    <nav
      aria-label="Mock switcher"
      className="fixed bottom-5 left-5 z-[100] flex items-center gap-1 rounded-full border bg-black/80 p-1.5 shadow-2xl backdrop-blur-xl"
      style={{ borderColor: "rgba(255,255,255,0.12)" }}
    >
      {OPTIONS.map((o) => {
        const isActive = o.slug === active;
        return (
          <Link
            key={o.slug}
            href={`/mock/${o.slug}`}
            className={
              "flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[11px] tracking-tight transition-all " +
              (isActive
                ? "bg-white text-black font-semibold shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/10")
            }
          >
            <span className="opacity-40">{o.short}</span>
            <span className="hidden sm:inline">{o.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
