"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { useCommandPalette } from "@/components/command-palette-provider";

export function BottomMobileNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { toggle } = useCommandPalette();

  const locale = pathname.split("/")[1] || "en";
  const homePath = `/${locale}`;
  const isHome = pathname === homePath || pathname === `${homePath}/`;

  const routeLinks: {
    href: string;
    label: string;
    ariaLabel: string;
    exact?: boolean;
  }[] = [
    { href: homePath, label: t("homeShort"), ariaLabel: t("brand"), exact: true },
    { href: `/${locale}/work`, label: t("workShort"), ariaLabel: t("work") },
    {
      href: `/${locale}/writing`,
      label: t("writingShort"),
      ariaLabel: t("writing"),
    },
    {
      href: `${homePath}#connect`,
      label: t("contactShort"),
      ariaLabel: t("contact"),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-syn-border bg-syn-canvas/95 backdrop-blur-sm sm:hidden"
      aria-label={t("mobileNavAriaLabel")}
    >
      <ul className="flex h-14 items-stretch">
        {routeLinks.map(({ href, label, ariaLabel, exact }) => {
          const isActive = exact
            ? isHome
            : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`relative flex h-full flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                  isActive
                    ? "text-syn-accent"
                    : "text-syn-ink-subtle hover:text-syn-ink-muted"
                }`}
                aria-label={ariaLabel}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <span
                    className="absolute top-0 left-1/4 right-1/4 h-px bg-syn-accent"
                    aria-hidden="true"
                  />
                )}
                <span className="font-mono text-[10px] font-medium uppercase tracking-wide">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <button
            type="button"
            className="relative flex h-full w-full flex-col items-center justify-center gap-0.5 text-syn-ink-subtle transition-colors duration-200 hover:text-syn-ink-muted"
            aria-label={t("openCommand")}
            onClick={toggle}
          >
            <span className="font-mono text-[10px] font-medium uppercase tracking-wide">
              ⌘K
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
