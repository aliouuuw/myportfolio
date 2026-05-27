/** Homepage ecosystem map — client-safe static graph (portfolio-plan §12). */

export type SystemsMapItem = {
  labelKey: string;
  /** When set, label links to /{locale}/work/{slug} */
  workSlug?: string;
};

export type SystemsMapColumn = {
  id: string;
  titleKey: string;
  items: SystemsMapItem[];
};

export const SYSTEMS_MAP_COLUMNS: SystemsMapColumn[] = [
  {
    id: "fintech",
    titleKey: "colFintech",
    items: [
      { labelKey: "itemEverest", workSlug: "everest-finance" },
      { labelKey: "itemAccountOpening" },
      { labelKey: "itemSamaNaffa" },
      { labelKey: "itemMansour", workSlug: "mansour-holding" },
    ],
  },
  {
    id: "erp",
    titleKey: "colErp",
    items: [
      { labelKey: "itemOdoo", workSlug: "odoo-testing-toolkit" },
      { labelKey: "itemErgobit" },
      { labelKey: "itemBocalbun", workSlug: "bocalbun-retrospective" },
    ],
  },
  {
    id: "commerce",
    titleKey: "colCommerce",
    items: [
      { labelKey: "itemDakarSport", workSlug: "dakar-sport-shop" },
      { labelKey: "itemNdouckmane", workSlug: "ndouckmane-transit" },
    ],
  },
  {
    id: "education",
    titleKey: "colEducation",
    items: [
      { labelKey: "itemEduplan", workSlug: "eduplan" },
      { labelKey: "itemHirondelles" },
    ],
  },
];
