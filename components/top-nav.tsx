"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

export function TopNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Extract locale from pathname (e.g., /en/work -> en)
  const locale = pathname.split("/")[1] || "en";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: `/${locale}#work`, label: t("work"), matchPath: `/${locale}/work` },
    {
      href: `/${locale}#writing`,
      label: t("writing"),
      matchPath: `/${locale}/writing`,
    },
    { href: `/${locale}#about`, label: t("about"), matchPath: `/${locale}/about` },
    {
      href: `/${locale}#contact`,
      label: t("contact"),
      matchPath: `/${locale}/contact`,
    },
  ] as const;

  const brandHref = `/${locale}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-14 transition-colors duration-300 ${
        scrolled ? "bg-canvas" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-4 px-6 sm:px-12 lg:px-24">
        {/* Brand */}
        <Link
          href={brandHref}
          className="font-serif text-sm font-medium tracking-tight text-ink-primary transition-colors duration-200 hover:text-ink-secondary"
          aria-label={t("brandAriaLabel")}
        >
          AW
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6" aria-label={t("ariaLabel")}>
          {/* Section links */}
          <ul className="hidden sm:flex items-center gap-6">
            {links.map(({ href, label, matchPath }) => {
              const isActive =
                pathname === matchPath ||
                pathname.startsWith(`${matchPath}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-ink-primary"
                        : "text-ink-secondary hover:text-ink-primary"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                    {isActive && (
                      <span
                        className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Separators and toggles */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-ink-muted" aria-hidden="true">
              ·
            </span>
            <LocaleSwitcher locale={locale} />
            <span className="text-ink-muted" aria-hidden="true">
              ·
            </span>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
