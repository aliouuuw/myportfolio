/**
 * ClassificationStamp — The visual signature of the classified document aesthetic
 *
 * A dark-fill capsule label that appears on:
 * - Every case file card (CONFIDENTIAL / OPEN SOURCE / RETROSPECTIVE)
 * - Every case report header
 * - The about page (OPERATOR RECORD)
 * - The contact page (OPEN TO ENGAGEMENTS · Q3 2026)
 *
 * Design spec (design-shape-v3.md §7):
 * - Dark fill (--ink-primary)
 * - Canvas text
 * - Mono 9px ALL CAPS
 * - Tight letter-spacing
 * - Never color-coded — always the same dark stamp
 */

interface ClassificationStampProps {
  /** The classification label text (e.g., "CONFIDENTIAL", "OPEN SOURCE") */
  label: string;
  /** Optional additional className */
  className?: string;
}

export function ClassificationStamp({ label, className = "" }: ClassificationStampProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2 py-0.5
        rounded-full
        bg-ink-primary text-canvas
        font-mono text-[9px] font-semibold uppercase tracking-wide
        ${className}
      `.trim()}
      aria-label={`Classification: ${label}`}
    >
      {label}
    </span>
  );
}

export default ClassificationStamp;
