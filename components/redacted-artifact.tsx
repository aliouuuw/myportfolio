"use client";

import Image from "next/image";

interface BlurRegion {
  /** X position as percentage (0-100) */
  x: number;
  /** Y position as percentage (0-100) */
  y: number;
  /** Width as percentage (0-100) */
  width: number;
  /** Height as percentage (0-100) */
  height: number;
}

interface RedactedArtifactProps {
  /** Image source */
  src: string;
  /** Image alt text (should describe what the image shows, not "redacted") */
  alt: string;
  /** Optional caption below the image */
  caption?: string;
  /** Array of regions to blur */
  blurRegions?: BlurRegion[];
  /** Aspect ratio for the container (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
}

/**
 * RedactedArtifact — Screenshot or wireframe with specific regions blurred
 *
 * Shows a [REDACTED] label over blurred regions. Includes a note about
 * declassification. Turns confidentiality into a trust signal.
 *
 * Design spec (design-shape-v3.md §7):
 * - Specific names, product URLs, internal metrics → [REDACTED]
 * - Screenshots → specific regions blurred with CSS filter: blur(8px)
 * - A [SENSITIVE] label overlay
 * - Note at top: "This content has been partially declassified..."
 */
export function RedactedArtifact({
  src,
  alt,
  caption,
  blurRegions = [],
  aspectRatio = "16/9",
}: RedactedArtifactProps) {
  return (
    <figure className="my-8">
      {/* Declassification note */}
      <p className="font-mono text-[10px] text-ink-tertiary mb-3 max-w-[68ch]">
        This content has been partially declassified. Full details available under NDA.
      </p>

      {/* Image container with blur overlays */}
      <div
        className="relative w-full overflow-hidden rounded border border-border bg-canvas-elevated"
        style={{ aspectRatio }}
        aria-describedby="redacted-note"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Blur regions */}
        {blurRegions.map((region, index) => (
          <div
            key={index}
            className="absolute flex items-center justify-center"
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
            }}
          >
            {/* Blur overlay */}
            <div
              className="absolute inset-0 backdrop-blur-[8px] bg-canvas/30"
              aria-hidden="true"
            />
            {/* [SENSITIVE] label */}
            <span className="relative font-mono text-[9px] font-bold uppercase tracking-wider text-ink-primary bg-canvas/80 px-2 py-1 rounded">
              [SENSITIVE]
            </span>
          </div>
        ))}

        {/* Screen reader only description */}
        <span id="redacted-note" className="sr-only">
          This image contains redacted sensitive information. Full details
          available under NDA.
        </span>
      </div>

      {/* Caption */}
      {caption && (
        <figcaption className="mt-3 text-sm text-ink-tertiary max-w-[68ch]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default RedactedArtifact;
