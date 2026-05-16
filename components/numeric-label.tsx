import { cn } from "@/lib/utils";

/**
 * NumericLabel — Section numbering with hairline
 *
 * Format: 01 — LABEL
 * Mono, ALL CAPS, 11px, tracking 0.12em, preceded by hairline.
 */

interface NumericLabelProps {
  /** The number (01, 02, etc) */
  number: string;
  /** The label text */
  label: string;
  /** Whether the hairline extends full width */
  fullWidth?: boolean;
  /** Additional classes */
  className?: string;
}

export function NumericLabel({
  number,
  label,
  fullWidth = false,
  className,
}: NumericLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        fullWidth && "w-full",
        className
      )}
    >
      {/* Hairline */}
      <div
        className={cn(
          "h-px bg-[var(--color-border)]",
          fullWidth ? "flex-1" : "w-8"
        )}
      />

      {/* Label */}
      <span className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[var(--color-ink-tertiary)] whitespace-nowrap">
        {number} — {label}
      </span>

      {/* Optional trailing hairline for full-width variant */}
      {fullWidth && (
        <div className="h-px bg-[var(--color-border)] flex-1" />
      )}
    </div>
  );
}
