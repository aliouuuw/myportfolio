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

export interface Surface {
  name: string;
  nameFr?: string;
  blurb: string;
  blurbFr?: string;
  url?: string;
  urlLabel?: string;
  urlLabelFr?: string;
  video?: string;
  poster?: string;
  stack: string[];
}

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
  surfaces: Surface[];
}

export interface CapabilityGroup {
  capability: string;
  slug: string;
  engagements: Engagement[];
}

export function capabilitySlug(capability: string): string {
  return capability.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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

const domains: Domain[] = ["Fintech", "ERP & QA", "Systems", "Operations"];

export const domainOrder: Domain[] = domains;

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
