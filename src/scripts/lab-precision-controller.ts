/** Lab Precision Controller — single interface for view + preview management. */
import { syncLocaleLinks } from "@/scripts/lab-precision-chrome";

export type LabView = "work" | "background";

export interface LabPrecisionConfig {
  /** Root selector for the preview dialog */
  previewSelector?: string;
  /** Selector for preview video element */
  previewVideoSelector?: string;
  /** Selector for empty preview fallback */
  previewEmptySelector?: string;
  /** Selector for empty preview name element */
  previewEmptyNameSelector?: string;
  /** Selector for preview caption element */
  previewCapSelector?: string;
  /** Selector for roster rows */
  rowSelector?: string;
  /** Media root path for preview videos */
  mediaRoot?: string;
  /** Called when view switches to background */
  onBackground?: () => void;
  /** Called when view switches to work */
  onWork?: () => void;
}

export interface LabPrecisionController {
  /** Current view */
  getView(): LabView;
  /** Switch view */
  setView(view: LabView): void;
  /** Subscribe to view changes */
  onViewChange(cb: (view: LabView) => void): () => void;
  /** Register a preview row */
  registerPreviewRow(row: HTMLElement): void;
  /** Unregister a preview row */
  unregisterPreviewRow(row: HTMLElement): void;
  /** Show preview for a row */
  showPreview(row: HTMLElement): void;
  /** Hide preview */
  hidePreview(): void;
  /** Destroy controller and clean up */
  destroy(): void;
}

function createPreviewManager(config: Required<LabPrecisionConfig>) {
  const preview = document.querySelector<HTMLElement>(config.previewSelector);
  const previewVideo = document.querySelector<HTMLVideoElement>(config.previewVideoSelector);
  const previewEmpty = document.querySelector<HTMLElement>(config.previewEmptySelector);
  const previewEmptyName = document.querySelector<HTMLElement>(config.previewEmptyNameSelector);
  const previewCap = document.querySelector<HTMLElement>(config.previewCapSelector);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = window.matchMedia("(hover: none), (pointer: coarse)");

  let activeName = "";
  const registeredRows = new Set<HTMLElement>();

  function showPreview(row: HTMLElement) {
    if (document.body.classList.contains("is-background")) return;
    if (!preview || !previewVideo || !previewEmpty || !previewCap) return;

    const name = row.getAttribute("data-name") ?? "";
    const has = row.getAttribute("data-has-media") === "true";
    const surface = row.getAttribute("data-media") || "";
    const caption = row.getAttribute("data-caption") || name;

    activeName = name;
    previewCap.textContent = caption;
    previewVideo.pause();
    previewVideo.removeAttribute("src");
    previewVideo.load();
    previewVideo.hidden = true;
    previewEmpty.hidden = true;

    if (has && surface) {
      previewVideo.hidden = false;
      previewVideo.poster = `${config.mediaRoot}/${surface}.jpg`;
      previewVideo.src = `${config.mediaRoot}/${surface}.mp4`;
      if (!reduceMotion.matches) {
        void previewVideo.play().catch(() => {});
      }
    } else {
      previewEmpty.hidden = false;
      if (previewEmptyName) previewEmptyName.textContent = name;
    }

    preview.hidden = false;
    preview.dataset.active = "true";
    requestAnimationFrame(() => {
      preview?.classList.add("is-open");
    });
    row.classList.add("is-peek");
    registeredRows.forEach((r) => {
      if (r !== row) r.classList.remove("is-peek");
    });
  }

  function hidePreview() {
    if (!preview || !previewVideo) return;
    preview.classList.remove("is-open");
    preview.dataset.active = "false";
    activeName = "";
    previewVideo.pause();
    previewVideo.removeAttribute("src");
    previewVideo.load();
    registeredRows.forEach((r) => r.classList.remove("is-peek"));
    window.setTimeout(
      () => {
        if (preview.dataset.active === "true") return;
        preview.hidden = true;
      },
      reduceMotion.matches ? 0 : 200,
    );
  }

  function attachRowListeners(row: HTMLElement) {
    const peekable = row.classList.contains("lp-row--peekable");

    const onPointerEnter = (e: PointerEvent) => {
      if (!peekable || coarse.matches) return;
      if (e.pointerType === "touch") return;
      showPreview(row);
    };

    const onPointerLeave = () => {
      if (!peekable || coarse.matches) return;
      hidePreview();
    };

    const onFocusIn = () => {
      if (!peekable) return;
      showPreview(row);
    };

    const onFocusOut = (e: FocusEvent) => {
      if (coarse.matches || !peekable) return;
      const next = e.relatedTarget;
      if (next && row.contains(next as Node)) return;
      hidePreview();
    };

    const onClick = (e: MouseEvent) => {
      if (!coarse.matches || !peekable) return;
      const open = preview?.dataset.active === "true" && !preview.hidden;
      const same = activeName === (row.getAttribute("data-name") ?? "");
      if (!open || !same) {
        e.preventDefault();
        showPreview(row);
      }
    };

    row.addEventListener("pointerenter", onPointerEnter);
    row.addEventListener("pointerleave", onPointerLeave);
    row.addEventListener("focusin", onFocusIn);
    row.addEventListener("focusout", onFocusOut);
    row.addEventListener("click", onClick);

    return () => {
      row.removeEventListener("pointerenter", onPointerEnter);
      row.removeEventListener("pointerleave", onPointerLeave);
      row.removeEventListener("focusin", onFocusIn);
      row.removeEventListener("focusout", onFocusOut);
      row.removeEventListener("click", onClick);
    };
  }

  return {
    showPreview,
    hidePreview,
    attachRowListeners,
    registerRow(row: HTMLElement) {
      registeredRows.add(row);
      return attachRowListeners(row);
    },
    unregisterRow(row: HTMLElement) {
      registeredRows.delete(row);
      row.classList.remove("is-peek");
    },
  };
}

