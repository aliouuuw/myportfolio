/** First-visit locale detection. Cookie means detection already ran; URL wins after that. */
export const LOCALE_DETECTED_COOKIE = "portfolio-locale-detected";

export function hasDetectedLocale(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  return cookieHeader.split(";").some((part) => part.trim() === `${LOCALE_DETECTED_COOKIE}=1`);
}

export function shouldSkipLocaleDetect(pathname: string): boolean {
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/_")) return true;
  if (pathname.includes(".")) return true;
  return false;
}

export function isFrenchPath(pathname: string): boolean {
  return pathname === "/fr" || pathname.startsWith("/fr/");
}

/** Map an unprefixed path onto the French prefix. */
export function toFrenchPath(pathname: string): string {
  if (pathname === "/") return "/fr/";
  return `/fr${pathname}`;
}

type LangQ = { tag: string; q: number };

function parseAcceptLanguage(header: string): LangQ[] {
  return header.split(",").map((part) => {
    const [rawTag, ...params] = part.trim().split(";");
    const tag = (rawTag ?? "").trim().toLowerCase();
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
    return { tag, q: Number.isFinite(q) ? q : 0 };
  });
}

function bestQ(parts: LangQ[], prefix: string): number {
  let best = 0;
  for (const { tag, q } of parts) {
    if (tag === prefix || tag.startsWith(`${prefix}-`)) {
      if (q > best) best = q;
    }
  }
  return best;
}

/** True when French outranks English in Accept-Language. Default is English. */
export function prefersFrench(acceptLanguage: string | null): boolean {
  if (!acceptLanguage) return false;
  const parts = parseAcceptLanguage(acceptLanguage);
  const fr = bestQ(parts, "fr");
  const en = bestQ(parts, "en");
  return fr > en;
}
