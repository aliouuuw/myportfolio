export function buildCanonical(locale: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aliouwade.com";
  return `${base}/${locale}${path}`;
}
