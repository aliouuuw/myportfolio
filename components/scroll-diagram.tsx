"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface ScrollDiagramProps {
  /** ARIA description for the diagram */
  ariaDescription: string;
}

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

/**
 * ScrollDiagram — SVG with scroll-driven line drawing
 *
 * Uses stroke-dasharray + stroke-dashoffset transitions triggered by
 * IntersectionObserver when the element enters view.
 * Lines draw from left to right as the section enters view.
 *
 * Respects prefers-reduced-motion (shows instantly if reduced).
 */
export function ScrollDiagram({ ariaDescription }: ScrollDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // IntersectionObserver to trigger animation
  useEffect(() => {
    // If reduced motion is preferred, show immediately without animation
    if (prefersReducedMotion) {
      // Use requestAnimationFrame to avoid synchronous setState
      const rafId = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(rafId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Only animate once
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Mock system diagram for Everest Finance
  // Anonymized topology showing the system architecture
  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto"
      role="img"
      aria-label={ariaDescription}
    >
      <svg
        viewBox="0 0 800 400"
        className="w-full min-w-[600px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background grid for subtle context */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#grid)" />

        {/* Node: Frontend (Web App) */}
        <g transform="translate(100, 180)">
          <rect
            x="0"
            y="0"
            width="120"
            height="60"
            rx="4"
            fill="var(--color-canvas-elevated)"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
          />
          <text
            x="60"
            y="35"
            textAnchor="middle"
            className="fill-ink-secondary text-[11px] font-mono"
          >
            [REDACTED] App
          </text>
        </g>

        {/* Node: API Gateway */}
        <g transform="translate(320, 180)">
          <rect
            x="0"
            y="0"
            width="100"
            height="60"
            rx="4"
            fill="var(--color-canvas-elevated)"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />
          <text
            x="50"
            y="35"
            textAnchor="middle"
            className="fill-ink-primary text-[11px] font-mono font-medium"
          >
            API Gateway
          </text>
        </g>

        {/* Node: Core Services */}
        <g transform="translate(500, 100)">
          <rect
            x="0"
            y="0"
            width="120"
            height="60"
            rx="4"
            fill="var(--color-canvas-elevated)"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
          />
          <text
            x="60"
            y="35"
            textAnchor="middle"
            className="fill-ink-secondary text-[11px] font-mono"
          >
            Core Services
          </text>
        </g>

        {/* Node: CRM Integration */}
        <g transform="translate(500, 260)">
          <rect
            x="0"
            y="0"
            width="120"
            height="60"
            rx="4"
            fill="var(--color-canvas-elevated)"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
          />
          <text
            x="60"
            y="35"
            textAnchor="middle"
            className="fill-ink-secondary text-[11px] font-mono"
          >
            CRM System
          </text>
        </g>

        {/* Node: Database */}
        <g transform="translate(680, 180)">
          <rect
            x="0"
            y="0"
            width="80"
            height="60"
            rx="4"
            fill="var(--color-canvas-metal)"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
          />
          <text
            x="40"
            y="35"
            textAnchor="middle"
            className="fill-ink-secondary text-[11px] font-mono"
          >
            Database
          </text>
        </g>

        {/* Connection lines with animation */}
        {/* Frontend -> API Gateway */}
        <path
          d="M 220 210 L 320 210"
          stroke="var(--color-border-strong)"
          strokeWidth="1.5"
          className={isVisible ? "diagram-line" : "diagram-line-hidden"}
          style={{ transitionDelay: "0ms" }}
        />

        {/* API Gateway -> Core Services */}
        <path
          d="M 420 200 L 500 150"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          className={isVisible ? "diagram-line-accent" : "diagram-line-hidden"}
          style={{ transitionDelay: "200ms" }}
        />

        {/* API Gateway -> CRM */}
        <path
          d="M 420 220 L 500 280"
          stroke="var(--color-border-strong)"
          strokeWidth="1.5"
          className={isVisible ? "diagram-line" : "diagram-line-hidden"}
          style={{ transitionDelay: "400ms" }}
        />

        {/* Core Services -> Database */}
        <path
          d="M 620 130 L 680 200"
          stroke="var(--color-border-strong)"
          strokeWidth="1.5"
          className={isVisible ? "diagram-line" : "diagram-line-hidden"}
          style={{ transitionDelay: "600ms" }}
        />

        {/* CRM -> Database */}
        <path
          d="M 620 290 L 680 230"
          stroke="var(--color-border-strong)"
          strokeWidth="1.5"
          className={isVisible ? "diagram-line" : "diagram-line-hidden"}
          style={{ transitionDelay: "800ms" }}
        />
      </svg>
    </div>
  );
}

export default ScrollDiagram;
