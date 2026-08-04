export type Domain = "Fintech" | "ERP & QA" | "Systems" | "Operations";

export const domainSlug = (domain: Domain): string => {
  const map: Record<Domain, string> = {
    Fintech: "fintech",
    "ERP & QA": "erp",
    Systems: "systems",
    Operations: "ops",
  };
  return map[domain];
};

export interface Engagement {
  name: string;
  slug: string;
  domain: Domain;
  detail: string;
  builds: number;
  period: string;
  href?: string;
  /** Everest surface id under /media/case-studies/everest-finance/ */
  media?: string;
  caption?: string;
}

export interface JourneyEntry {
  period: string;
  branch: string;
  role: string;
  org: string;
  note: string;
}

export interface Credential {
  item: string;
  detail: string;
}

/** Index rows are engagements, not individual builds. */
export const engagements: Engagement[] = [
  {
    name: "Everest Finance",
    slug: "everest-finance",
    domain: "Fintech",
    detail: "SGI · site, savings app, campaign tooling",
    builds: 3,
    period: "2025 - now",
    href: "/work/everest-finance",
    media: "sama-naffa",
    caption: "Everest · Sama Naffa savings platform",
  },
  {
    name: "ERGOBIT",
    slug: "ergobit",
    domain: "ERP & QA",
    detail: "Odoo integrator · test toolkit, client modules",
    builds: 2,
    period: "2024 - 26",
    href: "/work/odoo-testing-toolkit",
  },
  {
    name: "BankingBook Analytics",
    slug: "bankingbook",
    domain: "Fintech",
    detail: "Open-banking API, domain cutover",
    builds: 2,
    period: "2023 - 24",
  },
  {
    name: "Purolator Digital Lab",
    slug: "purolator-lab",
    domain: "Systems",
    detail: "CI/CD, approval tooling, warehouse SDK",
    builds: 3,
    period: "2023",
  },
  {
    name: "BocalBun",
    slug: "bocalbun-retrospective",
    domain: "Systems",
    detail: "Bun toolkit, frozen deliberately",
    builds: 1,
    period: "2022",
    href: "/work/bocalbun-retrospective",
  },
  {
    name: "Mansour Holding",
    slug: "mansour-holding",
    domain: "Operations",
    detail: "Automotive · dealership site, inventory",
    builds: 2,
    period: "Live",
    href: "/work/mansour-holding",
  },
  {
    name: "Ndouckmane Transit",
    slug: "ndouckmane-transit",
    domain: "Operations",
    detail: "Logistics · freight ops, customs",
    builds: 1,
    period: "Active",
    href: "/work/ndouckmane-transit",
  },
  {
    name: "Mamebimo",
    slug: "mamebimo",
    domain: "Operations",
    detail: "Marketplace · home-services booking",
    builds: 1,
    period: "Live",
  },
  {
    name: "Gerpain",
    slug: "gerpain",
    domain: "Operations",
    detail: "Multi-bakery inventory, RBAC",
    builds: 1,
    period: "Shipped",
  },
  {
    name: "EduPlan",
    slug: "eduplan",
    domain: "Operations",
    detail: "Education · courses, schedule, grading",
    builds: 1,
    period: "Shipped",
    href: "/work/eduplan",
  },
  {
    name: "Les Hirondelles",
    slug: "les-hirondelles",
    domain: "Operations",
    detail: "Education · school site, Convex CMS",
    builds: 1,
    period: "Live",
  },
  {
    name: "Asaaman",
    slug: "asaaman",
    domain: "Systems",
    detail: "Drone / AI · semantic video search",
    builds: 1,
    period: "Live",
  },
  {
    name: "Dakar Sport",
    slug: "dakar-sport-shop",
    domain: "Operations",
    detail: "Retail · commerce and community",
    builds: 1,
    period: "Shipped",
    href: "/work/dakar-sport-shop",
  },
  {
    name: "Orange Digital Lab",
    slug: "orange-dlab",
    domain: "Systems",
    detail: "React Native fitness community app",
    builds: 1,
    period: "2022",
  },
];

const domains: Domain[] = ["Fintech", "ERP & QA", "Systems", "Operations"];

export const domainOrder: Domain[] = domains;

/** Engagements grouped by domain for directory-style indexes. */
export const engagementsByDomain: { domain: Domain; entries: Engagement[] }[] =
  domains
    .map((domain) => ({
      domain,
      entries: engagements.filter((entry) => entry.domain === domain),
    }))
    .filter((group) => group.entries.length > 0);

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

export const filters = [
  { label: "All", value: "all", count: engagements.length },
  ...domains.map((domain) => ({
    label: domain,
    value: domain,
    count: engagements.filter((entry) => entry.domain === domain).length,
  })),
];

export const journey: JourneyEntry[] = [
  {
    period: "2025 - now",
    branch: "everest-finance",
    role: "Senior technical operator",
    org: "Everest Finance, Dakar",
    note: "Solo across three fintech products.",
  },
  {
    period: "2024 - 26",
    branch: "ergobit",
    role: "Software engineer",
    org: "ERGOBIT, Dakar",
    note: "Odoo modules and migration test discipline.",
  },
  {
    period: "2023 - 24",
    branch: "bankingbook",
    role: "Contract engineer",
    org: "BankingBook Analytics",
    note: "Open-banking API layer for UEMOA ALM.",
  },
  {
    period: "2023",
    branch: "purolator-lab",
    role: "COOP engineer",
    org: "Purolator Digital Lab, Ottawa",
    note: "CI/CD across three logistics codebases.",
  },
  {
    period: "2022",
    branch: "orange-dlab",
    role: "COOP developer",
    org: "Orange Digital Lab",
    note: "Fitness community app, 1,000+ members.",
  },
  {
    period: "2019",
    branch: "itech-afrique",
    role: "Intern",
    org: "ITech Solutions Afrique",
    note: "Azure geolocation IoT.",
  },
];

export const credentials: Credential[] = [
  { item: "B.Sc. Software Engineering", detail: "University of Ottawa" },
  { item: "B.Sc. Computer Science", detail: "DAUST" },
  { item: "Odoo 18 Functional", detail: "Odoo" },
  { item: "Front-End Developer Professional", detail: "Meta" },
  { item: "Python Data Science", detail: "Datacamp" },
];

export const mediaRoot = "/media/case-studies/everest-finance";
