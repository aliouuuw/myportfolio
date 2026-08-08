/** Engagement Console — responsive IA.
 *  Desktop (≥760px): master-detail (rail + dossier panel in flow); one selected.
 *  Mobile (<760px): accordion under each client; all closed by default.
 *  Dossiers teleport between item (mobile) and panel (desktop) so each layout
 *  keeps natural height — desktop panel grows with content.
 *  Supports arrow-key navigation, `#engagement-{slug}` deep links, and a
 *  highlighted (featured) roster filter.
 */
export function initEngagementConsole(): void {
  const root = document.getElementById("engagement-console");
  if (!root) return;

  const items = Array.from(root.querySelectorAll<HTMLElement>(".lp-console-item"));
  const caps = Array.from(root.querySelectorAll<HTMLButtonElement>(".lp-console-cap"));
  const panel = root.querySelector<HTMLElement>("[data-console-panel]");
  const filterBtns = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-roster-filter]"),
  );
  const hasFilter = filterBtns.some((btn) => btn.getAttribute("data-roster-filter") === "featured");
  if (caps.length === 0 || items.length === 0 || !panel) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const accordionQuery = window.matchMedia("(max-width: 759px)");

  const isAccordion = (): boolean => accordionQuery.matches;

  const dossierBySlug = (slug: string): HTMLElement | null =>
    root.querySelector<HTMLElement>(`#dossier-${CSS.escape(slug)}`);

  const itemBySlug = (slug: string): HTMLElement | undefined =>
    items.find((item) => item.getAttribute("data-eng") === slug);

  const isFeaturedOnly = (): boolean => root.classList.contains("is-filtered");

  const isItemVisible = (item: HTMLElement): boolean =>
    !item.hasAttribute("hidden") && item.getAttribute("data-filter-hidden") !== "true";

  const visibleItems = (): HTMLElement[] => items.filter(isItemVisible);

  const visibleCaps = (): HTMLButtonElement[] =>
    visibleItems()
      .map((item) => item.querySelector<HTMLButtonElement>(".lp-console-cap"))
      .filter((cap): cap is HTMLButtonElement => Boolean(cap));

  const firstVisibleSlug = (): string | null =>
    visibleCaps()[0]?.getAttribute("data-eng") ?? null;

  /** Place dossiers in the item (accordion) or shared panel (master-detail). */
  const placeDossiers = (): void => {
    if (isAccordion()) {
      items.forEach((item) => {
        const slug = item.getAttribute("data-eng");
        if (!slug) return;
        const dossier = dossierBySlug(slug);
        if (dossier && dossier.parentElement !== item) {
          item.appendChild(dossier);
        }
      });
      return;
    }

    items.forEach((item) => {
      const slug = item.getAttribute("data-eng");
      if (!slug) return;
      const dossier = dossierBySlug(slug);
      if (dossier && dossier.parentElement !== panel) {
        panel.appendChild(dossier);
      }
    });
  };

  const hashSlug = (): string | null => {
    const match = window.location.hash.match(/^#engagement-(.+)$/);
    return match?.[1] ?? null;
  };

  const flashCap = (cap: HTMLButtonElement): void => {
    if (reduceMotion) return;
    cap.classList.remove("is-flash");
    void cap.offsetWidth;
    cap.classList.add("is-flash");
    window.setTimeout(() => cap.classList.remove("is-flash"), 900);
  };

  const syncFilterChrome = (on: boolean): void => {
    root.classList.toggle("is-filtered", on);
    filterBtns.forEach((btn) => {
      const mode = btn.getAttribute("data-roster-filter");
      if (mode === "featured") {
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      } else if (mode === "all") {
        btn.setAttribute("aria-pressed", on ? "false" : "true");
      }
    });
  };

  const setFeaturedOnly = (on: boolean): void => {
    if (!hasFilter) return;
    syncFilterChrome(on);

    items.forEach((item) => {
      const featured = item.getAttribute("data-featured") === "true";
      const hide = on && !featured;
      item.toggleAttribute("hidden", hide);
      item.setAttribute("data-filter-hidden", hide ? "true" : "false");
    });
  };

  const setOpen = (
    slug: string | null,
    opts: { syncHash?: boolean; focus?: boolean; flash?: boolean; scroll?: boolean } = {},
  ): void => {
    const { syncHash = true, focus = false, flash = false, scroll = true } = opts;

    /* Desktop master-detail never leaves an empty panel */
    let nextSlug = slug;
    if (nextSlug && itemBySlug(nextSlug) && !isItemVisible(itemBySlug(nextSlug)!)) {
      nextSlug = null;
    }
    if (!isAccordion() && nextSlug === null) {
      nextSlug = firstVisibleSlug();
    }

    items.forEach((item) => {
      const itemSlug = item.getAttribute("data-eng");
      const open = itemSlug !== null && itemSlug === nextSlug;
      const cap = item.querySelector<HTMLButtonElement>(".lp-console-cap");
      if (!cap || !itemSlug) return;

      const dossier = dossierBySlug(itemSlug);
      if (!dossier) return;

      item.classList.toggle("is-open", open);
      cap.classList.toggle("is-active", open);
      cap.setAttribute("aria-expanded", open ? "true" : "false");
      cap.setAttribute("tabindex", "0");
      dossier.hidden = !open;

      if (open && !reduceMotion) {
        dossier.classList.remove("is-entering");
        void dossier.offsetWidth;
        dossier.classList.add("is-entering");
      }
    });

    root.classList.toggle("is-empty", nextSlug === null);

    if (nextSlug) {
      const target = caps.find((c) => c.getAttribute("data-eng") === nextSlug);
      if (target) {
        if (scroll && isAccordion()) {
          target.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "nearest",
          });
        }
        if (focus) target.focus();
        if (flash) flashCap(target);
      }

      if (syncHash) {
        const next = `#engagement-${nextSlug}`;
        if (window.location.hash !== next) {
          history.replaceState(null, "", next);
        }
      }
    } else if (syncHash && window.location.hash.startsWith("#engagement-")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  const visibleIndexOfOpen = (): number => {
    const openSlug =
      items.find((item) => item.classList.contains("is-open"))?.getAttribute("data-eng") ?? null;
    const vis = visibleCaps();
    const i = vis.findIndex((cap) => cap.getAttribute("data-eng") === openSlug);
    return i >= 0 ? i : 0;
  };

  const move = (delta: number): void => {
    const vis = visibleCaps();
    if (vis.length === 0) return;
    const next = (visibleIndexOfOpen() + delta + vis.length) % vis.length;
    const slug = vis[next]?.getAttribute("data-eng");
    if (slug) setOpen(slug, { focus: true });
  };

  const applyFilter = (on: boolean, preferSlug: string | null = null): void => {
    const openSlug =
      preferSlug ??
      items.find((item) => item.classList.contains("is-open"))?.getAttribute("data-eng") ??
      null;
    setFeaturedOnly(on);
    const keep =
      openSlug && itemBySlug(openSlug) && isItemVisible(itemBySlug(openSlug)!)
        ? openSlug
        : null;
    if (isAccordion()) {
      setOpen(keep, { syncHash: Boolean(keep), scroll: false });
    } else {
      setOpen(keep ?? firstVisibleSlug(), { syncHash: Boolean(keep), scroll: false });
    }
  };

  placeDossiers();

  const fromHash = hashSlug();
  const hashValid =
    fromHash && caps.some((c) => c.getAttribute("data-eng") === fromHash) ? fromHash : null;
  const hashItem = hashValid ? itemBySlug(hashValid) : undefined;
  const hashIsFeatured = hashItem?.getAttribute("data-featured") === "true";

  /* Default: highlighted filter on. Deep links to non-featured work clear it. */
  const startFiltered = hasFilter && !(hashValid && !hashIsFeatured);
  setFeaturedOnly(startFiltered);

  /* Mobile accordion: all closed unless deep-linked.
   * Desktop master-detail: open hash or first visible client. */
  const initial =
    hashValid ?? (isAccordion() ? null : firstVisibleSlug());

  setOpen(initial, {
    syncHash: Boolean(hashValid),
    scroll: Boolean(hashValid),
    flash: Boolean(hashValid),
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-roster-filter");
      applyFilter(mode === "featured");
    });
  });

  caps.forEach((cap) => {
    const slug = cap.getAttribute("data-eng");

    cap.addEventListener("click", () => {
      if (!slug) return;
      const item = cap.closest(".lp-console-item");
      if (item && !isItemVisible(item as HTMLElement)) return;
      const alreadyOpen = item?.classList.contains("is-open") ?? false;

      if (isAccordion()) {
        setOpen(alreadyOpen ? null : slug);
      } else {
        setOpen(slug);
      }
    });

    cap.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          move(1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          move(-1);
          break;
        case "Home":
          event.preventDefault();
          {
            const first = firstVisibleSlug();
            if (first) setOpen(first, { focus: true });
          }
          break;
        case "End":
          event.preventDefault();
          {
            const vis = visibleCaps();
            const last = vis[vis.length - 1]?.getAttribute("data-eng");
            if (last) setOpen(last, { focus: true });
          }
          break;
        default:
          break;
      }
    });
  });

  const onBreakpointChange = (): void => {
    const openSlug =
      items.find((item) => item.classList.contains("is-open"))?.getAttribute("data-eng") ?? null;
    placeDossiers();
    if (isAccordion()) {
      setOpen(openSlug, { syncHash: false, scroll: false });
    } else {
      setOpen(openSlug ?? firstVisibleSlug(), {
        syncHash: false,
        scroll: false,
      });
    }
  };

  if (typeof accordionQuery.addEventListener === "function") {
    accordionQuery.addEventListener("change", onBreakpointChange);
  } else {
    accordionQuery.addListener(onBreakpointChange);
  }

  window.addEventListener("hashchange", () => {
    const slug = hashSlug();
    if (!slug || !caps.some((c) => c.getAttribute("data-eng") === slug)) return;
    const item = itemBySlug(slug);
    if (item && isFeaturedOnly() && item.getAttribute("data-featured") !== "true") {
      setFeaturedOnly(false);
    }
    setOpen(slug, { syncHash: false, flash: true });
  });
}
