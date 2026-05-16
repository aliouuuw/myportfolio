"use client";

import Link from "next/link";
import { MetalPanel } from "./metal-panel";
import { ClassificationStamp } from "./classification-stamp";

export type CaseFileStatus = "ACTIVE" | "SHIPPED" | "ARCHIVED";

interface CaseFileCardProps {
  /** File reference number (e.g., "CF-001") */
  fileRef: string;
  /** Classification label (e.g., "CONFIDENTIAL", "OPEN SOURCE") */
  classification: string;
  /** Card title in serif */
  title: string;
  /** Domain + date line (e.g., "Fintech Operations · 2024–present") */
  meta: string;
  /** One-sentence summary */
  summary: string;
  /** Status chip */
  status: CaseFileStatus;
  /** Link href */
  href: string;
  /** Stagger offset for visual rhythm (0, 1, 2) */
  stagger?: number;
}

const statusStyles: Record<CaseFileStatus, string> = {
  ACTIVE: "text-accent",
  SHIPPED: "text-ink-secondary",
  ARCHIVED: "text-ink-tertiary",
};

export function CaseFileCard({
  fileRef,
  classification,
  title,
  meta,
  summary,
  status,
  href,
  stagger = 0,
}: CaseFileCardProps) {
  // Staggered left margins for visual rhythm on desktop
  const staggerClass = stagger === 1 ? "sm:ml-8" : stagger === 2 ? "sm:ml-16" : "";

  return (
    <article className={`group ${staggerClass}`}>
      <Link
        href={href}
        className="block min-h-[44px] focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-[6px]"
      >
        <MetalPanel
          interactive
          as="div"
          className="magnetic-lift"
          ariaLabel={`${fileRef}: ${title}`}
        >
          <div className="p-5 sm:p-6">
            {/* Top row: file ref + classification */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="font-mono text-[11px] font-medium text-ink-tertiary tracking-tight"
                aria-hidden="true"
              >
                {fileRef}
              </span>
              <ClassificationStamp label={classification} />
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl sm:text-[1.25rem] font-normal text-ink-primary mb-2 leading-tight">
              {title}
            </h3>

            {/* Meta line: domain + date */}
            <p className="font-mono text-[11px] text-ink-tertiary mb-3 tracking-tight">
              {meta}
            </p>

            {/* Summary */}
            <p className="text-sm text-ink-secondary leading-relaxed mb-4 max-w-prose">
              {summary}
            </p>

            {/* Status chip */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  status === "ACTIVE"
                    ? "bg-accent"
                    : status === "SHIPPED"
                    ? "bg-ink-secondary"
                    : "bg-ink-tertiary"
                }`}
                aria-hidden="true"
              />
              <span
                className={`font-mono text-[10px] font-semibold uppercase tracking-wide ${statusStyles[status]}`}
              >
                {status}
              </span>
            </div>
          </div>
        </MetalPanel>
      </Link>
    </article>
  );
}

export default CaseFileCard;
