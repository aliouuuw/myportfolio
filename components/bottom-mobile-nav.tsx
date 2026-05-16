"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function BottomMobileNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  // Extract locale from pathname (e.g., /en/work -> en)
  const locale = pathname.split("/")[1] || "en";

  const links = [
    { href: `/${locale}`, label: t("homeShort"), ariaLabel: t("home") },
    { href: `/${locale}/work`, label: t("workShort"), ariaLabel: t("work") },
    { href: `/${locale}/writing`, label: t("writingShort"), ariaLabel: t("writing") },
    { href: `/${locale}/about`, label: t("aboutShort"), ariaLabel: t("about") },
    { href: `/${locale}/contact`, label: t("contactShort"), ariaLabel: t("contact") },
  ] as const;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-canvas sm:hidden"
      aria-label={t("mobileNavAriaLabel")}
    >
      <ul className="flex h-14 items-stretch">
        {links.map(({ href, label, ariaLabel }) => {
          const isActive =
            pathname === href || (href !== `/${locale}` && pathname.startsWith(`${href}/`));

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`relative flex h-full flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                  isActive ? "text-accent" : "text-ink-tertiary hover:text-ink-secondary"
                }`}
                aria-label={ariaLabel}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator hairline */}
                {isActive && (
                  <span
                    className="absolute top-0 left-1/4 right-1/4 h-px bg-accent"
                    aria-hidden="true"
                  />
                )}
                {/* Label */}
                <span className="font-mono text-[10px] font-medium uppercase tracking-wide">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
