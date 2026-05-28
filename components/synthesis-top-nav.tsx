"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { useAbout } from "@/components/about-provider";
import { useCommandPalette } from "@/components/command-palette-provider";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

type NavItem =
  | {
      kind: "link";
      key: "work" | "writing" | "contact";
      matchPath: string;
      href: (locale: string) => string;
    }
  | { kind: "about"; key: "about" };

const NAV_ITEMS: readonly NavItem[] = [
  {
    kind: "link",
    key: "work",
    matchPath: "work",
    href: (locale) => `/${locale}/work`,
  },
  {
    kind: "link",
    key: "writing",
    matchPath: "writing",
    href: (locale) => `/${locale}/writing`,
  },
  { kind: "about", key: "about" },
  {
    kind: "link",
    key: "contact",
    matchPath: "contact",
    href: (locale) => `/${locale}/contact`,
  },
] as const;

type SynthesisTopNavProps = {
  locale: string;
  pathname: string;
};

export function SynthesisTopNav({ locale, pathname }: SynthesisTopNavProps) {
  const t = useTranslations("HomePage.synthesis.nav");
  const tNav = useTranslations("Nav");
  const { toggle } = useCommandPalette();
  const { openAbout } = useAbout();

  const homePath = `/${locale}`;

  const pillActive = "bg-syn-surface text-syn-ink";
  const pillIdle =
    "text-syn-ink-muted hover:bg-syn-surface/60 hover:text-syn-ink";

  const isLinkActive = (matchPath: string) => {
    const base = `/${locale}/${matchPath}`;
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <header className="site-header sticky top-0 z-50 border-b border-syn-border bg-syn-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3.5 md:px-6 lg:px-8 xl:pr-8">
        <Link
          href={homePath}
          className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
          aria-label={tNav("brandAriaLabel")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-syn-border bg-syn-surface text-sm font-medium text-syn-ink">
            A
          </div>
          <span className="truncate text-sm font-medium text-syn-ink">
            {tNav("brand")}
          </span>
          <span className="mono-eyebrow ml-0.5 hidden sm:inline">
            {t("role")}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            if (item.kind === "about") {
              return (
                <button
                  key="about"
                  type="button"
                  onClick={openAbout}
                  className={`hidden md:inline-flex rounded-full px-3 py-1.5 text-xs transition-colors ${pillIdle}`}
                >
                  {tNav(item.key)}
                </button>
              );
            }

            const active = isLinkActive(item.matchPath);
            return (
              <Link
                key={item.key}
                href={item.href(locale)}
                className={`hidden md:inline-flex rounded-full px-3 py-1.5 text-xs transition-colors ${
                  active ? pillActive : pillIdle
                }`}
                aria-current={active ? "page" : undefined}
              >
                {tNav(item.key)}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={toggle}
            className="mono hidden px-2 py-1 text-[10px] text-syn-ink-subtle transition-colors hover:text-syn-ink-muted md:inline-flex"
            aria-label={t("openCommand")}
          >
            ⌘K
          </button>

          <LocaleSwitcher locale={locale} nav />

          <ThemeToggle nav />

          <Link
            href={`/${locale}/contact`}
            className="ml-1 inline-flex items-center gap-2 rounded-full border border-syn-border bg-syn-surface px-3 py-1.5 text-xs font-medium text-syn-ink-muted transition-colors hover:text-syn-ink"
          >
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500 text-emerald-500" />
            <span className="hidden sm:inline">{t("available")}</span>
            <span className="sm:hidden">{t("availableShort")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
