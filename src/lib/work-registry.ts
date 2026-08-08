/** Work Registry — single source of truth for work entries.
 *  Adapts Content Collections MDX → Lab Precision Engagement shape.
 */
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import {
  ANCHOR_SLUGS,
  ENGAGEMENT_LOGOS,
  type Domain,
  type Engagement,
  type Surface,
  type CapabilityGroup,
} from "@/data/lab-precision";
import { domainSlug, domainLabel, capabilitySlug } from "@/data/lab-precision";

export type WorkEntry = CollectionEntry<"work">;
export type WorkLocale = "en" | "fr";

const DOMAINS: Domain[] = ["Fintech", "ERP & QA", "Systems", "Operations"];

function normalizeDomain(raw: string): Domain {
  const lower = raw.toLowerCase();
  if (lower.includes("fintech")) return "Fintech";
  if (lower.includes("erp")) return "ERP & QA";
  if (lower.includes("judgment") || lower === "systems") return "Systems";
  return "Operations";
}

/** Rail / dossier title: text before an em/en dash subtitle. */
function shortName(title: string): string {
  const parts = title.split(/\s+[—–]\s+/);
  return (parts[0] ?? title).trim() || title;
}

/** Visible UI copy: no em/en dashes (hyphen only). */
function uiDash(value: string): string {
  return value.replace(/\s*[—–]\s*/g, " - ");
}

/** Localize common English period suffixes for FR home chrome. */
function localizePeriod(period: string, locale: WorkLocale): string {
  const dashed = uiDash(period);
  if (locale !== "fr") return dashed;
  return dashed
    .replace(/\bpresent\b/gi, "présent")
    .replace(/\bnow\b/gi, "présent")
    .replace(/\bstopped\b/gi, "arrêté");
}

function mapSurface(
  s: WorkEntry["data"]["surfaces"][number],
  locale: WorkLocale,
): Surface {
  const isFr = locale === "fr";
  return {
    name: uiDash(isFr ? (s.nameFr ?? s.name) : s.name),
    nameFr: s.nameFr,
    blurb: uiDash(isFr ? (s.blurbFr ?? s.blurb) : s.blurb),
    blurbFr: s.blurbFr,
    url: s.url,
    urlLabel: isFr ? (s.urlLabelFr ?? s.urlLabel) : s.urlLabel,
    urlLabelFr: s.urlLabelFr,
    video: s.video,
    poster: s.poster,
    stack: s.stack ?? [],
  };
}

function mapWorkEntryToEngagement(
  entry: WorkEntry,
  locale: WorkLocale = "en",
  /** FR MDX twin — supplies localized `outcome` (and future FR-only fields). */
  frEntry?: WorkEntry,
): Engagement {
  const data = entry.data;
  const slug = entry.id.replace(/\/(en|fr)$/, "");
  const domain = normalizeDomain(data.domain);
  const isFr = locale === "fr";

  const title = isFr ? (data.titleFr ?? data.title) : data.title;
  const summary = isFr ? (data.summaryFr ?? data.summary) : data.summary;
  const surfaces = (data.surfaces ?? []).map((s) => mapSurface(s, locale));
  const outcomeRaw = isFr
    ? (frEntry?.data.outcome ?? data.outcome)
    : data.outcome;

  // Find the first surface with a video for preview media
  const primarySurface = surfaces[0];
  const media = primarySurface?.video
    ? primarySurface.video.replace("/media/case-studies/everest-finance/", "").replace(".mp4", "")
    : undefined;

  return {
    name: shortName(title),
    slug,
    domain,
    detail: uiDash(summary),
    outcome: outcomeRaw ? uiDash(outcomeRaw) : undefined,
    logo: ENGAGEMENT_LOGOS[slug],
    builds: surfaces.length || 1,
    period: localizePeriod(data.period ?? data.date, locale),
    featured: data.featured,
    href: locale === "fr" ? `/fr/work/${slug}` : `/work/${slug}`,
    media,
    caption: primarySurface?.name ?? shortName(title),
    surfaces,
  };
}

