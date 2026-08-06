/** Engagement Console — master-detail panel switching.
 *  Progressive enhancement: without JS, all dossiers are visible.
 *  With JS, only one dossier is shown; the rail controls navigation.
 *  Supports arrow-key rail navigation and `#engagement-{slug}` deep links.
 */
export function initEngagementConsole(): void {
  const root = document.getElementById("engagement-console");
  if (!root) return;

  const caps = Array.from(root.querySelectorAll<HTMLButtonElement>(".lp-console-cap"));
  const dossiers = Array.from(root.querySelectorAll<HTMLElement>(".lp-dossier"));
  if (caps.length === 0 || dossiers.length === 0) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const hashSlug = (): string | null => {
    const match = window.location.hash.match(/^#engagement-(.+)$/);
    return match?.[1] ?? null;
  };

  const flashCap = (cap: HTMLButtonElement): void => {
    if (reduceMotion) return;
    cap.classList.remove("is-flash");
    // Restart CSS animation
    void cap.offsetWidth;
    cap.classList.add("is-flash");
    window.setTimeout(() => cap.classList.remove("is-flash"), 900);
  };

  const activate = (
    slug: string,
    opts: { syncHash?: boolean; focus?: boolean; flash?: boolean } = {},
  ): void => {
    const { syncHash = true, focus = false, flash = false } = opts;
    const target = caps.find((c) => c.getAttribute("data-eng") === slug);
    if (!target) return;

    caps.forEach((c) => {
      const active = c === target;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-expanded", active ? "true" : "false");
      c.setAttribute("tabindex", active ? "0" : "-1");
    });

    dossiers.forEach((d) => {
      const show = d.id === `dossier-${slug}`;
      d.hidden = !show;
      if (show && !reduceMotion) {
        d.classList.remove("is-entering");
        void d.offsetWidth;
        d.classList.add("is-entering");
      }
    });

    if (focus) target.focus();
    if (flash) flashCap(target);

    if (syncHash) {
      const next = `#engagement-${slug}`;
      if (window.location.hash !== next) {
        history.replaceState(null, "", next);
      }
    }
  };

  const indexOfActive = (): number => {
    const i = caps.findIndex((c) => c.classList.contains("is-active"));
    return i >= 0 ? i : 0;
  };

  const move = (delta: number): void => {
    const next = (indexOfActive() + delta + caps.length) % caps.length;
    const slug = caps[next]?.getAttribute("data-eng");
    if (slug) activate(slug, { focus: true });
  };

  // Progressive enhancement: hide all but the initial dossier
  const fromHash = hashSlug();
  const initial =
    (fromHash && caps.some((c) => c.getAttribute("data-eng") === fromHash) ? fromHash : null) ??
    caps[0]?.getAttribute("data-eng");

  if (!initial) return;

  dossiers.forEach((d) => {
    d.hidden = d.id !== `dossier-${initial}`;
  });

  caps.forEach((cap) => {
    const slug = cap.getAttribute("data-eng");
    const active = slug === initial;
    cap.classList.toggle("is-active", active);
    cap.setAttribute("aria-expanded", active ? "true" : "false");
    cap.setAttribute("tabindex", active ? "0" : "-1");

    cap.addEventListener("click", () => {
      if (!slug) return;
      activate(slug);
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
            const first = caps[0]?.getAttribute("data-eng");
            if (first) activate(first, { focus: true });
          }
          break;
        case "End":
          event.preventDefault();
          {
            const last = caps[caps.length - 1]?.getAttribute("data-eng");
            if (last) activate(last, { focus: true });
          }
          break;
        default:
          break;
      }
    });
  });

  if (fromHash) {
    const deep = caps.find((c) => c.getAttribute("data-eng") === fromHash);
    if (deep) flashCap(deep);
  }

  // Deep link after load / back-forward if hash changes
  window.addEventListener("hashchange", () => {
    const slug = hashSlug();
    if (slug && caps.some((c) => c.getAttribute("data-eng") === slug)) {
      activate(slug, { syncHash: false, flash: true });
    }
  });
}
