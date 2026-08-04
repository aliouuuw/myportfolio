/** Shared theme chrome for /lab/precision pages. */
export function syncLocaleLinks(): void {
  const hash = window.location.hash;
  document.querySelectorAll<HTMLAnchorElement>("[data-locale-link]").forEach((el) => {
    const base = el.getAttribute("data-locale-link") ?? "";
    el.href = base + hash;
  });
}

export function initLabPrecisionChrome(): void {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  const syncThemeControl = () => {
    if (!themeToggle) return;
    const isDark = root.getAttribute("data-theme") === "dark";
    themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );
  };

  syncThemeControl();
  syncLocaleLinks();

  window.addEventListener("hashchange", syncLocaleLinks);

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("lab-precision-theme", next);
    } catch {
      /* ignore */
    }
    syncThemeControl();
  });
}
