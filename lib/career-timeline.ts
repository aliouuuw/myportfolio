/**
 * Career timeline for the synthesis homepage git-graph employers section.
 * Positions use month indices from Jan 2018; span runs through May 2026.
 */

export const CAREER_ORIGIN_YEAR = 2018;
export const CAREER_TIMELINE_END = { year: 2026, month: 5 } as const;

export type CareerStint = {
  key: string;
  lane: number;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  current?: boolean;
  linkedWork: string[];
};

export function careerMonthIndex(year: number, month: number): number {
  return (year - CAREER_ORIGIN_YEAR) * 12 + (month - 1);
}

export const CAREER_TIMELINE_SPAN =
  careerMonthIndex(
    CAREER_TIMELINE_END.year,
    CAREER_TIMELINE_END.month,
  ) + 1;

export function careerTimelinePercent(monthIndex: number): number {
  const max = CAREER_TIMELINE_SPAN - 1;
  if (max <= 0) return 0;
  return (monthIndex / max) * 100;
}

export function careerStintMidpoint(stint: CareerStint): number {
  const start = careerMonthIndex(stint.startYear, stint.startMonth);
  const end = careerMonthIndex(stint.endYear, stint.endMonth);
  return (start + end) / 2;
}

/** Chronological stints with corrected dates from resume. */
export const CAREER_STINTS: CareerStint[] = [
  {
    key: "daust",
    lane: 0,
    startYear: 2018,
    startMonth: 1,
    endYear: 2018,
    endMonth: 12,
    linkedWork: [],
  },
  {
    key: "itech",
    lane: 0,
    startYear: 2019,
    startMonth: 1,
    endYear: 2019,
    endMonth: 12,
    linkedWork: [],
  },
  {
    key: "orange",
    lane: 0,
    startYear: 2022,
    startMonth: 1,
    endYear: 2022,
    endMonth: 12,
    linkedWork: [],
  },
  {
    key: "ergobit-fe",
    lane: 1,
    startYear: 2023,
    startMonth: 1,
    endYear: 2023,
    endMonth: 3,
    linkedWork: [],
  },
  {
    key: "bankingbook",
    lane: 2,
    startYear: 2023,
    startMonth: 1,
    endYear: 2024,
    endMonth: 6,
    linkedWork: [],
  },
  {
    key: "purolator",
    lane: 0,
    startYear: 2023,
    startMonth: 7,
    endYear: 2023,
    endMonth: 12,
    linkedWork: [],
  },
  {
    key: "ergobit-se",
    lane: 1,
    startYear: 2024,
    startMonth: 7,
    endYear: 2026,
    endMonth: 3,
    linkedWork: ["02", "03"],
  },
  {
    key: "everest",
    lane: 2,
    startYear: 2025,
    startMonth: 7,
    endYear: 2026,
    endMonth: 5,
    current: true,
    linkedWork: ["01"],
  },
];

/** Git-style parent edges (merge at ergobit-se). */
export const CAREER_GRAPH_EDGES: { from: string; to: string }[] = [
  { from: "daust", to: "itech" },
  { from: "itech", to: "orange" },
  { from: "orange", to: "ergobit-fe" },
  { from: "ergobit-fe", to: "purolator" },
  { from: "ergobit-fe", to: "bankingbook" },
  { from: "purolator", to: "ergobit-se" },
  { from: "bankingbook", to: "ergobit-se" },
  { from: "ergobit-se", to: "everest" },
];

export const CAREER_AXIS_YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] as const;

const STINT_BY_KEY = new Map(CAREER_STINTS.map((s) => [s.key, s]));

export function getCareerStint(key: string): CareerStint | undefined {
  return STINT_BY_KEY.get(key);
}
