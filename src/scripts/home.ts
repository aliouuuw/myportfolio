/** Home: theme, locale links, Work/Background views, the career/main graph, and the Work list controls. */

const root = document.documentElement;
const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Run a DOM change inside a View Transition when the browser has one and motion is allowed.
 * `kind` puts a class on <html> for the transition's life, so CSS can give each kind its own motion.
 */
function swap(fn: () => void, kind?: string): ViewTransition | null {
  if (!document.startViewTransition || reduce()) {
    fn();
    return null;
  }
  if (kind) root.classList.add(kind);
  const vt = document.startViewTransition(fn);
  vt.finished.finally(() => kind && root.classList.remove(kind));
  return vt;
}

/* ---------- Theme: the new theme opens as a circle from the switch ---------- */

const isDark = () =>
  root.dataset.theme === "dark" || (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);

function toggleTheme(from?: HTMLElement): void {
  const next = isDark() ? "light" : "dark";
  const vt = swap(() => (root.dataset.theme = next), "theme-vt");
  try {
    localStorage.setItem("portfolio-theme", next);
  } catch {
    /* private mode */
  }
  if (!vt) return;
  const box = from?.getBoundingClientRect();
  const x = box ? box.left + box.width / 2 : innerWidth - 40;
  const y = box ? box.top + box.height / 2 : 40;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  vt.ready.then(() =>
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 620, easing: OUT, pseudoElement: "::view-transition-new(root)" },
    ),
  );
}

/* ---------- Locale links keep the current view ---------- */

function syncLocaleLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>("[data-locale-link]").forEach((a) => {
    a.href = (a.dataset.localeLink ?? "/") + (location.hash === "#background" ? "#background" : "");
  });
}

/* ---------- Hero: letters of the name swell toward the pointer ---------- */

function initName(): void {
  const name = document.querySelector<HTMLElement>("[data-name]");
  if (!name || !matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
  const letters = [...name.children] as HTMLElement[];
  let frame = 0;
  document.addEventListener("pointermove", (e) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      for (const l of letters) {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        // Full swell inside ~1 letter, fades out by ~420px.
        const k = Math.max(0, 1 - d / 420);
        l.style.setProperty("--w", String(Math.round(200 + 500 * k * k)));
      }
    });
  }, { passive: true });
  document.addEventListener("pointerleave", () => letters.forEach((l) => l.style.removeProperty("--w")));
}

/* ---------- Copy the address: mailto does nothing on a machine without a mail app ---------- */

function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((b) => {
    const label = b.querySelector<HTMLElement>(".copy-label");
    const idle = label?.textContent ?? "";
    let reset = 0;
    b.addEventListener("click", async () => {
      let ok = true;
      try {
        await navigator.clipboard.writeText(b.dataset.copy ?? "");
      } catch {
        ok = false;
      }
      b.classList.toggle("is-done", ok);
      if (label) label.textContent = ok ? (b.dataset.done ?? "") : (b.dataset.fail ?? "");
      clearTimeout(reset);
      reset = window.setTimeout(() => {
        b.classList.remove("is-done");
        if (label) label.textContent = idle;
      }, 1800);
    });
  });
}

/* ---------- Ink buttons: a soft light follows the pointer across the surface ---------- */

function initPointerLight(): void {
  document.querySelectorAll<HTMLElement>(".checkout, .primary").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty("--mx", `${e.clientX - r.left}px`);
      b.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- Segmented controls: the thumb slides to the pressed option (an animated clip, no layout) ---------- */

function placeThumbs(): void {
  document.querySelectorAll<HTMLElement>(".seg").forEach((seg) => {
    const on = seg.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!on || !seg.offsetParent) return;
    seg.style.setProperty("--x", `${on.offsetLeft}px`);
    seg.style.setProperty("--w", `${on.offsetWidth}px`);
    seg.style.setProperty("--sw", `${seg.scrollWidth}px`);
    if (!seg.classList.contains("ready")) requestAnimationFrame(() => seg.classList.add("ready"));
  });
}

