/** Shared theme chrome for Lab Precision pages (root routes). */
import { syncThemeToggle, toggleTheme } from "@/scripts/theme";

export function syncLocaleLinks(): void {
  const hash = window.location.hash;
  document.querySelectorAll<HTMLAnchorElement>("[data-locale-link]").forEach((el) => {
    const base = el.getAttribute("data-locale-link") ?? "";
    el.href = base + hash;
  });
}

export function initLabPrecisionChrome(): void {
  const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement | null;

  syncThemeToggle(themeToggle);
  syncLocaleLinks();

  window.addEventListener("hashchange", syncLocaleLinks);

  themeToggle?.addEventListener("click", () => {
    toggleTheme();
    syncThemeToggle(themeToggle);
  });
}
