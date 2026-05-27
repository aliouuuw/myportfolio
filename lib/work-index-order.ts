/** Explicit order for supporting work entries on /work (not featured trio). */

export const SUPPORTING_WORK_SLUGS = [
  "mansour-holding",
  "ndouckmane-transit",
  "eduplan",
  "dakar-sport-shop",
] as const;

export function sortSupportingSlugs(slugs: string[]): string[] {
  const order = new Map<string, number>(
    SUPPORTING_WORK_SLUGS.map((slug, index) => [slug, index]),
  );
  return [...slugs].sort((a, b) => {
    const ai = order.get(a) ?? 999;
    const bi = order.get(b) ?? 999;
    if (ai !== bi) return ai - bi;
    return a.localeCompare(b);
  });
}
