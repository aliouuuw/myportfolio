import {
  readWorkFrontmatter,
  type CaseStudyFrontmatter,
} from "@/lib/mdx";
import {
  FEATURED_WORK_SLUGS,
  type FeaturedWorkSlug,
  type WorkLedgerPanelMeta,
  type WorkLedgerProject,
  type WorkLedgerStatus,
  type WorkLedgerMediaSlot,
} from "@/lib/work-ledger-types";

export {
  FEATURED_WORK_SLUGS,
  FLAGSHIP_ESSAY_SLUG,
} from "@/lib/work-ledger-types";
export type {
  FeaturedWorkSlug,
  WorkLedgerProject,
  WorkLedgerStatus,
} from "@/lib/work-ledger-types";

const LEDGER_PANEL_META: Record<FeaturedWorkSlug, WorkLedgerPanelMeta> = {
  "everest-finance": {
    tags: ["TypeScript", "Next.js", "PostgreSQL", "Internal CRM"],
    outcome: "One operational stack across web, CRM, and customer app",
    stack: "TS · Next.js · PostgreSQL",
  },
  "odoo-testing-toolkit": {
    tags: ["Odoo 18", "Robot Framework", "Playwright", "OSS"],
    outcome: "39 tests · 9 suites for Odoo 18 migration teams",
    stack: "Odoo 18 · Robot Framework",
  },
  "bocalbun-retrospective": {
    tags: ["Bun", "TypeScript", "Retrospective"],
    outcome: "Stopped at architecture; judgment over output",
    stack: "Bun · TypeScript",
  },
};

const LEDGER_MEDIA_SLOTS: Record<FeaturedWorkSlug, WorkLedgerMediaSlot[]> = {
  "everest-finance": [
    { label: "CRM workflow", aspect: "16/10" },
    { label: "System diagram", aspect: "4/3" },
  ],
  "odoo-testing-toolkit": [
    { label: "Test suites", aspect: "16/10" },
    { label: "Robot report", aspect: "4/3" },
  ],
  "bocalbun-retrospective": [
    { label: "Architecture", aspect: "4/3" },
    { label: "Lessons", aspect: "16/10" },
  ],
};

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

function localizedField(locale: string, en: string, fr: string): string {
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
        title: localizedField(locale, frontmatter.title, frontmatter.titleFr),
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

export async function getWorkLedgerProjects(
  locale: string,
): Promise<WorkLedgerProject[]> {
  const entries = await getFeaturedWorkEntries(locale);

  return entries.map((entry) => {
    const panel = LEDGER_PANEL_META[entry.slug] ?? {
      tags: entry.frontmatter.stack.slice(0, 4),
      outcome: entry.outcome || entry.summary,
      stack: entry.frontmatter.stack.slice(0, 3).join(" · "),
    };

    return {
      id: entry.slug,
      period: entry.period,
      title: entry.title,
      domain: entry.frontmatter.domain,
      summary: entry.summary,
      proofClaim: entry.proofClaim,
      status: entry.status,
      mediaSlots: LEDGER_MEDIA_SLOTS[entry.slug],
      meta: {
        tags: panel.tags,
        outcome: entry.outcome || panel.outcome,
        stack: panel.stack,
      },
    };
  });
}
