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

/** Locale-facing domain badge label (canonical Domain stays English for CSS hooks). */
export const domainLabel = (domain: Domain, locale: "en" | "fr" = "en"): string => {
  if (locale === "en") return domain;
  const fr: Record<Domain, string> = {
    Fintech: "Fintech",
    "ERP & QA": "ERP & QA",
    Systems: "Systèmes",
    Operations: "Opérations",
  };
  return fr[domain];
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
  /** Compact outcome line from case frontmatter (shown in dossier). */
  outcome?: string;
  /** Local logo path under /logos/ when available from the board asset set. */
  logo?: string;
  builds: number;
  period: string;
  /** Homepage conversion anchors (Everest, ERGOBIT toolkit, BocalBun). */
  featured: boolean;
  href?: string;
  /** Everest surface id under /media/case-studies/everest-finance/ */
  media?: string;
  caption?: string;
  surfaces: Surface[];
}

/** Board-era logos reused on the Engagement Console (slug → public path). */
export const ENGAGEMENT_LOGOS: Record<string, string> = {
  "everest-finance": "/logos/everest-finance.png",
  "odoo-testing-toolkit": "/logos/ergobit.png",
  "bankingbook-analytics": "/logos/bbafintech.png",
  "ndouckmane-transit": "/logos/ndouckmane.svg",
  eduplan: "/logos/eduplan.svg",
  "les-hirondelles": "/logos/les-hirondelles.svg",
  gerpain: "/logos/gerpain.svg",
  "mansour-holding": "/logos/mansour.png",
  mamebimo: "/logos/mamebimo.png",
  asaaman: "/logos/asaaman.svg",
  "dakar-sport-shop": "/logos/dakar-sport.jpg",
};

/** Journey branch → logo (employers still on Background timeline). */
export const JOURNEY_LOGOS: Record<string, string> = {
  "everest-finance": "/logos/everest-finance.png",
  ergobit: "/logos/ergobit.png",
  bankingbook: "/logos/bbafintech.png",
  "purolator-lab": "/logos/purolator.png",
  "orange-dlab": "/logos/orange-dc.jpg",
  "itech-afrique": "/logos/itech-solutions.png",
};

/** Two-letter monogram when no logo asset exists. */
export function engagementMonogram(name: string): string {
  const parts = name
    .replace(/[—–].*$/, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/** Placeholder URLs end with `*` until the real public link is known. */
export function isPendingUrl(url?: string): boolean {
  return Boolean(url?.includes("*"));
}

/** Strip trailing asterisk used as a “URL TBD” marker. */
export function pendingUrlLabel(url?: string, label?: string): string {
  const raw = label || url?.replace(/^https?:\/\//, "") || "";
  return raw;
}

/** Fixed rail order for featured anchors — founders/CTOs see proof depth first. */
export const ANCHOR_SLUGS = [
  "everest-finance",
  "odoo-testing-toolkit",
  "bocalbun-retrospective",
] as const;

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
  periodFr?: string;
  branch: string;
  role: string;
  roleFr?: string;
  org: string;
  orgFr?: string;
  note: string;
  noteFr?: string;
}

export interface Credential {
  item: string;
  itemFr?: string;
  detail: string;
  detailFr?: string;
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
    periodFr: "2025 - présent",
    branch: "everest-finance",
    role: "Senior technical operator",
    roleFr: "Opérateur technique senior",
    org: "Everest Finance, Dakar",
    orgFr: "Everest Finance, Dakar",
    note: "Solo across three fintech products — two in production, Formos in demo.",
    noteFr: "Solo sur trois produits fintech — deux en production, Formos en démo.",
  },
  {
    period: "2024 - 26",
    periodFr: "2024 - 26",
    branch: "ergobit",
    role: "Software engineer",
    roleFr: "Ingénieur logiciel",
    org: "ERGOBIT, Dakar",
    orgFr: "ERGOBIT, Dakar",
    note: "Odoo modules and migration test discipline.",
    noteFr: "Modules Odoo et discipline de tests de migration.",
  },
  {
    period: "2024 - 25",
    periodFr: "2024 - 25",
    branch: "bankingbook",
    role: "Contract engineer",
    roleFr: "Ingénieur en contrat",
    org: "BankingBook Analytics",
    orgFr: "BankingBook Analytics",
    note: "Open-banking API layer for UEMOA ALM.",
    noteFr: "Couche API open banking pour l'ALM UEMOA.",
  },
  {
    period: "2023",
    periodFr: "2023",
    branch: "purolator-lab",
    role: "COOP engineer",
    roleFr: "Ingénieur COOP",
    org: "Purolator Digital Lab, Ottawa",
    orgFr: "Purolator Digital Lab, Ottawa",
    note: "CI/CD across three logistics codebases.",
    noteFr: "CI/CD sur trois bases de code logistique.",
  },
  {
    period: "2022",
    periodFr: "2022",
    branch: "orange-dlab",
    role: "COOP developer",
    roleFr: "Développeur COOP",
    org: "Orange Digital Lab",
    orgFr: "Orange Digital Lab",
    note: "Fitness community app, 1,000+ members.",
    noteFr: "App communauté fitness, plus de 1 000 membres.",
  },
  {
    period: "2019",
    periodFr: "2019",
    branch: "itech-afrique",
    role: "Intern",
    roleFr: "Stagiaire",
    org: "ITech Solutions Afrique",
    orgFr: "ITech Solutions Afrique",
    note: "Azure geolocation IoT.",
    noteFr: "IoT de géolocalisation Azure.",
  },
];

export const credentials: Credential[] = [
  {
    item: "B.Sc. Software Engineering",
    itemFr: "B.Sc. Génie logiciel",
    detail: "University of Ottawa",
    detailFr: "Université d'Ottawa",
  },
  {
    item: "B.Sc. Computer Science",
    itemFr: "B.Sc. Informatique",
    detail: "DAUST",
    detailFr: "DAUST",
  },
  {
    item: "Odoo 18 Functional",
    itemFr: "Odoo 18 Functional",
    detail: "Odoo",
    detailFr: "Odoo",
  },
  {
    item: "Front-End Developer Professional",
    itemFr: "Front-End Developer Professional",
    detail: "Meta",
    detailFr: "Meta",
  },
  {
    item: "Python Data Science",
    itemFr: "Python Data Science",
    detail: "Datacamp",
    detailFr: "Datacamp",
  },
];

export const mediaRoot = "/media/case-studies/everest-finance";
