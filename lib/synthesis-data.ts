/**
 * Shared Synthesis homepage data (mock + production).
 * User-facing copy for employers/clients/work rows moves to messages in later phases.
 */

import { CAREER_STINTS } from "@/lib/career-timeline";
import { FEATURED_WORK_SLUGS, type FeaturedWorkSlug } from "@/lib/work-ledger-types";

export const SYNTHESIS_EMAIL = "wadealiou00@gmail.com";
export const SYNTHESIS_GITHUB_USER = "aliouuuw";
export const SYNTHESIS_BOOT_KEY = "synthesis-boot-v1";

export const SYNTHESIS_RAIL_SECTIONS = [
  { id: "profile", label: "profile" },
  { id: "work", label: "work" },
  { id: "about", label: "about" },
  { id: "writing", label: "notes" },
  { id: "connect", label: "connect" },
] as const;

export type SynthesisWorkStatus = "ACTIVE" | "SHIPPED" | "FROZEN";

export type SynthesisWorkRow = {
  id: string;
  /** MDX slug under content/work/; null when case study not published yet */
  slug: FeaturedWorkSlug | null;
  name: string;
  type: string;
  status: SynthesisWorkStatus;
  year: string;
  desc: string;
  stack: string;
};

/** Flagship case study rows (mock order). Slugs verified against content/work/. */
export const SYNTHESIS_WORK: SynthesisWorkRow[] = [
  {
    id: "01",
    slug: "everest-finance",
    name: "Everest Finance",
    type: "fintech_spine",
    status: "ACTIVE",
    year: "2024 → Now",
    desc: "Sole technical owner for a Senegalese fintech: public site, internal CRM, and the Sama Naffa customer app converging toward one shared operating model.",
    stack: "Next.js · React Native · PostgreSQL",
  },
  {
    id: "02",
    slug: "odoo-testing-toolkit",
    name: "ERGOBIT / Odoo 18",
    type: "erp_validation",
    status: "SHIPPED",
    year: "2024",
    desc: "Acceptance-testing starter kit for Odoo 18 migration teams: 39 tests across 9 suites, CI on Azure DevOps, and selector guidelines for maintainable ERP validation.",
    stack: "Robot Framework · Playwright · Azure DevOps",
  },
  {
    id: "03",
    slug: null,
    name: "Africa GreenTec accounting",
    type: "odoo_automation",
    status: "SHIPPED",
    year: "2024",
    desc: "Custom Odoo accounting module: automated roughly 80% of manual entries and held 10,000+ records per day in production for a renewable-energy operator.",
    stack: "Odoo · Python · BI",
  },
  {
    id: "04",
    slug: "bocalbun-retrospective",
    name: "BocalBun retrospective",
    type: "systems_judgment",
    status: "FROZEN",
    year: "2022",
    desc: "A deliberately stopped Bun toolkit. The proof is not adoption, it is knowing when clean architecture is not the highest-leverage work.",
    stack: "Bun · TypeScript · PostgreSQL · RLS",
  },
];

/** Confirmed MDX slugs for production links (excludes unpublished rows). */
export const SYNTHESIS_LINKABLE_SLUGS: readonly FeaturedWorkSlug[] =
  FEATURED_WORK_SLUGS;

/** @deprecated Mock-only shape; production uses {@link CAREER_STINTS} + i18n stints. */
export type SynthesisTeam = {
  key: string;
  name: string;
  role: string;
  tag: string;
  period: string;
  proof: string;
  current?: boolean;
  linkedWork: string[];
};

const MOCK_TEAM_LABELS: Record<
  string,
  Pick<SynthesisTeam, "name" | "role" | "tag" | "period" | "proof">
> = {
  daust: {
    name: "DAUST",
    role: "Python tutoring",
    tag: "Education",
    period: "2018",
    proof: "Teaching assistant.",
  },
  itech: {
    name: "ITech Solutions Afrique",
    role: "IoT internship",
    tag: "IoT",
    period: "2019",
    proof: "Arduino geolocation.",
  },
  orange: {
    name: "Orange Digital Lab",
    role: "Mobile COOP",
    tag: "Mobile",
    period: "2022",
    proof: "React Native app.",
  },
  "ergobit-fe": {
    name: "ERGOBIT",
    role: "Frontend COOP",
    tag: "ERP",
    period: "2023 Q1",
    proof: "Frontend internship.",
  },
  purolator: {
    name: "Purolator Digital Lab",
    role: "Software engineering",
    tag: "Logistics",
    period: "2023 Q3–Q4",
    proof: "COOP + contractor.",
  },
  bankingbook: {
    name: "BankingBook Analytics",
    role: "Software engineer",
    tag: "Open banking",
    period: "2023–2024",
    proof: "Full-time contract.",
  },
  "ergobit-se": {
    name: "ERGOBIT",
    role: "Software engineering",
    tag: "ERP / Infra",
    period: "2024–2026",
    proof: "ERP development.",
  },
  everest: {
    name: "Everest Finance",
    role: "Contractor",
    tag: "Fintech",
    period: "2025 → Now",
    proof: "Fintech product owner.",
  },
};

