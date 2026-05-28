"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useAbout } from "@/components/about-provider";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

type NavItem =
  | { kind: "link"; href: string; label: string; matchPath: string }
  | { kind: "about"; label: string };

export function TopNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { openAbout } = useAbout();
  const [scrolled, setScrolled] = useState(false);

  const locale = pathname.split("/")[1] || "en";
  const homePath = `/${locale}`;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links: NavItem[] = [
    {
      kind: "link",
      href: `/${locale}/work`,
      label: t("work"),
      matchPath: `/${locale}/work`,
    },
    {
      kind: "link",
      href: `/${locale}/writing`,
      label: t("writing"),
      matchPath: `/${locale}/writing`,
    },
    { kind: "about", label: t("about") },
    {
      kind: "link",
      href: `/${locale}/contact`,
      label: t("contact"),
      matchPath: `/${locale}/contact`,
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-14 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-canvas/95 backdrop-blur-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[var(--n-page,72rem)] items-center justify-between gap-4 px-[var(--n-gutter,1.25rem)]">
        <Link
          href={homePath}
          className="font-serif text-sm font-medium tracking-tight text-ink-primary transition-colors duration-200 hover:text-ink-secondary"
          aria-label={t("brandAriaLabel")}
        >
          AW
        </Link>

        <nav className="flex items-center gap-5" aria-label={t("ariaLabel")}>
          <ul className="hidden sm:flex items-center gap-5">
            {links.map((item) => {
              if (item.kind === "about") {
                return (
                  <li key="about">
                    <button
                      type="button"
                      className="text-sm text-ink-secondary transition-colors duration-200 hover:text-ink-primary"
                      onClick={openAbout}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              }

              const isActive = pathname === item.matchPath ||
                  pathname.startsWith(`${item.matchPath}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-ink-primary"
                        : "text-ink-secondary hover:text-ink-primary"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
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

          <div className="flex items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <span className="text-ink-muted" aria-hidden="true">
              |
            </span>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
