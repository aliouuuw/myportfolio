import type { Domain } from "@/data/lab-precision";

/** Row status on the home Work list. */
export type WorkStatus = "live" | "staging" | "building" | "private" | "stopped";

/**
 * Current projects, shown first on Work. Older proofs come from `content/work/` MDX
 * (see `getWorkRows` in work-registry). Dates are first-commit months, used for sorting.
 * When Zeffet ships: add `url` + `host` and set `status: "live"`.
 */
export interface CurrentProject {
  slug: string;
  name: string;
  url?: string;
  host?: string;
  status: WorkStatus;
  domain: Domain;
  date: string;
  what: string;
  whatFr: string;
}

/** Curatorial order for Work sort = Selected (see `getWorkRows`). */
export const selectedWorkOrder: string[] = [
  "dakar-cafe-express",
  "sama-naffa",
  "everest-finance",
  "mansour-holding",
  "dakar-sport-shop",
  "sunu-justice",
  "asaaman",
  "les-hirondelles",
  "bankingbook-analytics",
  "gerpain",
  "mamebimo",
  "zeffet",
  "eduplan",
  "bocalbun-retrospective",
  "ndouckmane-transit",
  "odoo-testing-toolkit",
];

export const currentProjects: CurrentProject[] = [
  {
    slug: "dakar-cafe-express",
    name: "Dakar Café Express",
    url: "https://dakarcafeexpress.com",
    host: "dakarcafeexpress.com",
    status: "live",
    domain: "Operations",
    date: "2025-07",
    what: "Nespresso capsules, machines, and beans. Two-hour delivery in Dakar.",
    whatFr: "Capsules Nespresso, machines et grains. Livraison en 2 h à Dakar.",
  },
  {
    slug: "sama-naffa",
    name: "Sama Naffa",
    url: "https://samanaffa.com",
    host: "samanaffa.com",
    status: "live",
    domain: "Fintech",
    date: "2025-06",
    what: "Savings app with KYC, deposits, and an admin. Built for Everest Finance.",
    whatFr: "Application d'épargne avec KYC, dépôts et back-office. Pour Everest Finance.",
  },
  {
    slug: "sunu-justice",
    name: "Sunu Justice",
    url: "https://sunujustice.chat",
    host: "sunujustice.chat",
    status: "live",
    domain: "Systems",
    date: "2026-09",
    what: "Independent citizen-intake prototype. Not a Ministry of Justice service.",
    whatFr: "Prototype indépendant d'accueil citoyen. Pas un service du Ministère de la Justice.",
  },
  {
    /* Same slug as the retired MDX case, so /work/everest-finance and old #engagement links land here. */
    slug: "everest-finance",
    name: "Everest Finance",
    url: "https://staging.everestfin.com",
    host: "staging.everestfin.com",
    status: "staging",
    domain: "Fintech",
    date: "2025-08",
    what: "Public site and CMS for a regulated investment firm in the UEMOA zone.",
    whatFr: "Site public et CMS pour une SGI agréée de la zone UEMOA.",
  },
  {
    slug: "zeffet",
    name: "Zeffet",
    status: "building",
    domain: "Systems",
    date: "2026-09",
    what: "Mac cleaning app that measures every clean. Link when it ships.",
    whatFr: "App de nettoyage Mac qui mesure chaque nettoyage. Lien à la sortie.",
  },
];
