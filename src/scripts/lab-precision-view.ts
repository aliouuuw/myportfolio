import { syncLocaleLinks } from "@/scripts/lab-precision-chrome";

type LabView = "work" | "background";

export function initLabPrecisionView(options?: { onBackground?: () => void; onWork?: () => void }): {
  setView: (view: LabView) => void;
  getView: () => LabView;
} {
  const root = document.body;
  const foreground = document.getElementById("lp-foreground");
  const background = document.getElementById("lp-background");
  const workNav = document.querySelector<HTMLElement>("[data-view-mode='work']");
  const backgroundNav = document.querySelector<HTMLElement>("[data-view-mode='background']");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const syncNav = (view: LabView) => {
    const workActive = view === "work";
    if (workNav) {
      workNav.classList.toggle("is-active", workActive);
      workNav.setAttribute("aria-current", workActive ? "page" : "false");
    }
    if (backgroundNav) {
      backgroundNav.classList.toggle("is-active", !workActive);
      backgroundNav.setAttribute("aria-current", workActive ? "false" : "page");
    }
  };

  const syncA11y = (view: LabView) => {
    if (foreground) {
      foreground.toggleAttribute("inert", view === "background");
      foreground.setAttribute("aria-hidden", view === "background" ? "true" : "false");
    }
    if (background) {
      background.setAttribute("aria-hidden", view === "work" ? "true" : "false");
      if (view === "background") {
        background.removeAttribute("inert");
      } else {
        background.setAttribute("inert", "");
      }
    }
  };

  const syncHash = (view: LabView) => {
    const path = window.location.pathname;
    if (view === "background") {
      if (window.location.hash !== "#background") {
        history.replaceState(null, "", `${path}#background`);
      }
    } else if (window.location.hash) {
      history.replaceState(null, "", path);
    }
    syncLocaleLinks();
  };

  const getView = (): LabView =>
    root.classList.contains("is-background") ? "background" : "work";

  const setView = (view: LabView) => {
    const next = view === "background" ? "background" : "work";
    root.classList.toggle("is-background", next === "background");
    root.dataset.view = next;
    syncNav(next);
    syncA11y(next);
    syncHash(next);

    if (next === "background") {
      options?.onBackground?.();
      const scrollEl = background?.querySelector(".lp-background-scroll");
      scrollEl?.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    } else {
      options?.onWork?.();
    }
  };

  document.querySelectorAll("[data-view-trigger]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const mode = el.getAttribute("data-view-trigger");
      if (mode !== "work" && mode !== "background") return;
      e.preventDefault();
      setView(mode);
    });
  });

  if (window.location.hash === "#background") {
    setView("background");
  } else {
    setView("work");
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#background") {
      setView("background");
    } else {
      setView("work");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && getView() === "background") {
      setView("work");
    }
  });

  return { setView, getView };
}
