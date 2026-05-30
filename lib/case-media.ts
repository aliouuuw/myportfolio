/**
 * Case-study media (v1: repo + public/).
 * Each slug can declare multiple items; missing files fall back to placeholders in the UI.
 */

export const CASE_MEDIA_ROOT = "/media/case-studies";

export type CaseMediaKind = "video" | "image";

export type CaseMediaItem = {
  id: string;
  kind: CaseMediaKind;
  /** Path under /public */
  src: string;
  label: string;
  poster?: string;
};

/**
 * Media sets per slug. Add items as assets land in `public/media/case-studies/{slug}/`.
 */
export const CASE_MEDIA_BY_SLUG: Record<string, CaseMediaItem[]> = {
  "everest-finance": [
    {
      id: "hero",
      kind: "video",
      src: `${CASE_MEDIA_ROOT}/everest-finance/hero.mp4`,
      label: "Site walkthrough",
    },
    {
      id: "home",
      kind: "image",
      src: `${CASE_MEDIA_ROOT}/everest-finance/01-home.png`,
      label: "Marketing home",
    },
    {
      id: "flow",
      kind: "image",
      src: `${CASE_MEDIA_ROOT}/everest-finance/02-mid-scroll.png`,
      label: "Product flow",
    },
  ],
  "odoo-testing-toolkit": [
    {
      id: "hero",
      kind: "image",
      src: `${CASE_MEDIA_ROOT}/odoo-testing-toolkit/hero.png`,
      label: "Test dashboard",
    },
  ],
  "bocalbun-retrospective": [
    {
      id: "hero",
      kind: "image",
      src: `${CASE_MEDIA_ROOT}/bocalbun-retrospective/hero.png`,
      label: "Toolkit snapshot",
    },
  ],
};

export function getCaseStudyMediaItems(slug: string | null): CaseMediaItem[] {
  if (!slug) return [];
  return CASE_MEDIA_BY_SLUG[slug] ?? [];
}

export function getCaseStudyCover(slug: string | null): CaseMediaItem | null {
  const items = getCaseStudyMediaItems(slug);
  return items[0] ?? null;
}

/** First video in the set, for backward-compatible tile autoplay. */
export function resolveCaseStudyHeroVideo(slug: string): string | null {
  const video = getCaseStudyMediaItems(slug).find((item) => item.kind === "video");
  return video?.src ?? null;
}

export function plannedHeroVideoPath(slug: string): string {
  return `${CASE_MEDIA_ROOT}/${slug}/hero.mp4`;
}

export function plannedHeroPosterPath(slug: string): string {
  return `${CASE_MEDIA_ROOT}/${slug}/hero-poster.jpg`;
}

export function plannedScrollStillPath(slug: string, index: 1 | 2 = 1): string {
  const suffix = index === 1 ? "01-home" : "02-mid-scroll";
  return `${CASE_MEDIA_ROOT}/${slug}/${suffix}.png`;
}
