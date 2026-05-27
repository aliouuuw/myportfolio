import {
  readWorkFrontmatter,
  type CaseStudyFrontmatter,
  type WorkLedgerStatus,
} from "@/lib/mdx";

/** Homepage + mock ledger anchor slugs (v1). Do not add a fourth before these ship. */
export const FEATURED_WORK_SLUGS = [
  "everest-finance",
  "odoo-testing-toolkit",
  "bocalbun-retrospective",
] as const;

export type FeaturedWorkSlug = (typeof FEATURED_WORK_SLUGS)[number];

export const FLAGSHIP_ESSAY_SLUG = "why-systems-over-frameworks";

export type WorkLedgerEntry = {
  slug: FeaturedWorkSlug;
  title: string;
  summary: string;
  status: WorkLedgerStatus;
  period: string;
  proofClaim: string;
  outcome: string;
  heroImage?: string;
  relatedEssay?: string;
  frontmatter: CaseStudyFrontmatter;
};

const DEFAULT_STATUS: Record<FeaturedWorkSlug, WorkLedgerStatus> = {
  "everest-finance": "active",
  "odoo-testing-toolkit": "shipped",
  "bocalbun-retrospective": "archived",
};

const DEFAULT_PERIOD: Record<FeaturedWorkSlug, string> = {
  "everest-finance": "2024 — present",
  "odoo-testing-toolkit": "2024",
  "bocalbun-retrospective": "2022 — stopped",
};

function localizedField(
  locale: string,
  en: string,
  fr: string,
): string {
  return locale === "fr" ? fr : en;
}

export async function getFeaturedWorkEntries(
  locale: string,
): Promise<WorkLedgerEntry[]> {
  const entries = await Promise.all(
    FEATURED_WORK_SLUGS.map(async (slug) => {
      const frontmatter = await readWorkFrontmatter(slug, locale);
      const status = frontmatter.status ?? DEFAULT_STATUS[slug];
      const period = frontmatter.period ?? DEFAULT_PERIOD[slug];

      return {
        slug,
        title: localizedField(
          locale,
          frontmatter.title,
          frontmatter.titleFr,
        ),
        summary: localizedField(
          locale,
          frontmatter.summary,
          frontmatter.summaryFr,
        ),
        status,
        period,
        proofClaim: frontmatter.proofClaim ?? "",
        outcome: frontmatter.outcome ?? "",
        heroImage: frontmatter.heroImage,
        relatedEssay: frontmatter.relatedEssay,
        frontmatter,
      };
    }),
  );

  return entries;
}
