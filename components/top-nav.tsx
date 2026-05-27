"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useAbout } from "@/components/about-provider";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

export function TopNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { openAbout } = useAbout();
  const [scrolled, setScrolled] = useState(false);

  const locale = pathname.split("/")[1] || "en";
  const homePath = `/${locale}`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: `/${locale}/work`, label: t("work") },
    { href: `${homePath}#systems`, label: t("systems"), isHash: true },
    { href: `/${locale}/writing`, label: t("writing") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  const isHome = pathname === homePath || pathname === `${homePath}/`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-canvas/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="page-inner flex h-14 items-center justify-between">
        <Link
          href={homePath}
          className="font-sans text-sm font-medium tracking-tight text-ink-primary transition-colors hover:text-accent"
        >
          AW
        </Link>

        <nav className="flex items-center gap-6">
          <ul className="hidden items-center gap-5 sm:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                {item.isHash && !isHome ? (
                  <button
                    onClick={() => {
                      window.location.href = item.href;
                    }}
                    className="text-sm text-ink-secondary transition-colors hover:text-ink-primary"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm text-ink-secondary transition-colors hover:text-ink-primary"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <button
                onClick={openAbout}
                className="text-sm text-ink-secondary transition-colors hover:text-ink-primary"
              >
                {t("about")}
              </button>
            </li>
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
