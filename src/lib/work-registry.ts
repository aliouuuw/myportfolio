/** Work Registry — single source of truth for work entries.
 *  Adapts Content Collections MDX → Lab Precision Engagement shape.
 */
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { type Domain, type Engagement, type Surface, type CapabilityGroup } from "@/data/lab-precision";
import { domainSlug, capabilitySlug } from "@/data/lab-precision";

export type WorkEntry = CollectionEntry<"work">;

const DOMAINS: Domain[] = ["Fintech", "ERP & QA", "Systems", "Operations"];

function normalizeDomain(raw: string): Domain {
  const lower = raw.toLowerCase();
  if (lower.includes("fintech")) return "Fintech";
  if (lower.includes("erp")) return "ERP & QA";
  if (lower.includes("judgment") || lower === "systems") return "Systems";
  return "Operations";
}

function mapSurface(s: WorkEntry["data"]["surfaces"][number]): Surface {
  return {
    name: s.name,
    nameFr: s.nameFr,
    blurb: s.blurb,
    blurbFr: s.blurbFr,
    url: s.url,
    urlLabel: s.urlLabel,
    urlLabelFr: s.urlLabelFr,
    video: s.video,
    poster: s.poster,
    stack: s.stack ?? [],
  };
}

function mapWorkEntryToEngagement(entry: WorkEntry): Engagement {
  const data = entry.data;
  const slug = entry.id.replace(/\/(en|fr)$/, "");
  const domain = normalizeDomain(data.domain);

  const surfaces = (data.surfaces ?? []).map(mapSurface);

  // Find the first surface with a video for preview media
  const primarySurface = surfaces[0];
  const media = primarySurface?.video
    ? primarySurface.video.replace("/media/case-studies/everest-finance/", "").replace(".mp4", "")
    : undefined;

  return {
    name: data.title,
    slug,
    domain,
    detail: data.summary,
    builds: surfaces.length ?? 1,
    period: data.period ?? data.date,
    href: `/work/${slug}`,
    media,
    caption: primarySurface?.name ?? data.title,
    surfaces,
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

const CAPABILITY_MAP: Record<string, { en: string; fr: string }[]> = {
  "everest-finance": [
    { en: "Payment & financial systems", fr: "Systèmes de paiement & financiers" },
    { en: "KYC & compliance", fr: "KYC & conformité" },
    { en: "Dashboards & reporting", fr: "Tableaux de bord & reporting" },
  ],
  ergobit: [
    { en: "ERP customization", fr: "Personnalisation ERP" },
    { en: "Test automation & QA", fr: "Automatisation des tests & QA" },
  ],
  bankingbook: [
    { en: "Payment & financial systems", fr: "Systèmes de paiement & financiers" },
    { en: "API architecture", fr: "Architecture d'API" },
  ],
  "ndouckmane-transit": [
    { en: "Customs & logistics", fr: "Douane & logistique" },
    { en: "Payment & financial systems", fr: "Systèmes de paiement & financiers" },
    { en: "Auth & multi-tenancy", fr: "Auth & multi-locataire" },
  ],
  "mansour-holding": [
    { en: "Dashboards & reporting", fr: "Tableaux de bord & reporting" },
    { en: "API architecture", fr: "Architecture d'API" },
  ],
  eduplan: [
    { en: "Education platforms", fr: "Plateformes éducatives" },
    { en: "Dashboards & reporting", fr: "Tableaux de bord & reporting" },
  ],
  "dakar-sport-shop": [
    { en: "E-commerce platforms", fr: "Plateformes e-commerce" },
  ],
  "bocalbun-retrospective": [
    { en: "Developer tooling", fr: "Outillage développeur" },
  ],
};

/** Engagements grouped by capability for the console IA. */
export async function getEngagementsByCapability(
  locale: "en" | "fr" = "en",
): Promise<CapabilityGroup[]> {
  const engagements = await getEngagements();
  const map = new Map<string, { label: string; slug: string; engagements: Engagement[] }>();

  for (const eng of engagements) {
    const caps = CAPABILITY_MAP[eng.slug] ?? [];
    for (const cap of caps) {
      const label = cap[locale];
      const slug = capabilitySlug(cap.en);
      if (!map.has(slug)) {
        map.set(slug, { label, slug, engagements: [] });
      }
      map.get(slug)!.engagements.push(eng);
    }
  }

  return Array.from(map.values())
    .map(({ label, slug, engagements }) => ({ capability: label, slug, engagements }))
    .sort((a, b) => a.capability.localeCompare(b.capability));
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
