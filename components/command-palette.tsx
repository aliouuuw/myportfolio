"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Command } from "cmdk";

import { useAbout } from "@/components/about-provider";
import { useTheme } from "@/components/theme-provider";
import { FEATURED_WORK_SLUGS } from "@/lib/work-ledger-types";

export function CommandPalette() {
  const t = useTranslations("CommandPalette");
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { openAbout } = useAbout();

  const [open, setOpen] = useState(false);

  const locale = pathname.split("/")[1] || "en";
  const isEnglish = locale === "en";

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

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
    },
    [router]
  );

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("wadealiou00@gmail.com");
    setOpen(false);
  }, []);

  const handleToggleTheme = useCallback(() => {
    toggleTheme();
    setOpen(false);
  }, [toggleTheme]);

  const switchLocale = useCallback(() => {
    const newLocale = isEnglish ? "fr" : "en";
    const rest = pathname.split("/").slice(2).join("/");
    const newPath = `/${newLocale}${rest ? `/${rest}` : ""}`;
    router.push(newPath);
    setOpen(false);
  }, [pathname, isEnglish, router]);

  const handleOpenAbout = useCallback(() => {
    openAbout();
    setOpen(false);
  }, [openAbout]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-canvas/70 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="fixed left-1/2 top-[20%] w-full max-w-lg -translate-x-1/2 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Command
          className="overflow-hidden rounded-xl border border-border bg-canvas shadow-2xl"
          loop
        >
          <div className="border-b border-border">
            <Command.Input
              placeholder={t("placeholder")}
              className="w-full bg-transparent px-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none"
              autoFocus
            />
          </div>

          <Command.List className="max-h-[60vh] overflow-auto py-2">
            <Command.Empty className="px-4 py-3 text-sm text-ink-tertiary">
              {t("noResults")}
            </Command.Empty>

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
                onSelect={handleOpenAbout}
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
              {FEATURED_WORK_SLUGS.map((slug) => (
                <CommandItem
                  key={slug}
                  onSelect={() => navigate(`/${locale}/work/${slug}`)}
                  label={slug.replace(/-/g, " ")}
                />
              ))}
            </Command.Group>

            <Command.Group heading={t("preferences")} className="px-2 mt-2">
              <CommandItem
                onSelect={switchLocale}
                label={isEnglish ? t("switchToFr") : t("switchToEn")}
              />
              <CommandItem
                onSelect={handleToggleTheme}
                label={theme === "dark" ? t("switchToLight") : t("switchToDark")}
              />
            </Command.Group>

            <Command.Group heading={t("actions")} className="px-2 mt-2">
              <CommandItem onSelect={copyEmail} label={t("copyEmail")} />
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-ink-tertiary">
            <span>{t("navigateHint")}</span>
            <span>↵ {t("selectHint")}</span>
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
      className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-ink-secondary transition-colors hover:bg-canvas-elevated hover:text-ink-primary data-[selected=true]:bg-canvas-elevated data-[selected=true]:text-ink-primary"
    >
      <span>{label}</span>
      {shortcut && (
        <kbd className="rounded bg-canvas-metal px-1.5 py-0.5 font-mono text-[10px] text-ink-tertiary">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}
