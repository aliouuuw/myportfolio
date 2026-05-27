export type CaseStatus = "active" | "shipped" | "archived";

export type LedgerCase = {
  id: string;
  period: string;
  title: string;
  domain: string;
  summary: string;
  proofClaim: string;
  proofRef: string;
  status: CaseStatus;
  /** Placeholder slots for future screenshots / demo videos */
  mediaSlots: { label: string; aspect: "16/10" | "4/3" | "1/1" }[];
  social: {
    likes: number;
    comments: number;
    views: number;
  };
};

export const MOCK_COPY = {
  name: "Aliou Wade",
  role: "Product Systems Engineer",
  positioning:
    "I build operational software systems for fintechs and operations-heavy businesses: internal tools, CRMs, admin panels, and domain-specific workflows.",
  currently:
    "Senior Technical Operator at Everest Finance. Open to two engagements, Q3 2026.",
  cases: [
    {
      id: "everest-finance",
      period: "2024 — present",
      title: "Everest Finance operational stack",
      domain: "Fintech operations",
      summary:
        "Consolidating the company website, internal CRM, and the Sama Naffa customer app into one operational system. End-to-end ownership: data modelling, internal tooling, customer-facing surfaces.",
      proofClaim: "Can this person own and ship a real fintech stack solo?",
      proofRef: "everest",
      status: "active",
      mediaSlots: [
        { label: "CRM workflow demo", aspect: "16/10" },
        { label: "System diagram", aspect: "4/3" },
        { label: "Customer surface", aspect: "16/10" },
      ],
      social: { likes: 24, comments: 7, views: 412 },
    },
    {
      id: "odoo-testing-toolkit",
      period: "2023",
      title: "Odoo 18 Acceptance Testing Toolkit",
      domain: "ERP · Open source",
      summary:
        "Robot Framework + Browser Library infrastructure for Odoo 18 migration teams. Selector guidelines, profile-based environments, CI-friendly output. 39 tests across 9 suites.",
      proofClaim: "Has this person done real ERP work, not tutorials?",
      proofRef: "odoo",
      status: "shipped",
      mediaSlots: [
        { label: "Test suite structure", aspect: "16/10" },
        { label: "Robot report", aspect: "4/3" },
      ],
      social: { likes: 31, comments: 12, views: 589 },
    },
    {
      id: "bocalbun-retrospective",
      period: "2022",
      title: "BocalBun retrospective",
      domain: "Systems judgment",
      summary:
        "Why I stopped building a Bun-native framework, and what it cost me. Lessons on architectural ambition, sunk cost, and the 'who is waiting?' filter that now shapes every system I build.",
      proofClaim: "Does this person know when to stop?",
      proofRef: "bocalbun",
      status: "archived",
      mediaSlots: [
        { label: "Entity engine diagram", aspect: "4/3" },
        { label: "Lessons excerpt", aspect: "16/10" },
      ],
      social: { likes: 18, comments: 9, views: 276 },
    },
  ] satisfies LedgerCase[],
};

/** Display metadata for work ledger detail panel (kept out of MDX). */
export const WORK_LEDGER_META: Record<
  string,
  { tags: string[]; outcome: string; stack: string }
> = {
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
    tags: ["Bun", "SQLite", "Retrospective"],
    outcome: "Stopped at architecture; judgment over output",
    stack: "Bun · SQLite · TypeScript",
  },
};
