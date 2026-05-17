"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Hook to detect prefers-reduced-motion using useSyncExternalStore
 * Avoids the setState-in-effect ESLint error
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
    () => false // Server fallback
  );
}

interface CaseReportSectionProps {
  /** Section number (01, 02, etc.) */
  number: string;
  /** Section title */
  title: string;
  /** Section content (React nodes) */
  children: React.ReactNode;
  /** Optional delay for stagger animation (in ms) */
  delay?: number;
}

/**
 * CaseReportSection — Section with IntersectionObserver reveal animation
 *
 * Each of the 6 report sections (Situation, Constraints, System, Shipped,
 * Outcome, Lessons) enters with:
 * - opacity: 0 → 1
 * - translateY: 6px → 0
 * - Duration: 500ms ease-out-quart
 * - Stagger: 80ms between sections simultaneously in view
 *
 * Respects prefers-reduced-motion (content appears instantly).
 */
export function CaseReportSection({
  number,
  title,
  children,
  delay = 0,
}: CaseReportSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // If reduced motion is preferred, show immediately without animation
    if (prefersReducedMotion) {
      const rafId = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(rafId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={`
        transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Section header with numeric label */}
      <div className="flex items-baseline gap-4 mb-6">
        <span className="font-mono text-[11px] font-medium text-ink-tertiary tracking-tight">
          {number}
        </span>
        <div className="flex-1 hairline" />
      </div>

      <h2 className="font-serif text-xl sm:text-2xl font-normal text-ink-primary mb-6">
        {title}
      </h2>

      <div className="text-base leading-relaxed text-ink-secondary max-w-[68ch]">
        {children}
      </div>
    </section>
  );
}

export default CaseReportSection;
