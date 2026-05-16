import { cn } from "@/lib/utils";
import { NumericLabel } from "./numeric-label";

/**
 * SectionHeader — Numeric prefix + serif title + optional sub-line
 *
 * Used for major page sections. The serif title uses the display
 * font at the appropriate scale.
 */

interface SectionHeaderProps {
  /** Section number (01, 02, etc) */
  number: string;
  /** Section label */
  label: string;
  /** Main heading (serif display) */
  title?: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Visual variant */
  variant?: "default" | "centered" | "compact";
  /** Additional classes */
  className?: string;
}

export function SectionHeader({
  number,
  label,
  title,
  subtitle,
  variant = "default",
  className,
}: SectionHeaderProps) {
  const isCentered = variant === "centered";
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "flex flex-col",
        isCentered && "items-center text-center",
        className
      )}
    >
      <NumericLabel
        number={number}
        label={label}
        fullWidth={isCentered}
        className={cn(isCentered && "justify-center")}
      />

      {title && (
        <h2
          className={cn(
            "font-serif font-normal text-[var(--color-ink-primary)]",
            isCompact ? "text-2xl mt-4" : "text-[clamp(1.75rem,4vw,2.5rem)] mt-6",
            isCentered && "max-w-2xl"
          )}
          style={{ letterSpacing: "-0.02em" }}
        >
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          className={cn(
            "text-[var(--color-ink-secondary)] leading-relaxed",
            isCompact ? "text-sm mt-2 max-w-md" : "text-base mt-4 max-w-xl",
            isCentered && "max-w-xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
