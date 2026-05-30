"use client";

import { useTheme } from "./theme-provider";
import { useTranslations } from "next-intl";

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type ThemeToggleProps = {
  nav?: boolean;
};

export function ThemeToggle({ nav = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("Theme");
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      title={isDark ? t("switchToLight") : t("switchToDark")}
      className={
        nav
          ? "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent text-syn-ink-subtle transition-colors hover:border-syn-border hover:bg-syn-surface hover:text-syn-ink"
          : "inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-canvas-elevated hover:text-ink-primary"
      }
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
