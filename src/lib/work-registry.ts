/** Work Registry — single source of truth for work entries.
 *  Adapts Content Collections MDX → Lab Precision Engagement shape.
 */
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { type Domain, type Engagement } from "@/data/lab-precision";
import { domainSlug } from "@/data/lab-precision";

export type WorkEntry = CollectionEntry<"work">;

const DOMAINS: Domain[] = ["Fintech", "ERP & QA", "Systems", "Operations"];

function normalizeDomain(raw: string): Domain {
  const normalized = raw.trim();
  if (normalized === "Fintech operations" || normalized === "Fintech") return "Fintech";
  if (normalized === "ERP & QA" || normalized === "ERP") return "ERP & QA";
  if (normalized === "Systems") return "Systems";
  if (normalized === "Operations") return "Operations";
  return "Operations";
}

function mapWorkEntryToEngagement(entry: WorkEntry): Engagement {
  const data = entry.data;
  const slug = entry.id.replace(/\/(en|fr)$/, "");
  const domain = normalizeDomain(data.domain);

  // Find the first surface with a video for preview media
  const primarySurface = data.surfaces?.[0];
  const media = primarySurface?.video
    ? primarySurface.video.replace("/media/case-studies/everest-finance/", "").replace(".mp4", "")
    : undefined;

  return {
    name: data.title,
    slug,
    domain,
    detail: data.summary,
    builds: data.surfaces?.length ?? 1,
    period: data.period ?? data.date,
    href: `/work/${slug}`,
    media,
    caption: primarySurface?.name ?? data.title,
  };
}

/** Fetch all work entries and adapt to Engagement shape. */
export async function getEngagements(): Promise<Engagement[]> {
  const entries = await getCollection("work", (entry) => entry.id.endsWith("/en"));
  return entries.map(mapWorkEntryToEngagement);
}

/** Get a single engagement by slug. */
export async function getEngagement(slug: string): Promise<Engagement | null> {
  const entries = await getCollection("work", (entry) => entry.id.endsWith("/en"));
  const entry = entries.find((e) => e.id.replace(/\/(en|fr)$/, "") === slug);
  return entry ? mapWorkEntryToEngagement(entry) : null;
}

/** Engagements grouped by domain for directory-style indexes. */
export async function getEngagementsByDomain(): Promise<{ domain: Domain; entries: Engagement[] }[]> {
  const engagements = await getEngagements();
  return DOMAINS
    .map((domain) => ({
      domain,
      entries: engagements.filter((entry) => entry.domain === domain),
    }))
    .filter((group) => group.entries.length > 0);
}

/** Split entries into N columns (fill top-to-bottom per column). */
export function directoryColumns<T>(items: T[], columnCount = 2): T[][] {
  if (items.length === 0) return [];
  const cols = Math.max(1, Math.min(columnCount, items.length));
  const columns: T[][] = Array.from({ length: cols }, () => []);
  const perCol = Math.ceil(items.length / cols);
  items.forEach((item, index) => {
    const col = Math.min(Math.floor(index / perCol), cols - 1);
    columns[col]?.push(item);
  });
  return columns;
}

/** Filter options with counts. */
export async function getFilters(): Promise<{ label: string; value: string; count: number }[]> {
  const engagements = await getEngagements();
  return [
    { label: "All", value: "all", count: engagements.length },
    ...DOMAINS.map((domain) => ({
      label: domain,
      value: domain,
      count: engagements.filter((entry) => entry.domain === domain).length,
    })),
  ];
}

/** Domain slug utility. */
export { domainSlug };
