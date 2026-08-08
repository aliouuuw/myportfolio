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

/** Career git-graph stint (horizontal branch timeline). */
export interface CareerStint {
  key: string;
  lane: number;
  label: string;
  labelFr: string;
  name: string;
  nameFr?: string;
  role: string;
  roleFr?: string;
  period: string;
  periodFr?: string;
  proof: string;
  proofFr?: string;
  current?: boolean;
  /** Case-study slug under /work/ when public proof exists. */
  caseSlug?: string;
}

export interface Credential {
  item: string;
  itemFr?: string;
  detail: string;
  detailFr?: string;
  /** Primary credentials shown first; others demoted. */
  featured?: boolean;
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

/** @deprecated Prefer careerStints for the Background graph. Kept for any residual callers. */
export const journey: JourneyEntry[] = [
  {
    period: "2025 - now",
    periodFr: "2025 - présent",
    branch: "everest-finance",
    role: "Solo technical operator",
    roleFr: "Opérateur technique solo",
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

/**
 * Horizontal git-branch career graph — chronological left→right.
 * Topology adapted from myportfolio-nextjs synthesis career graph.
 */
export const careerStints: CareerStint[] = [
  {
    key: "daust",
    lane: 1,
    label: "Contract",
    labelFr: "Contrat",
    name: "DAUST",
    role: "Python tutoring & teaching assistant",
    roleFr: "Tutorat Python et assistant d'enseignement",
    period: "2018",
    proof: "OOP mentoring for undergraduates and self-authored course material.",
    proofFr: "Mentorat OOP pour étudiants de premier cycle et matériel de cours auto-écrit.",
  },
  {
    key: "itech",
    lane: 0,
    label: "Internship",
    labelFr: "Stage",
    name: "ITech Solutions Afrique",
    role: "IoT development internship — Arduino geolocation",
    roleFr: "Stage IoT — géolocalisation Arduino",
    period: "2019",
    proof: "Geolocation system on Azure; planning rework cut system costs by ~20%.",
    proofFr: "Système de géolocalisation sur Azure ; la replanification a réduit les coûts d'environ 20 %.",
  },
  {
    key: "orange",
    lane: 0,
    label: "COOP",
    labelFr: "COOP",
    name: "Orange Digital Lab",
    role: "Mobile development — COOP internship",
    roleFr: "Développement mobile — stage COOP",
    period: "2022",
    proof: "React Native fitness community app (1,000+ members) and impact reports for decision-makers.",
    proofFr: "App communauté fitness React Native (1 000+ membres) et rapports d'impact pour décideurs.",
  },
  {
    key: "ergobit-fe",
    lane: 0,
    label: "COOP",
    labelFr: "COOP",
    name: "ERGOBIT",
    role: "Frontend development — Q1 COOP internship",
    roleFr: "Développement frontend — stage COOP Q1",
    period: "2023 · Q1",
    proof: "Frontend COOP deliverables on client ERP-facing surfaces.",
    proofFr: "Livrables frontend COOP sur des surfaces ERP client.",
  },
  {
    key: "purolator",
    lane: 0,
    label: "COOP · PT",
    labelFr: "COOP · TP",
    name: "Purolator Digital Lab",
    role: "Software engineering — Q3 COOP + Q4 part-time contractor",
    roleFr: "Génie logiciel — COOP T3 + contrat temps partiel T4",
    period: "2023 · Q3–Q4",
    periodFr: "2023 · T3–T4",
    proof: "CI/CD migration across three projects, internal Power Automate / Azure DevOps tooling, package-sorter SDK.",
    proofFr: "Migration CI/CD sur trois projets, outillage Power Automate / Azure DevOps, SDK trieuse de colis.",
  },
  {
    key: "bankingbook",
    lane: 1,
    label: "Contract",
    labelFr: "Contrat",
    name: "BankingBook Analytics",
    role: "Software engineer — full-time contract",
    roleFr: "Ingénieur logiciel — contrat temps plein",
    period: "2024 → 2025",
    periodFr: "2024 → 2025",
    proof: "Open-banking APIs for cloud-native ALM, UEMOA i18n, web and mail migration to bbafintech.com.",
    proofFr: "APIs open banking pour ALM cloud-native, i18n UEMOA, migration web et mail vers bbafintech.com.",
    caseSlug: "bankingbook-analytics",
  },
  {
    key: "ergobit-se",
    lane: 1,
    label: "Contract",
    labelFr: "Contrat",
    name: "ERGOBIT",
    role: "Software engineering — ERP development & infra",
    roleFr: "Génie logiciel — ERP et infra",
    period: "Q3 2024 → Q1 2026",
    periodFr: "T3 2024 → T1 2026",
    proof: "Custom ERP/BI modules, Azure DevOps CI/CD, Odoo 18 acceptance-testing kit for migration teams.",
    proofFr: "Modules ERP/BI custom, CI/CD Azure DevOps, kit de tests d'acceptation Odoo 18 pour équipes de migration.",
    caseSlug: "odoo-testing-toolkit",
  },
  {
    key: "everest",
    lane: 1,
    label: "Contract",
    labelFr: "Contrat",
    name: "Everest Finance",
    role: "Solo technical operator — across three fintech products",
    roleFr: "Opérateur technique solo — sur trois produits fintech",
    period: "Q3 2025 → Now",
    periodFr: "T3 2025 → présent",
    proof: "Public site + CMS, Formos campaign capture, and Sama Naffa customer app toward one operating model — two in production, Formos in demo.",
    proofFr: "Site public + CMS, capture de campagnes Formos et app client Sama Naffa vers un seul modèle d'exploitation — deux en production, Formos en démo.",
    current: true,
    caseSlug: "everest-finance",
  },
];

/** Parent → child edges. Use `between` to branch from the segment on the main line. */
export type CareerGraphEdge =
  | { from: string; to: string }
  | { from: string; between: string; to: string };

/** Parent → child edges (merge at ergobit-se). */
export const careerGraphEdges: CareerGraphEdge[] = [
  { from: "daust", to: "itech" },
  { from: "itech", to: "orange" },
  { from: "orange", to: "ergobit-fe" },
  { from: "ergobit-fe", to: "purolator" },
  { from: "purolator", to: "bankingbook" },
  { from: "purolator", to: "ergobit-se" },
  { from: "bankingbook", to: "ergobit-se" },
  { from: "ergobit-se", to: "everest" },
];

export const careerAxisYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] as const;

export const credentials: Credential[] = [
  {
    item: "B.Sc. Software Engineering",
    itemFr: "B.Sc. Génie logiciel",
    detail: "University of Ottawa",
    detailFr: "Université d'Ottawa",
    featured: true,
  },
  {
    item: "B.Sc. Computer Science",
    itemFr: "B.Sc. Informatique",
    detail: "DAUST",
    detailFr: "DAUST",
    featured: true,
  },
  {
    item: "Odoo 18 Functional",
    itemFr: "Odoo 18 Functional",
    detail: "Odoo",
    detailFr: "Odoo",
    featured: true,
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
