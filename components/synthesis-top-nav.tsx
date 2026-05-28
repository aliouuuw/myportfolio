"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { useCommandPalette } from "@/components/command-palette-provider";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { key: "work" as const, matchPath: "work", href: (l: string) => `/${l}/work` },
  {
    key: "writing" as const,
    matchPath: "writing",
    href: (l: string) => `/${l}/writing`,
  },
  {
    key: "contact" as const,
    href: (l: string) => `/${l}#connect`,
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
            const active =
              "matchPath" in item ? isLinkActive(item.matchPath) : false;
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

          <span
            className="ml-1 inline-flex items-center gap-2 rounded-full border border-syn-border bg-syn-surface px-3 py-1.5 text-xs font-medium text-syn-ink-muted"
            title={t("available")}
          >
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500 text-emerald-500" />
            <span className="hidden sm:inline">{t("available")}</span>
            <span className="sm:hidden">{t("availableShort")}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