/* ---------- career/main ---------- */

const NS = "http://www.w3.org/2000/svg";

function initGraph(): { layout: () => void } {
  const graph = document.querySelector<HTMLElement>(".graph");
  if (!graph) return { layout: () => {} };
  const rows = [...graph.querySelectorAll<HTMLElement>(".commit")];
  const edges: { from: string; to: string }[] = JSON.parse(graph.dataset.edges ?? "[]");
  const layer = (name: string) => {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", `rail ${name}`);
    svg.setAttribute("aria-hidden", "true");
    return svg;
  };
  const ghost = layer("ghost");
  const live = layer("live");
  const trace = layer("trace");
  const tip = document.createElement("span");
  tip.className = "tip";
  tip.setAttribute("aria-hidden", "true");
  graph.prepend(ghost, live, trace, tip);

  let at: Record<string, { x: number; y: number }> = {};
  let pathOf: Record<string, string> = {};
  const laneOf = (key: string) => at[key]?.x ?? 0;

  /* Ancestry: every commit and edge between a role and `initial commit`. */
  const parents = (key: string) => edges.filter((e) => e.to === key).map((e) => e.from);
  function ancestry(key: string): { nodes: Set<string>; links: string[] } {
    const nodes = new Set<string>([key]);
    const links: string[] = [];
    const queue = [key];
    while (queue.length) {
      const k = queue.shift()!;
      for (const p of parents(k)) {
        links.push(`${p}>${k}`);
        if (!nodes.has(p)) {
          nodes.add(p);
          queue.push(p);
        }
      }
    }
    return { nodes, links };
  }

  const dot = (key: string, cls = "dot", r = 4.5) => `<circle class="${cls}" cx="${at[key].x}" cy="${at[key].y}" r="${r}"/>`;

  function layout(): void {
    if (!graph!.offsetParent) return; // hidden view: nothing to measure
    const laneX = (l: number) => 7 + l * (innerWidth < 640 ? 14 : 22);
    const h = graph!.offsetHeight;
    at = {};
    rows.forEach((r) => (at[r.dataset.key!] = { x: laneX(Number(r.dataset.lane)), y: r.offsetTop + 27 }));
    // git log --graph: the line rises in the parent's lane and turns into the child's lane just under it.
    pathOf = {};
    for (const { from, to } of edges) {
      const p = at[from], c = at[to];
      if (!p || !c) continue;
      const turn = Math.min(44, (p.y - c.y) * 0.6);
      pathOf[`${from}>${to}`] =
        p.x === c.x ? `M${p.x} ${p.y}V${c.y}` : `M${p.x} ${p.y}V${c.y + turn}C${p.x} ${c.y + turn * 0.35} ${c.x} ${c.y + turn * 0.55} ${c.x} ${c.y}`;
    }
    const paths = Object.values(pathOf).map((d) => `<path d="${d}"/>`).join("");
    for (const svg of [ghost, live, trace]) {
      svg.setAttribute("viewBox", `0 0 64 ${h}`);
      svg.style.height = `${h}px`;
    }
    ghost.innerHTML = paths + rows.map((r) => dot(r.dataset.key!)).join("");
    live.innerHTML =
      paths +
      rows
        .map((r) =>
          r.hasAttribute("data-current") ? dot(r.dataset.key!, "head", 7) + dot(r.dataset.key!, "head-dot", 3) : dot(r.dataset.key!),
        )
        .join("");
    trace.innerHTML = "";
    progress();
  }

  /* The line draws down to the reading line (60% of the viewport); nodes it reaches fill in.
     The accent tip rides the end of the line, in the lane of the next commit down. */
  let ticking = false;
  function progress(): void {
    ticking = false;
    if (!graph!.offsetParent) return;
    const rect = graph!.getBoundingClientRect();
    const drawn = reduce() ? rect.height : Math.max(0, Math.min(rect.height, innerHeight * 0.6 - rect.top));
    graph!.style.setProperty("--drawn", `${drawn}px`);
    let next: HTMLElement | undefined;
    for (const r of rows) {
      const reached = (at[r.dataset.key!]?.y ?? Infinity) <= drawn + 1;
      r.classList.toggle("reached", reached);
      if (!reached && !next) next = r;
    }
    const drawing = !reduce() && drawn > 0 && next !== undefined;
    tip.classList.toggle("on", drawing);
    if (drawing) tip.style.transform = `translate(${laneOf(next!.dataset.key!)}px, ${drawn}px)`;
  }

  function showTrace(key: string | null): void {
    graph!.classList.toggle("is-tracing", key !== null);
    if (!key) {
      trace.innerHTML = "";
      rows.forEach((r) => r.classList.remove("in-trace"));
      return;
    }
    const { nodes, links } = ancestry(key);
    trace.innerHTML =
      links.map((l) => (pathOf[l] ? `<path d="${pathOf[l]}"/>` : "")).join("") + [...nodes].map((k) => (at[k] ? dot(k) : "")).join("");
    rows.forEach((r) => r.classList.toggle("in-trace", nodes.has(r.dataset.key!)));
  }
  rows.forEach((r) => {
    r.addEventListener("pointerenter", () => showTrace(r.dataset.key!));
    r.addEventListener("focus", () => showTrace(r.dataset.key!));
  });
  graph.addEventListener("pointerleave", () => showTrace(null));
  graph.addEventListener("focusout", (e) => {
    if (!graph.contains(e.relatedTarget as Node)) showTrace(null);
  });

  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(progress);
      }
    },
    { passive: true },
  );
  let resizing = 0;
  addEventListener("resize", () => {
    clearTimeout(resizing);
    resizing = window.setTimeout(() => {
      layout();
      placeThumbs();
    }, 120);
  });
  document.fonts?.ready.then(() => {
    layout();
    placeThumbs();
  });
  return { layout };
}