function createViewManager(config: Required<LabPrecisionConfig>) {
  const root = document.body;
  const foreground = document.getElementById("lp-foreground");
  const background = document.getElementById("lp-background");
  const workNav = document.querySelector<HTMLElement>("[data-view-mode='work']");
  const backgroundNav = document.querySelector<HTMLElement>("[data-view-mode='background']");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const viewChangeCallbacks = new Set<(view: LabView) => void>();

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
    if (getView() === next) return;

    root.classList.toggle("is-background", next === "background");
    root.dataset.view = next;
    syncNav(next);
    syncA11y(next);
    syncHash(next);

    if (next === "background") {
      config.onBackground?.();
      const scrollEl = background?.querySelector(".lp-background-scroll");
      scrollEl?.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    } else {
      config.onWork?.();
    }

    viewChangeCallbacks.forEach((cb) => cb(next));
  };

  const onViewTriggerClick = (e: Event) => {
    const el = e.currentTarget as HTMLElement;
    const mode = el.getAttribute("data-view-trigger");
    if (mode !== "work" && mode !== "background") return;
    e.preventDefault();
    setView(mode);
  };

  const onHashChange = () => {
    if (window.location.hash === "#background") {
      setView("background");
    } else {
      setView("work");
    }
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && getView() === "background") {
      setView("work");
    }
  };

  document.querySelectorAll("[data-view-trigger]").forEach((el) => {
    el.addEventListener("click", onViewTriggerClick);
  });
  window.addEventListener("hashchange", onHashChange);
  document.addEventListener("keydown", onKeydown);

  // Initial view from hash
  if (window.location.hash === "#background") {
    setView("background");
  } else {
    setView("work");
  }

  return {
    getView,
    setView,
    onViewChange(cb: (view: LabView) => void) {
      viewChangeCallbacks.add(cb);
      return () => viewChangeCallbacks.delete(cb);
    },
    destroy() {
      document.querySelectorAll("[data-view-trigger]").forEach((el) => {
        el.removeEventListener("click", onViewTriggerClick);
      });
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("keydown", onKeydown);
      viewChangeCallbacks.clear();
    },
  };
}

function createRevealObserver() {
  const reduceReveal = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceReveal.matches) {
    document.querySelectorAll(".lp-reveal").forEach((el) => el.classList.add("is-visible"));
    return () => {};
  }

  const revealEls = document.querySelectorAll<HTMLElement>(".lp-reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  revealEls.forEach((el) => io.observe(el));

  return () => io.disconnect();
}

export function createLabPrecisionController(userConfig: LabPrecisionConfig = {}): LabPrecisionController {
  const config: Required<LabPrecisionConfig> = {
    previewSelector: userConfig.previewSelector ?? "#lp-preview",
    previewVideoSelector: userConfig.previewVideoSelector ?? "#lp-preview-video",
    previewEmptySelector: userConfig.previewEmptySelector ?? "#lp-preview-empty",
    previewEmptyNameSelector: userConfig.previewEmptyNameSelector ?? "#lp-preview-empty-name",
    previewCapSelector: userConfig.previewCapSelector ?? "#lp-preview-cap",
    rowSelector: userConfig.rowSelector ?? ".lp-row",
    mediaRoot: userConfig.mediaRoot ?? "/media/case-studies/everest-finance",
    onBackground: userConfig.onBackground ?? (() => {}),
    onWork: userConfig.onWork ?? (() => {}),
  };

  const previewManager = createPreviewManager(config);
  const viewManager = createViewManager(config);
  const cleanupReveal = createRevealObserver();

  // Auto-register existing rows
  const rows = document.querySelectorAll<HTMLElement>(config.rowSelector);
  const rowCleanups = new Map<HTMLElement, () => void>();
  rows.forEach((row) => {
    rowCleanups.set(row, previewManager.registerRow(row));
  });

  // Global preview hide handlers
  const onEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && !document.body.classList.contains("is-background")) {
      previewManager.hidePreview();
    }
  };
  const onPointerDown = (e: PointerEvent) => {
    if (!previewManager) return;
    const preview = document.querySelector<HTMLElement>(config.previewSelector);
    if (!preview || preview.hidden) return;
    const target = e.target as Node & { closest?: (s: string) => Element | null };
    if (preview.contains(target)) return;
    if (typeof target.closest === "function" && target.closest(config.rowSelector)) return;
    previewManager.hidePreview();
  };

  document.addEventListener("keydown", onEscape);
  document.addEventListener("pointerdown", onPointerDown);

  return {
    getView: viewManager.getView,
    setView: viewManager.setView,
    onViewChange(cb: (view: LabView) => void) {
      return viewManager.onViewChange(cb);
    },
    registerPreviewRow(row: HTMLElement) {
      if (!rowCleanups.has(row)) {
        rowCleanups.set(row, previewManager.registerRow(row));
      }
    },
    unregisterPreviewRow(row: HTMLElement) {
      const cleanup = rowCleanups.get(row);
      if (cleanup) {
        cleanup();
        rowCleanups.delete(row);
      }
      previewManager.unregisterRow(row);
    },
    showPreview: previewManager.showPreview,
    hidePreview: previewManager.hidePreview,
    destroy() {
      rowCleanups.forEach((cleanup) => cleanup());
      rowCleanups.clear();
      viewManager.destroy();
      cleanupReveal();
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("pointerdown", onPointerDown);
    },
  };
}