/** Mock synthesis page employer list (newest first). */
export const SYNTHESIS_TEAMS: SynthesisTeam[] = [...CAREER_STINTS]
  .reverse()
  .map((stint) => {
    const labels = MOCK_TEAM_LABELS[stint.key];
    return {
      key: stint.key,
      name: labels?.name ?? stint.key,
      role: labels?.role ?? "",
      tag: labels?.tag ?? "",
      period: labels?.period ?? "",
      proof: labels?.proof ?? "",
      current: stint.current,
      linkedWork: stint.linkedWork,
    };
  });

export type SynthesisFreelanceProject = {
  key: string;
  name: string;
  scope: string;
  domain: string;
  note?: string;
};

export const SYNTHESIS_FREELANCE: SynthesisFreelanceProject[] = [
  {
    key: "ndouckmane",
    name: "Ndouckmane Transit",
    scope:
      "Freight forwarder operations: shipments, customs, dashboards.",
    domain: "Logistics",
  },
  {
    key: "eduplan",
    name: "EduPlan",
    scope:
      "K-12 school operations dashboard: courses, schedule, grading.",
    domain: "Education",
  },
  {
    key: "gerpain",
    name: "Gerpain",
    scope:
      "Multi-bakery operations platform: inventory, deliveries, employees, RBAC.",
    domain: "Operations",
  },
  {
    key: "mansour",
    name: "Mansour Motors",
    scope:
      "Automotive dealership: public site and internal vehicle inventory for the operating company.",
    domain: "Automotive",
  },
  {
    key: "mamebimo",
    name: "Mamebimo",
    scope:
      "Home-services marketplace in Dakar: booking, messaging, payouts (Everest Finance product).",
    domain: "Marketplace",
  },
  {
    key: "prescriptos",
    name: "Prescriptos",
    scope:
      "Pharmacy and prescription workflow tooling (monorepo, web + API).",
    domain: "Health",
  },
  {
    key: "asaaman",
    name: "Asaaman",
    scope:
      "Senegalese intelligent-drone startup: semantic video search, surveillance workflows, and reporting.",
    domain: "Drone / AI",
  },
  {
    key: "bocal-tontine",
    name: "Bocal Tontine",
    scope:
      "Group savings rooted in African tontine traditions. Product and architecture in progress.",
    domain: "Fintech",
    note: "Concept",
  },
  {
    key: "dakar-sport",
    name: "Dakar Sport",
    scope: "Retail and community surfaces for a local sports brand.",
    domain: "Retail",
  },
  {
    key: "hirondelles",
    name: "Les Hirondelles",
    scope:
      "Institutional site for a Dakar school: Convex-backed editorial CMS.",
    domain: "Institution",
  },
];

export const SYNTHESIS_PINNED_REPOS = [
  { repo: "aliouuuw/myportfolio", noteKey: "portfolio" },
  { repo: "aliouuuw/odoo18-acceptance-testing-kit", noteKey: "odooKit" },
  { repo: "aliouuuw/agent-ready-repo", noteKey: "agentReady" },
  { repo: "aliouuuw/bocalbun", noteKey: "bocalbun" },
] as const;

export const SYNTHESIS_CAPABILITIES = [
  {
    label: "Product systems engineering",
    desc: "Bridging business workflows and software. Internal tools, admin panels, and customer surfaces.",
  },
  {
    label: "Finance & fintech",
    desc: "Open-banking APIs, CRM workflows, and secure foundations for regulated markets.",
  },
  {
    label: "ERP & BI",
    desc: "Odoo modules, CI/CD pipelines, and acceptance testing for operational teams.",
  },
  {
    label: "AI-assisted delivery",
    desc: "Agent-ready repositories and workflows that multiply engineering context.",
  },
] as const;

export const SYNTHESIS_STACK_GROUPS = [
  { k: "Language", v: "TypeScript, Python" },
  { k: "Runtime", v: "Bun, Node, Deno" },
  { k: "Frontend", v: "Next.js, React, Tailwind" },
  { k: "Backend", v: "Postgres, Drizzle, RLS" },
  { k: "ERP / QA", v: "Odoo 18, Robot, Playwright" },
  { k: "Infra", v: "Vercel, Resend, Cloudflare" },
] as const;

export const SYNTHESIS_PROCESS = [
  {
    n: "01",
    title: "Discovery",
    desc: "Workflows, spreadsheets, pain. Where the business actually leaks time.",
  },
  {
    n: "02",
    title: "Architecture",
    desc: "One stack. Boring choices. Documented tradeoffs. No premature abstraction.",
  },
  {
    n: "03",
    title: "Ship & operate",
    desc: "Live systems with real users. Iterate based on operational reality, not aesthetics.",
  },
] as const;

export function synthesisWorkHref(
  locale: string,
  slug: SynthesisWorkRow["slug"],
): string | undefined {
  if (!slug) return undefined;
  if (!(SYNTHESIS_LINKABLE_SLUGS as readonly string[]).includes(slug)) {
    return undefined;
  }
  return `/${locale}/work/${slug}`;
}
