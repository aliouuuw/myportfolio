/** Shared theme chrome for Lab Precision pages (root routes). */
import { applyTheme, getStoredTheme, syncThemeToggle, toggleTheme } from "@/scripts/theme";

const NAV_SCROLL_THRESHOLD_PX = 10;

export function syncLocaleLinks(): void {
  const hash = window.location.hash;
  document.querySelectorAll<HTMLAnchorElement>("[data-locale-link]").forEach((el) => {
    const base = el.getAttribute("data-locale-link") ?? "";
    el.href = base + hash;
  });
}

/** Frost sticky nav only after the active surface has scrolled. */
function initNavScrollScrim(): void {
  const shell = document.querySelector<HTMLElement>(".lp-nav-shell");
  if (!shell) return;

  const bgScroll = document.querySelector<HTMLElement>(".lp-background-scroll");

  const update = () => {
    const onBackground = document.body.classList.contains("is-background");
    const y = onBackground
      ? (bgScroll?.scrollTop ?? 0)
      : (window.scrollY || document.documentElement.scrollTop);
    shell.classList.toggle("is-scrolled", y > NAV_SCROLL_THRESHOLD_PX);
  };

  window.addEventListener("scroll", update, { passive: true });
  bgScroll?.addEventListener("scroll", update, { passive: true });

  const mo = new MutationObserver(update);
  mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  update();
}

const NOTICE_STORAGE_KEY = "lp-update-notice";

function initUpdateNotice(): void {
  const notice = document.querySelector<HTMLElement>("[data-update-notice]");
  const dismiss = document.querySelector<HTMLButtonElement>("[data-update-notice-dismiss]");
  if (!notice || !dismiss) return;

  dismiss.addEventListener("click", () => {
    notice.hidden = true;
    try {
      sessionStorage.setItem(NOTICE_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  });
}

export function initLabPrecisionChrome(): void {
  const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement | null;

  applyTheme(getStoredTheme());
  syncThemeToggle(themeToggle);
  syncLocaleLinks();
  initNavScrollScrim();
  initUpdateNotice();

  window.addEventListener("hashchange", syncLocaleLinks);

  themeToggle?.addEventListener("click", () => {
    toggleTheme();
    syncThemeToggle(themeToggle);
  });
}
