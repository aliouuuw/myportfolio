import {
  fetchGithubContributions,
  GITHUB_CONTRIBUTIONS_CACHE_SECONDS,
  parseGithubContribYearParam,
} from "@/lib/github-contributions";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const year = parseGithubContribYearParam(searchParams.get("y"));

  if (!year) {
    return Response.json({ error: "Invalid year parameter." }, { status: 400 });
  }

  try {
    const data = await fetchGithubContributions(year);
    return Response.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${GITHUB_CONTRIBUTIONS_CACHE_SECONDS}, stale-while-revalidate=86400`,
      },
    });
  } catch (error) {
    console.error("[github/contributions]", error);
    return Response.json(
      { error: "GitHub contributions unavailable." },
      { status: 502 },
    );
  }
}
