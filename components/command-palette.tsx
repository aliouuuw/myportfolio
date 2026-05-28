"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Command } from "cmdk";

import { useCommandPalette } from "@/components/command-palette-provider";
import { useTheme } from "@/components/theme-provider";
import { SYNTHESIS_EMAIL } from "@/lib/synthesis-data";
import {
  getLocaleFromPathname,
  isSynthesisHomePath,
} from "@/lib/synthesis-routes";
import {
  FEATURED_WORK_SLUGS,
  type FeaturedWorkSlug,
} from "@/lib/work-ledger-types";
import { featuredWorkIndexId } from "@/lib/synthesis-work-index";

const HOME_SECTIONS = [
  { id: "work", key: "jumpWork" as const },
  { id: "worked-with", key: "jumpTeams" as const },
  { id: "approach", key: "jumpApproach" as const },
  { id: "connect", key: "jumpConnect" as const },
] as const;

export function CommandPalette() {
  const t = useTranslations("CommandPalette");
  const tTheme = useTranslations("Theme");
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { open, setOpen, toggle, copyToast, showCopyToast } = useCommandPalette();

  const locale = getLocaleFromPathname(pathname);
  const isEnglish = locale === "en";
  const isHome = isSynthesisHomePath(pathname, locale);
  const isDark = theme === "dark";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, setOpen]);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      close();
    },
    [router, close],
  );

  const jumpToSection = useCallback(
    (sectionId: string) => {
      if (isHome) {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        router.push(`/${locale}#${sectionId}`);
      }
      close();
    },
    [isHome, locale, router, close],
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SYNTHESIS_EMAIL);
      showCopyToast();
    } catch {
      window.location.href = `mailto:${SYNTHESIS_EMAIL}`;
    }
    close();
  }, [close, showCopyToast]);

  if (!open) {
    return copyToast ? <CopyToast message={t("copied")} /> : null;
  }

  const panelClass = isDark
    ? "overflow-hidden rounded-2xl border border-syn-border-strong bg-syn-surface shadow-2xl"
    : "overflow-hidden rounded-lg border border-border bg-canvas shadow-2xl";

  const inputClass = isDark
    ? "w-full bg-transparent px-4 py-3.5 text-sm text-syn-ink outline-none placeholder:text-syn-ink-subtle"
    : "w-full bg-transparent px-4 py-3 text-sm text-ink-primary outline-none placeholder:text-ink-tertiary";

  const groupHeadingStyles = isDark
    ? "[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-syn-ink-subtle"
    : "[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-ink-tertiary";

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[16vh] ${
          isDark ? "bg-black/70 backdrop-blur-sm" : "bg-canvas/80 backdrop-blur-sm"
        }`}
        role="dialog"
        aria-modal
        aria-label={t("dialogLabel")}
      >
        <button
          type="button"
          className="absolute inset-0"
          onClick={close}
          aria-label={t("close")}
        />
        <div
          className={`relative w-full max-w-lg ${panelClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          {isDark ? (
            <p className="mono border-b border-syn-border px-4 py-3 text-[10px] uppercase tracking-widest text-syn-ink-subtle">
              ⌘K · {t("synthesisEyebrow")}
            </p>
          ) : null}

          <Command loop className={`bg-transparent ${groupHeadingStyles}`}>
            <div className={isDark ? "border-b border-syn-border" : "border-b border-border"}>
              <Command.Input
                placeholder={t("placeholder")}
                className={inputClass}
                autoFocus
              />
            </div>

            <Command.List className="max-h-[min(60vh,420px)] overflow-auto py-2">
              <Command.Empty
                className={`px-4 py-3 text-sm ${isDark ? "text-syn-ink-subtle" : "text-ink-tertiary"}`}
              >
                {t("noResults")}
              </Command.Empty>

              {isHome ? (
                <Command.Group heading={t("sections")} className="px-2">
                  {HOME_SECTIONS.map((section) => (
                    <PaletteItem
                      key={section.id}
                      dark={isDark}
                      onSelect={() => jumpToSection(section.id)}
                      label={t(section.key)}
                    />
                  ))}
                </Command.Group>
              ) : null}

              <Command.Group
                heading={t("navigate")}
                className={`px-2 ${isHome ? "mt-2" : ""}`}
              >
                <PaletteItem
                  dark={isDark}
                  onSelect={() => navigate(`/${locale}`)}
                  label={t("home")}
                />
                <PaletteItem
                  dark={isDark}
                  onSelect={() => navigate(`/${locale}/work`)}
                  label={t("work")}
                />
                <PaletteItem
                  dark={isDark}
                  onSelect={() => navigate(`/${locale}/writing`)}
                  label={t("writing")}
                />
                <PaletteItem
                  dark={isDark}
                  onSelect={() => jumpToSection("connect")}
                  label={t("contact")}
                />
              </Command.Group>

              <Command.Group heading={t("caseStudies")} className="mt-2 px-2">
                {FEATURED_WORK_SLUGS.map((slug) => (
                  <CaseStudyPaletteItem
                    key={slug}
                    slug={slug}
                    dark={isDark}
                    onSelect={() => navigate(`/${locale}/work/${slug}`)}
                  />
                ))}
              </Command.Group>

              <Command.Group heading={t("actions")} className="mt-2 px-2">
                <PaletteItem
                  dark={isDark}
                  onSelect={copyEmail}
                  label={t("copyEmail")}
                />
                <PaletteItem
                  dark={isDark}
                  onSelect={() => {
                    window.open("https://wa.me/221777228845", "_blank");
                    close();
                  }}
                  label={t("openWhatsApp")}
                />
              </Command.Group>

              <Command.Group heading={t("preferences")} className="mt-2 px-2">
                <PaletteItem
                  dark={isDark}
                  onSelect={() => {
                    router.push(
                      isEnglish ? pathname.replace(/^\/en/, "/fr") : pathname.replace(/^\/fr/, "/en"),
                    );
                    close();
                  }}
                  label={isEnglish ? t("switchToFr") : t("switchToEn")}
                />
                <PaletteItem
                  dark={isDark}
                  onSelect={() => {
                    toggleTheme();
                    close();
                  }}
                  label={
                    theme === "dark"
                      ? tTheme("switchToLight")
                      : tTheme("switchToDark")
                  }
                />
              </Command.Group>
            </Command.List>

            <div
              className={`flex items-center justify-between border-t px-4 py-2 text-xs ${
                isDark
                  ? "border-syn-border text-syn-ink-subtle"
                  : "border-border text-ink-tertiary"
              }`}
            >
              <span>{t("navigateHint")}</span>
              <span>{t("selectHint")}</span>
            </div>
          </Command>
        </div>
      </div>

      {copyToast ? <CopyToast message={t("copied")} /> : null}
    </>
  );
}

function CopyToast({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full border border-emerald-500/30 bg-syn-surface px-4 py-2 mono text-xs text-emerald-400"
    >
      {message}
    </div>
  );
}

function CaseStudyPaletteItem({
  slug,
  dark,
  onSelect,
}: {
  slug: FeaturedWorkSlug;
  dark: boolean;
  onSelect: () => void;
}) {
  const tRow = useTranslations(
    `HomePage.synthesis.work.rows.${featuredWorkIndexId(slug)}`,
  );

  return (
    <PaletteItem dark={dark} onSelect={onSelect} label={tRow("name")} />
  );
}

function PaletteItem({
  onSelect,
  label,
  dark,
}: {
  onSelect: () => void;
  label: string;
  dark: boolean;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={
        dark
          ? "mx-1 flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm text-syn-ink-muted outline-none data-[selected=true]:bg-syn-row-hover data-[selected=true]:text-syn-ink"
          : "flex cursor-pointer items-center rounded px-3 py-2 text-sm text-ink-secondary outline-none data-[selected=true]:bg-canvas-elevated data-[selected=true]:text-ink-primary"
      }
    >
      {label}
    </Command.Item>
  );
}
