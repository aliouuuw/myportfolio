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
  /** Placeholder slots for future screenshots / diagrams */
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
    "I build operational software systems for fintechs and operations-heavy businesses — internal tools, CRMs, admin panels, and domain-specific workflows — from Dakar, bilingual FR/EN.",
  currently:
    "Currently: Senior Technical Operator at Everest Finance. Open to two engagements, Q3 2026.",
  heroClaims: [
    "Fintech operational ownership",
    "ERP acceptance testing at scale",
    "Architecture judgment under constraint",
  ],
  cases: [
    {
      id: "everest-finance",
      period: "2024–present",
      title: "Everest Finance",
      domain: "Fintech operations",
      summary:
        "Consolidating CRM, website, and customer app into one operational system.",
      proofClaim: "Can this person own and ship a real fintech stack solo?",
      proofRef: "everest",
      status: "active",
      mediaSlots: [
        { label: "CRM workflow", aspect: "16/10" },
        { label: "System diagram", aspect: "4/3" },
        { label: "Customer surface", aspect: "16/10" },
      ],
      social: { likes: 24, comments: 7, views: 412 },
    },
    {
      id: "odoo-testing-toolkit",
      period: "2023",
      title: "Odoo Testing Toolkit",
      domain: "ERP systems",
      summary:
        "Acceptance testing infrastructure for Odoo 18 ERP migration teams.",
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
      title: "BocalBun Retrospective",
      domain: "Systems judgment",
      summary: "Why I stopped building a framework and what it cost me.",
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

export const AGENCY_TEASER = {
  label: "Open collaboration",
  title: "Agency track (coming)",
  description:
    "Developers interested in active projects will be able to request to join, with progress tracked on this site. Feedback on case studies helps prioritize what ships next.",
  progress: 12,
};
