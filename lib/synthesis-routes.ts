/** Path helpers for synthesis shell (dark chrome, mock-style nav). */

export function getLocaleFromPathname(pathname: string): string {
  return pathname.split("/")[1] || "en";
}

export function isSynthesisHomePath(pathname: string, locale?: string): boolean {
  const loc = locale ?? getLocaleFromPathname(pathname);
  return pathname === `/${loc}` || pathname === `/${loc}/`;
}

export function isSynthesisWorkPath(pathname: string, locale?: string): boolean {
  const loc = locale ?? getLocaleFromPathname(pathname);
  return (
    pathname === `/${loc}/work` || pathname.startsWith(`/${loc}/work/`)
  );
}

export function isSynthesisShellPath(pathname: string): boolean {
  const locale = getLocaleFromPathname(pathname);
  return isSynthesisHomePath(pathname, locale) || isSynthesisWorkPath(pathname, locale);
}
