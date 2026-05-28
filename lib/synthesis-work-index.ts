import {
  FEATURED_WORK_SLUGS,
  type FeaturedWorkSlug,
} from "@/lib/work-ledger-types";

/** Display ids aligned with homepage synthesis selected work (01–03 for published slugs). */
export const SYNTHESIS_FEATURED_INDEX_IDS: Record<FeaturedWorkSlug, string> = {
  "everest-finance": "01",
  "odoo-testing-toolkit": "02",
  "bocalbun-retrospective": "03",
};

export function featuredWorkIndexId(slug: FeaturedWorkSlug): string {
  return SYNTHESIS_FEATURED_INDEX_IDS[slug];
}

export function isFeaturedWorkSlug(slug: string): slug is FeaturedWorkSlug {
  return (FEATURED_WORK_SLUGS as readonly string[]).includes(slug);
}
