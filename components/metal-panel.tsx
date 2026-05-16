"use client";

import { forwardRef, type ReactNode } from "react";
import { SpecularHighlight } from "./specular-highlight";
import { cn } from "@/lib/utils";

/**
 * MetalPanel — The signature metallic surface component
 *
 * Layers:
 * 1. Base fill (--color-canvas-metal)
 * 2. Brushed micro-texture (CSS repeating-linear-gradient)
 * 3. Edge emboss (1px top/bottom borders in light/dark)
 * 4. Specular highlight (cursor-tracked radial gradient)
 *
 * Used for: hero name plate, case-study cards, contact CTA, colophon.
 */

export interface MetalPanelProps {
  children: ReactNode;
  /** Enable cursor-tracked specular highlight */
  interactive?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** HTML element to render as */
  as?: "div" | "article" | "section" | "header" | "footer";
  /** Accessible label when used as a landmark */
  ariaLabel?: string;
}

export const MetalPanel = forwardRef<HTMLDivElement, MetalPanelProps>(
  function MetalPanel(
    { children, interactive = false, className, as: Component = "div", ariaLabel },
    ref
  ) {
    return (
      <Component
        ref={ref}
        className={cn(
          // Base metal fill + 6px chamfer
          "relative overflow-hidden rounded-[6px]",
          "bg-[var(--color-canvas-metal)]",
          // Embossed edges
          "border-t border-b",
          "border-t-[var(--color-emboss-light)]",
          "border-b-[var(--color-emboss-dark)]",
          // Brushed texture overlay
          "before:pointer-events-none before:absolute before:inset-0",
          "before:opacity-[0.08]",
          "before:bg-[repeating-linear-gradient(90deg,transparent_0px,oklch(0.9_0.008_235/0.5)_0.5px,transparent_1px)]",
          "before:bg-[length:2px_100%]",
          // Subtle shadow for depth
          "shadow-[0_2px_8px_-4px_oklch(0.1_0.01_250/0.08)]",
          // Hover lift for interactive panels
          interactive && "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5",
          className
        )}
        aria-label={ariaLabel}
      >
        {/* Specular highlight layer */}
        <SpecularHighlight enabled={interactive} radius={180} opacity={0.3} />

        {/* Content layer */}
        <div className="relative z-10">{children}</div>
      </Component>
    );
  }
);

export default MetalPanel;
