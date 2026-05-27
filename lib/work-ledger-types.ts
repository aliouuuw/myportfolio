/** Client-safe types and constants for the work ledger (no Node/fs imports). */

export type WorkLedgerStatus = "active" | "shipped" | "archived";

export const FEATURED_WORK_SLUGS = [
  "everest-finance",
  "odoo-testing-toolkit",
  "bocalbun-retrospective",
] as const;

export type FeaturedWorkSlug = (typeof FEATURED_WORK_SLUGS)[number];

export const FLAGSHIP_ESSAY_SLUG = "why-systems-over-frameworks";

export type WorkLedgerMediaSlot = {
  label: string;
  aspect: "16/10" | "4/3" | "1/1";
};

export type WorkLedgerPanelMeta = {
  tags: string[];
  outcome: string;
  stack: string;
};

export type WorkLedgerProject = {
  id: FeaturedWorkSlug;
  period: string;
  title: string;
  domain: string;
  summary: string;
  proofClaim: string;
  status: WorkLedgerStatus;
  mediaSlots: WorkLedgerMediaSlot[];
  meta: WorkLedgerPanelMeta;
};
