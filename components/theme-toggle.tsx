"use client";

import { useTheme } from "./theme-provider";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("Theme");

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="font-mono text-[11px] font-medium uppercase tracking-tight text-ink-tertiary transition-colors duration-200 hover:text-ink-primary"
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      title={isDark ? t("switchToLight") : t("switchToDark")}
    >
      <span className={isDark ? "text-ink-primary" : "text-ink-tertiary"}>DK</span>
      <span className="mx-0.5 text-ink-muted">/</span>
      <span className={!isDark ? "text-ink-primary" : "text-ink-tertiary"}>LN</span>
    </button>
  );
}
