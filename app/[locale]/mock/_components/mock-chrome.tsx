"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";

export function MockChrome() {
  const params = useParams();
  const locale = (params.locale as string) ?? "en";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <div className="max-w-[1800px] mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href={`/${locale}`}
            className="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
          >
            ← Exit Preview
          </Link>
          <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-400/80 hidden md:inline">
            AWWWARDS DIRECTION
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40 tracking-wider uppercase hidden md:inline">
            Theme
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
