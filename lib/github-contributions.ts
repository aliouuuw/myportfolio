import { SYNTHESIS_GITHUB_USER } from "@/lib/synthesis-data";

/** Shared upstream + CDN cache window (seconds). */
export const GITHUB_CONTRIBUTIONS_CACHE_SECONDS = 3600;

export type GithubContribLevel = 0 | 1 | 2 | 3 | 4;

export type GithubContribDay = {
  date: string;
  count: number;
  level: GithubContribLevel;
};

export type GithubContribData = {
  total: { lastYear: number } | Record<string, number>;
  contributions: GithubContribDay[];
};

export type GithubContribYearParam = "last" | "all" | number;

const YEAR_PARAM = /^(last|all|20[12][0-9])$/;

export function parseGithubContribYearParam(
  raw: string | null,
): string | null {
  if (raw === null || raw === "") return "last";
  return YEAR_PARAM.test(raw) ? raw : null;
}

export function githubContributionsUpstreamUrl(
  user: string,
  year: string,
): string {
  return `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=${encodeURIComponent(year)}`;
}

export async function fetchGithubContributions(
  year: string,
  user: string = SYNTHESIS_GITHUB_USER,
): Promise<GithubContribData> {
  const response = await fetch(githubContributionsUpstreamUrl(user, year), {
    next: { revalidate: GITHUB_CONTRIBUTIONS_CACHE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub contributions upstream responded with ${response.status}`,
    );
  }

  return response.json() as Promise<GithubContribData>;
}

export function githubContributionsApiPath(year: string): string {
  return `/api/github/contributions?y=${encodeURIComponent(year)}`;
}