/* ---------- Work list: filter by domain, sort, show more ---------- */

const LIMIT = 6;

function initWorkList(): { reveal: (id: string) => void } {
  const list = document.querySelector<HTMLUListElement>(".sites");
  const tools = document.querySelector<HTMLElement>(".work-tools");
  const more = document.querySelector<HTMLButtonElement>(".more-rows");
  const count = document.querySelector<HTMLElement>(".online-count");
  if (!list || !tools || !more) return { reveal: () => {} };
  const items = [...list.querySelectorAll<HTMLLIElement>(":scope > li")];
  const state = { filter: "all", sort: "selected", expanded: false };
  const collator = new Intl.Collator(root.lang);

  const order: Record<string, (a: HTMLLIElement, b: HTMLLIElement) => number> = {
    selected: (a, b) => Number(a.dataset.index) - Number(b.dataset.index),
    recent: (a, b) => (b.dataset.date ?? "").localeCompare(a.dataset.date ?? "") || Number(a.dataset.index) - Number(b.dataset.index),
    az: (a, b) => collator.compare(a.dataset.name ?? "", b.dataset.name ?? ""),
  };

  /* "11 online" follows the filter, counting to the new number. */
  let shownCount = Number(count?.textContent ?? 0);
  function setCount(n: number): void {
    if (!count || n === shownCount) return;
    const from = shownCount;
    shownCount = n;
    if (reduce()) {
      count.textContent = String(n);
      return;
    }
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 420);
      const eased = 1 - Math.pow(1 - k, 3);
      count.textContent = String(Math.round(from + (n - from) * eased));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function render(): void {
    const sorted = [...items].sort(order[state.sort]);
    list!.append(...sorted);
    let shown = 0;
    let matching = 0;
    let online = 0;
    for (const li of sorted) {
      const match = state.filter === "all" || li.dataset.domain === state.filter;
      if (match) {
        matching++;
        if (li.hasAttribute("data-online")) online++;
      }
      li.hidden = !match || (!state.expanded && shown >= LIMIT);
      if (!li.hidden) shown++;
    }
    const rest = matching - shown;
    more!.hidden = rest <= 0;
    more!.querySelector(".more-label")!.textContent = (list!.dataset.moreLabel ?? "Show {n} more").replace("{n}", String(rest));
    tools!.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === state.filter)));
    tools!.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.sort === state.sort)));
    placeThumbs();
    setCount(online);
  }

  /* Rows glide to their new places: each row gets its own transition name only while the list changes. */
  function update(change: () => void): void {
    list!.classList.add("is-moving");
    const vt = swap(() => {
      change();
      render();
    });
    if (vt) vt.finished.finally(() => list!.classList.remove("is-moving"));
    else list!.classList.remove("is-moving");
  }

  tools.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
    if (!b) return;
    if (b.dataset.filter && b.dataset.filter !== state.filter)
      update(() => {
        state.filter = b.dataset.filter!;
        state.expanded = false;
      });
    if (b.dataset.sort && b.dataset.sort !== state.sort) update(() => (state.sort = b.dataset.sort!));
  });
  more.addEventListener("click", () => update(() => (state.expanded = true)));

  /* Old deep links (#engagement-<slug>, from /work redirects and the essay) open the row in full view. */
  function reveal(id: string): void {
    const li = document.getElementById(id);
    if (!li || li.parentElement !== list) return;
    state.filter = "all";
    state.expanded = true;
    render();
    li.scrollIntoView({ block: "center", behavior: reduce() ? "auto" : "smooth" });
    li.classList.remove("flash");
    void li.offsetWidth;
    li.classList.add("flash");
  }

  tools.hidden = false;
  render();
  return { reveal };
}

