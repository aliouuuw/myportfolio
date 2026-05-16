import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { MobileNav } from "@/components/mobile-nav";

type NavProps = {
  locale: string;
};

export async function Nav({ locale }: NavProps) {
  const t = await getTranslations("Nav");
  const tCommon = await getTranslations();

  const links = [
    { href: `/${locale}/work`, label: t("work") },
    { href: `/${locale}/writing`, label: t("writing") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ] as const;

  const brandHref = `/${locale}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-canvas/95 backdrop-blur-sm supports-backdrop-filter:bg-canvas/85">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-6 sm:px-12 lg:px-24">
        <Link
          href={brandHref}
          className="shrink-0 text-sm font-semibold tracking-tight text-ink-primary"
        >
          {t("brand")}
        </Link>
        <nav
          className="flex min-w-0 flex-1 items-center justify-end gap-4 sm:gap-6"
          aria-label={t("ariaLabel")}
        >
          {/* Desktop navigation */}
          <ul className="hidden sm:flex min-w-0 flex-wrap items-center justify-end gap-x-4 gap-y-1 sm:gap-x-6">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-ink-secondary transition-colors duration-200 ease-out hover:text-ink-primary"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <LocaleSwitcher locale={locale} />

          {/* Mobile navigation */}
          <MobileNav
            links={links.map((link) => ({
              ...link,
            }))}
            brand={t("brand")}
            brandHref={brandHref}
            ariaLabel={t("ariaLabel")}
            closeLabel={tCommon("common.close")}
            menuLabel={tCommon("common.menu")}
          />
        </nav>
      </div>
    </header>
  );
}
