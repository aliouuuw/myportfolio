"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * SpecularHighlight — cursor-tracking metallic sheen
 *
 * A radial gradient that follows the cursor position, creating
 * a specular highlight effect on metal surfaces. Pure CSS transforms,
 * rAF-throttled, respects prefers-reduced-motion.
 */

type SpecularHighlightProps = {
  /** Whether the highlight is active (disabled on non-interactive panels) */
  enabled?: boolean;
  /** CSS custom property name for X position (default: --mx) */
  cssVarX?: string;
  /** CSS custom property name for Y position (default: --my) */
  cssVarY?: string;
  /** Radius of the specular highlight in pixels */
  radius?: number;
  /** Opacity of the highlight */
  opacity?: number;
};

export function SpecularHighlight({
  enabled = true,
  cssVarX = "--mx",
  cssVarY = "--my",
  radius = 220,
  opacity = 0.35,
}: SpecularHighlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const isActiveRef = useRef(false);
  const cssVarsRef = useRef({ x: cssVarX, y: cssVarY });

  // Store latest CSS var names in ref for the animation loop
  useLayoutEffect(() => {
    cssVarsRef.current = { x: cssVarX, y: cssVarY };
  }, [cssVarX, cssVarY]);

  useEffect(() => {
    if (!enabled) return;

    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Animation loop function
    const animate = () => {
      if (!element) return;

      const target = targetRef.current;
      const current = currentRef.current;
      const vars = cssVarsRef.current;

      // Lerp toward target with smooth factor
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const factor = 0.12;

      current.x += dx * factor;
      current.y += dy * factor;

      // Convert 0-1 to percentage for CSS
      const x = current.x * 100;
      const y = current.y * 100;

      element.style.setProperty(vars.x, `${x}%`);
      element.style.setProperty(vars.y, `${y}%`);

      // Continue animating if not close enough
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        isActiveRef.current = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      targetRef.current = { x, y };

      if (!isActiveRef.current) {
        isActiveRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseLeave = () => {
      // Ease back to center when mouse leaves
      targetRef.current = { x: 0.5, y: 0.5 };
      if (!isActiveRef.current) {
        isActiveRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    // Scroll-based fallback for touch/scroll contexts
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      // Move highlight based on scroll progress (horizontal drift)
      targetRef.current = {
        x: 0.3 + progress * 0.4,
        y: 0.5,
      };

      if (!isActiveRef.current) {
        isActiveRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    element.addEventListener("mousemove", handleMouseMove, { passive: true });
    element.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[6px]"
      style={{
        background: `radial-gradient(circle ${radius}px at var(${cssVarX}, 50%) var(${cssVarY}, 50%), oklch(1 0 0 / ${opacity}), transparent)`,
        mixBlendMode: "overlay",
      }}
      aria-hidden="true"
    />
  );
}
