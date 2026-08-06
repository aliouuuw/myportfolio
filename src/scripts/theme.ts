/** Unified theme management — single localStorage key for all pages. */
const THEME_KEY = "portfolio-theme";
const LEGACY_THEME_KEY = "operator-board-theme";

export type Theme = "light" | "dark";

/** Read stored theme, defaulting to light. Migrates legacy board key once. */
export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY) ?? localStorage.getItem(LEGACY_THEME_KEY);
    if (stored === "dark" || stored === "light") {
      if (!localStorage.getItem(THEME_KEY)) {
        localStorage.setItem(THEME_KEY, stored);
      }
      return stored;
    }
  } catch {
    /* ignore */
  }
  return "light";
}

/** Apply theme to document root. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

/** Initialize theme from localStorage (call inline in <head> to avoid flash). */
export function initTheme(): void {
  applyTheme(getStoredTheme());
}

/** Toggle theme and persist. */
export function toggleTheme(): Theme {
  const next = getStoredTheme() === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* ignore */
  }
  applyTheme(next);
  return next;
}

/** Get current theme from DOM. */
export function getCurrentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/** Sync theme toggle button ARIA attributes. */
export function syncThemeToggle(button: HTMLButtonElement | null): void {
  if (!button) return;
  const isDark = getCurrentTheme() === "dark";
  const isFr = document.documentElement.lang?.toLowerCase().startsWith("fr");
  button.setAttribute("aria-pressed", String(isDark));
  if (isFr) {
    button.setAttribute(
      "aria-label",
      isDark ? "Passer en mode clair" : "Passer en mode sombre",
    );
  } else {
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
}
