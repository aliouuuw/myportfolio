"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Command } from "cmdk";
import { useAbout } from "@/components/about-provider";
import { useTheme } from "./theme-provider";

export function CommandPalette() {
  const t = useTranslations("CommandPalette");
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { openAbout } = useAbout();

  const [open, setOpen] = useState(false);

  const locale = pathname.split("/")[1] || "en";
  const isEnglish = locale === "en";

  // Toggle palette with ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle navigation
  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
    },
    [router]
  );

  // Handle copy email
  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("wadealiou00@gmail.com");
    setOpen(false);
  }, []);

  // Handle theme toggle
  const handleToggleTheme = useCallback(() => {
    toggleTheme();
    setOpen(false);
  }, [toggleTheme]);

  // Handle locale switch
  const switchLocale = useCallback(() => {
    const newLocale = isEnglish ? "fr" : "en";
    const rest = pathname.split("/").slice(2).join("/");
    const newPath = `/${newLocale}${rest ? `/${rest}` : ""}`;
    router.push(newPath);
    setOpen(false);
  }, [pathname, isEnglish, router]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-canvas/80 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      aria-hidden="true"
    >
      <div
        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Command
          className="bg-canvas border border-border rounded-lg shadow-2xl overflow-hidden"
          loop
        >
          {/* Search input with hairline focus */}
          <div className="border-b border-border">
            <Command.Input
              placeholder={t("placeholder")}
              className="w-full px-4 py-3 bg-transparent text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:ring-0"
              autoFocus
            />
          </div>

          {/* Command groups */}
          <Command.List className="max-h-[60vh] overflow-auto py-2">
            <Command.Empty className="px-4 py-3 text-sm text-ink-tertiary">
              {t("noResults")}
            </Command.Empty>

            {/* Navigate group */}
            <Command.Group heading={t("navigate")} className="px-2">
              <CommandItem
                onSelect={() => navigate(`/${locale}/work`)}
                label={t("work")}
                shortcut="W"
              />
              <CommandItem
                onSelect={() => navigate(`/${locale}/writing`)}
                label={t("writing")}
                shortcut="R"
              />
              <CommandItem
                onSelect={() => {
                  openAbout();
                  setOpen(false);
                }}
                label={t("about")}
                shortcut="A"
              />
              <CommandItem
                onSelect={() => navigate(`/${locale}/contact`)}
                label={t("contact")}
                shortcut="C"
              />
            </Command.Group>

            <Command.Group heading={t("caseStudies")} className="px-2 mt-2">
              <CommandItem
                onSelect={() => navigate(`/${locale}/work/everest-finance`)}
                label={t("caseEverest")}
              />
              <CommandItem
                onSelect={() => navigate(`/${locale}/work/odoo-testing-toolkit`)}
                label={t("caseOdoo")}
              />
              <CommandItem
                onSelect={() => navigate(`/${locale}/work/bocalbun-retrospective`)}
                label={t("caseBocalbun")}
              />
            </Command.Group>

            {/* Preferences group */}
            <Command.Group heading={t("preferences")} className="px-2 mt-2">
              <CommandItem
                onSelect={switchLocale}
                label={isEnglish ? t("switchToFr") : t("switchToEn")}
                shortcut="L"
              />
              <CommandItem
                onSelect={handleToggleTheme}
                label={theme === "dark" ? t("switchToLight") : t("switchToDark")}
                shortcut="D"
              />
            </Command.Group>

            {/* Actions group */}
            <Command.Group heading={t("actions")} className="px-2 mt-2">
              <CommandItem
                onSelect={copyEmail}
                label={t("copyEmail")}
                shortcut="E"
              />
            </Command.Group>
          </Command.List>

          {/* Footer hint */}
          <div className="border-t border-border px-4 py-2 text-xs text-ink-tertiary flex items-center justify-between">
            <span>{t("navigateHint")}</span>
            <span>{t("selectHint")}</span>
          </div>
        </Command>
      </div>
    </div>
  );
}

interface CommandItemProps {
  onSelect: () => void;
  label: string;
  shortcut?: string;
}

function CommandItem({ onSelect, label, shortcut }: CommandItemProps) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center justify-between px-3 py-2 text-sm text-ink-secondary rounded cursor-pointer data-[selected=true]:bg-canvas-elevated data-[selected=true]:text-ink-primary outline-none"
    >
      <span>{label}</span>
      {shortcut && (
        <kbd className="font-mono text-[10px] text-ink-tertiary bg-canvas-subtle px-1.5 py-0.5 rounded">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}