async function frEntriesBySlug(): Promise<Map<string, WorkEntry>> {
  const frEntries = await getCollection("work", (entry) => entry.id.endsWith("/fr"));
  return new Map(
    frEntries.map((entry) => [entry.id.replace(/\/(en|fr)$/, ""), entry] as const),
  );
}

/** Featured anchors first (fixed order), then supporting by period year desc. */
export function sortEngagements(engagements: Engagement[]): Engagement[] {
  return [...engagements].sort((a, b) => {
    const ai = (ANCHOR_SLUGS as readonly string[]).indexOf(a.slug);
    const bi = (ANCHOR_SLUGS as readonly string[]).indexOf(b.slug);
    const aAnchor = ai !== -1;
    const bAnchor = bi !== -1;

    if (aAnchor && bAnchor) return ai - bi;
    if (aAnchor !== bAnchor) return aAnchor ? -1 : 1;

    const yearA = parseInt(a.period?.slice(0, 4) ?? "0", 10);
    const yearB = parseInt(b.period?.slice(0, 4) ?? "0", 10);
    if (yearA !== yearB) return yearB - yearA;
    return a.slug.localeCompare(b.slug);
  });
}

/** Fetch all work entries and adapt to Engagement shape. */
export async function getEngagements(locale: WorkLocale = "en"): Promise<Engagement[]> {
  const entries = await getCollection("work", (entry) => entry.id.endsWith("/en"));
  const frBySlug = locale === "fr" ? await frEntriesBySlug() : null;
  return sortEngagements(
    entries.map((entry) => {
      const slug = entry.id.replace(/\/(en|fr)$/, "");
      return mapWorkEntryToEngagement(entry, locale, frBySlug?.get(slug));
    }),
  );
}

/** Get a single engagement by slug. */
export async function getEngagement(
  slug: string,
  locale: WorkLocale = "en",
): Promise<Engagement | null> {
  const entries = await getCollection("work", (entry) => entry.id.endsWith("/en"));
  const entry = entries.find((e) => e.id.replace(/\/(en|fr)$/, "") === slug);
  if (!entry) return null;
  const frEntry =
    locale === "fr" ? (await frEntriesBySlug()).get(slug) : undefined;
  return mapWorkEntryToEngagement(entry, locale, frEntry);
}

/** Engagements grouped by domain for directory-style indexes. */
export async function getEngagementsByDomain(
  locale: WorkLocale = "en",
): Promise<{ domain: Domain; entries: Engagement[] }[]> {
  const engagements = await getEngagements(locale);
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
  "odoo-testing-toolkit": [
    { en: "ERP customization", fr: "Personnalisation ERP" },
    { en: "Test automation & QA", fr: "Automatisation des tests & QA" },
  ],
  "bankingbook-analytics": [
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
  "les-hirondelles": [
    { en: "Education platforms", fr: "Plateformes éducatives" },
  ],
  "dakar-sport-shop": [
    { en: "E-commerce platforms", fr: "Plateformes e-commerce" },
  ],
  gerpain: [
    { en: "Payment & financial systems", fr: "Systèmes de paiement & financiers" },
    { en: "Auth & multi-tenancy", fr: "Auth & multi-locataire" },
  ],
  mamebimo: [
    { en: "E-commerce platforms", fr: "Plateformes e-commerce" },
    { en: "Auth & multi-tenancy", fr: "Auth & multi-locataire" },
  ],
  asaaman: [
    { en: "Dashboards & reporting", fr: "Tableaux de bord & reporting" },
  ],
  "bocalbun-retrospective": [
    { en: "Developer tooling", fr: "Outillage développeur" },
  ],
};

/** Engagements grouped by capability for the console IA. */
export async function getEngagementsByCapability(
  locale: WorkLocale = "en",
): Promise<CapabilityGroup[]> {
  const engagements = await getEngagements(locale);
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
export { domainSlug, domainLabel };
