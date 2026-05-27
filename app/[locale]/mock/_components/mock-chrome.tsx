"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";

import { LiveSignal } from "./live-signal";

export function MockChrome() {
  const params = useParams();
  const locale = (params.locale as string) ?? "en";

  return (
    <header className="mock-chrome fixed top-0 left-0 right-0 z-50">
      <div className="page-inner chrome-bar">
        <div className="flex items-center gap-5 min-w-0">
          <Link
            href={`/${locale}`}
            className="label chrome-exit hover:text-[color:var(--n-fg)] transition-colors whitespace-nowrap"
          >
            Exit preview
          </Link>
          <span className="chrome-divider hidden md:inline" aria-hidden />
          <div className="hidden md:flex min-w-0">
            <LiveSignal />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 label" aria-label="Page sections">
          <a href="#work" className="chrome-link">Work</a>
          <a href="#join" className="chrome-link">Open</a>
          <a href="#contact" className="chrome-link">Contact</a>
        </nav>

        <div className="flex items-center gap-3" suppressHydrationWarning>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