/* ---------- Views: CSS :target switches them without JS; JS adds the checkout transition ---------- */

export function initHome(): void {
  const graph = initGraph();
  const work = initWorkList();
  initName();
  initCopy();
  initPointerLight();

  // The name settles once on first load; later visits to Work do not replay it.
  document.querySelector(".name")?.addEventListener("animationend", () => root.classList.add("settled"), { once: true });

  const bgView = document.getElementById("background");
  const show = (view: "work" | "background") => {
    root.dataset.view = view;
    // On Work, Background is only a blurred hint behind the page: out of the tab order and the a11y tree.
    if (bgView) bgView.inert = view === "work";
    syncLocaleLinks();
    graph.layout();
    placeThumbs();
  };
  const fromHash = () => {
    if (location.hash === "#background") return show("background");
    show("work");
    if (location.hash.startsWith("#engagement-")) work.reveal(location.hash.slice(1));
  };
  const go = (view: "work" | "background", trigger?: HTMLElement) => {
    // "Check my background" commits: its node fills with the accent in the frame the transition captures.
    trigger?.classList.add("is-committing");
    const vt = swap(() => {
      history.pushState(null, "", view === "work" ? location.pathname + location.search : "#background");
      show(view);
      scrollTo(0, 0);
    }, "checkout-vt");
    const done = () => trigger?.classList.remove("is-committing");
    if (vt) vt.finished.finally(done);
    else done();
  };

  document.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-go], [data-action], [data-locale-link]");
    if (!el) return;
    if (el.dataset.go) {
      e.preventDefault();
      go(el.dataset.go === "background" ? "background" : "work", el);
    } else if (el.dataset.action === "theme") {
      toggleTheme(el);
    } else if (el.hasAttribute("data-locale-link")) {
      document.cookie = "portfolio-locale-detected=1; Path=/; Max-Age=31536000; SameSite=Lax";
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.metaKey && e.code === "KeyL") {
      e.preventDefault();
      toggleTheme(document.querySelector<HTMLElement>('[data-action="theme"]') ?? undefined);
    } else if (e.key === "Escape" && root.dataset.view === "background") {
      go("work");
    }
  });
  addEventListener("popstate", fromHash);
  addEventListener("hashchange", fromHash);
  fromHash();
}
