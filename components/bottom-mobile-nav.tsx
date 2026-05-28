"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAbout } from "@/components/about-provider";

export function BottomMobileNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { openAbout } = useAbout();

  const locale = pathname.split("/")[1] || "en";
  const homePath = `/${locale}`;

  const routeLinks = [
    { href: `/${locale}/work`, label: t("workShort"), ariaLabel: t("work") },
    {
      href: `/${locale}/writing`,
      label: t("writingShort"),
      ariaLabel: t("writing"),
    },
    {
      href: `/${locale}/contact`,
      label: t("contactShort"),
      ariaLabel: t("contact"),
    },
  ] as const;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-canvas/95 backdrop-blur-sm sm:hidden"
      aria-label={t("mobileNavAriaLabel")}
    >
      <ul className="flex h-14 items-stretch">
        {routeLinks.map(({ href, label, ariaLabel }) => {
          const isActive =
            pathname === href ||
            (href !== homePath && pathname.startsWith(`${href.split("#")[0]}/`));

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`relative flex h-full flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                  isActive
                    ? "text-accent"
                    : "text-ink-tertiary hover:text-ink-secondary"
                }`}
                aria-label={ariaLabel}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <span
                    className="absolute top-0 left-1/4 right-1/4 h-px bg-accent"
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
            className="relative flex h-full w-full flex-col items-center justify-center gap-0.5 text-ink-tertiary transition-colors duration-200 hover:text-ink-secondary"
            aria-label={t("about")}
            onClick={openAbout}
          >
            <span className="font-mono text-[10px] font-medium uppercase tracking-wide">
              {t("aboutShort")}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
