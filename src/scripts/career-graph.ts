/** Horizontal git-branch career graph — wires, selection, scroll fades. */

type Edge =
  | { from: string; to: string; between?: undefined }
  | { from: string; between: string; to: string };

type NodePos = { x: number; y: number; lane: number };

const SCROLL_HINT_KEY = "lp-cgraph-scroll-hint-seen";
const LANE_OFFSET = 28;
const SPINE_KEYS = ["daust", "itech", "orange", "ergobit-fe", "purolator"];

function edgeKey(edge: Edge): string {
  if (edge.between) return `${edge.from}|${edge.between}->${edge.to}`;
  return `${edge.from}->${edge.to}`;
}

/** Perpendicular break: vertical from parent, then horizontal to child (git-style). */
function orthogonalLink(ax: number, ay: number, bx: number, by: number): string {
  if (Math.abs(ay - by) < 2) {
    return ` L ${bx} ${by}`;
  }
  return ` L ${ax} ${by} L ${bx} ${by}`;
}

function horizontalEdgePath(px: number, py: number, cx: number, cy: number): string {
  if (Math.abs(cy - py) < 2) {
    return `M ${px} ${py} L ${cx} ${cy}`;
  }
  return `M ${px} ${py} L ${px} ${cy} L ${cx} ${cy}`;
}

function branchEdgePath(jx: number, jy: number, cx: number, cy: number): string {
  return horizontalEdgePath(jx, jy, cx, cy);
}

function parseEdges(raw: string | null): Edge[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e): e is Edge => {
      if (typeof e !== "object" || e === null) return false;
      const edge = e as Edge;
      if (typeof edge.from !== "string" || typeof edge.to !== "string") return false;
      if (edge.between !== undefined && typeof edge.between !== "string") return false;
      return true;
    });
  } catch {
    return [];
  }
}

function svgEl<K extends keyof SVGElementTagNameMap>(
  name: K,
  attrs: Record<string, string> = {},
): SVGElementTagNameMap[K] {
  const el = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function initOne(root: HTMLElement): void {
  const chart = root.querySelector<HTMLElement>("[data-cgraph-chart]");
  const wires = root.querySelector<SVGSVGElement>("[data-cgraph-wires]");
  const track = root.querySelector<HTMLElement>("[data-cgraph-track]");
  const detail = root.querySelector<HTMLElement>("[data-cgraph-detail]");
  const fadeLeft = root.querySelector<HTMLElement>("[data-cgraph-fade-left]");
  const fadeRight = root.querySelector<HTMLElement>("[data-cgraph-fade-right]");
  const scrollHint = root.querySelector<HTMLElement>("[data-cgraph-scroll-hint]");
  const cards = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-cgraph-card]"));
  const edges = parseEdges(root.getAttribute("data-edges"));
  const defaultKey = root.getAttribute("data-default-key") ?? cards[cards.length - 1]?.dataset.key;

  if (!chart || !wires || !track || !detail || cards.length === 0) return;

  let activeKey = defaultKey ?? cards[0]!.dataset.key!;
  let geometryBuilt = false;
  let rebuildQueued = false;

  const cardByKey = new Map<string, HTMLButtonElement>();
  const nodeEls = new Map<string, HTMLElement>();
  for (const card of cards) {
    const key = card.dataset.key;
    if (!key) continue;
    cardByKey.set(key, card);
    const node = card.querySelector<HTMLElement>("[data-cgraph-node]");
    if (node) nodeEls.set(key, node);
  }

  // Stable detail slots — update text in place (no replaceChildren / reflow thrash)
  const detailInner = detail.querySelector<HTMLElement>(".lp-cgraph__detail-inner");
  const detailLabel = detail.querySelector<HTMLElement>(".lp-cgraph__detail-label");
  const detailPeriod = detail.querySelector<HTMLElement>(".lp-cgraph__detail-period");
  const detailName = detail.querySelector<HTMLElement>(".lp-cgraph__detail-name");
  const detailRole = detail.querySelector<HTMLElement>(".lp-cgraph__detail-role");
  const detailProof = detail.querySelector<HTMLElement>(".lp-cgraph__detail-proof");
  let detailCase = detail.querySelector<HTMLAnchorElement>(".lp-cgraph__detail-case");

  const wirePaths = new Map<string, SVGPathElement>();
  let spinePath: SVGPathElement | null = null;
  let runner: SVGCircleElement | null = null;
  let runnerMotion: SVGAnimateMotionElement | null = null;

  function measure(): Record<string, NodePos> {
    const box = chart!.getBoundingClientRect();
    const next: Record<string, NodePos> = {};
    for (const [key, el] of nodeEls) {
      const n = el.getBoundingClientRect();
      const card = cardByKey.get(key);
      next[key] = {
        x: n.left - box.left + n.width / 2,
        y: n.top - box.top + n.height / 2,
        lane: Number(card?.dataset.lane ?? 0),
      };
    }
    return next;
  }

  function ensureGeometry(): void {
    if (geometryBuilt) return;
    wires!.replaceChildren();
    wirePaths.clear();

    spinePath = svgEl("path", { class: "lp-cgraph__spine", pathLength: "1" });
    wires!.append(spinePath);

    runner = svgEl("circle", { r: "3.5", class: "lp-cgraph__runner" });
    runnerMotion = svgEl("animateMotion", {
      dur: "14s",
      repeatCount: "indefinite",
    });
    runner.append(runnerMotion);
    runner.style.display = "none";
    wires!.append(runner);

    for (const edge of edges) {
      const { from, to } = edge;
      const child = cardByKey.get(to);
      const attrs: Record<string, string> = {
        class: "lp-cgraph__wire",
        pathLength: "1",
        "data-from": from,
        "data-to": to,
        "data-lane": child?.dataset.lane ?? "0",
      };
      if (edge.between) attrs["data-between"] = edge.between;
      const path = svgEl("path", attrs);
      wires!.append(path);
      wirePaths.set(edgeKey(edge), path);
    }

    geometryBuilt = true;
  }

  function layoutWires(): void {
    ensureGeometry();
    const positions = measure();
    const chartW = Object.values(positions).reduce((m, p) => Math.max(m, p.x), 0) + 48;
    const chartH = Object.values(positions).reduce((m, p) => Math.max(m, p.y), 0) + 56;
    const w = Math.max(chartW, 1);
    const h = Math.max(chartH, 1);
    wires!.setAttribute("width", String(w));
    wires!.setAttribute("height", String(h));
    wires!.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const spinePts = SPINE_KEYS.map((k) => positions[k]).filter((p): p is NodePos => Boolean(p));
    let spineD = "";
    if (spinePts.length >= 2) {
      spineD = `M ${spinePts[0]!.x} ${spinePts[0]!.y}`;
      for (let i = 1; i < spinePts.length; i++) {
        const prev = spinePts[i - 1]!;
        const cur = spinePts[i]!;
        spineD += orthogonalLink(prev.x, prev.y, cur.x, cur.y);
      }
    }

    if (spinePath) {
      if (spineD) spinePath.setAttribute("d", spineD);
      else spinePath.removeAttribute("d");
    }

    if (runner && runnerMotion) {
      if (spineD && root.classList.contains("is-live")) {
        runner.style.display = "";
        runnerMotion.setAttribute("path", spineD);
      } else {
        runner.style.display = "none";
      }
    }

    for (const edge of edges) {
      const { from, to } = edge;
      const child = positions[to];
      const path = wirePaths.get(edgeKey(edge));
      if (!path || !child) continue;

      if (edge.between) {
        const anchorA = positions[from];
        const anchorB = positions[edge.between];
        if (!anchorA || !anchorB) continue;
        const jx = (anchorA.x + anchorB.x) / 2;
        const jy = anchorA.y;
        path.setAttribute("d", branchEdgePath(jx, jy, child.x, child.y));
        continue;
      }

      const parent = positions[from];
      if (!parent) continue;
      path.setAttribute("d", horizontalEdgePath(parent.x, parent.y, child.x, child.y));
    }

    syncWireHot();
  }

  function queueLayout(): void {
    if (rebuildQueued) return;
    rebuildQueued = true;
    requestAnimationFrame(() => {
      rebuildQueued = false;
      layoutWires();
    });
  }

  function syncWireHot(): void {
    for (const path of wirePaths.values()) {
      const from = path.getAttribute("data-from");
      const between = path.getAttribute("data-between");
      const to = path.getAttribute("data-to");
      const hot = to === activeKey || from === activeKey || between === activeKey;
      path.classList.toggle("is-hot", hot);
    }
  }

  function updateDetail(card: HTMLButtonElement, animate: boolean): void {
    if (!detailInner || !detailLabel || !detailPeriod || !detailName || !detailRole || !detailProof) {
      return;
    }

    const lane = card.dataset.lane ?? "0";
    const caseHref = card.dataset.caseHref ?? "";
    const caseLabel = card.dataset.caseLabel ?? "Open case study";

    detailInner.dataset.lane = lane;
    detailLabel.textContent = card.dataset.label ?? "";
    detailPeriod.textContent = card.dataset.period ?? "";
    detailName.textContent = card.dataset.name ?? "";
    detailRole.textContent = card.dataset.role ?? "";
    detailProof.textContent = card.dataset.proof ?? "";

    if (caseHref) {
      if (!detailCase) {
        detailCase = document.createElement("a");
        detailCase.className = "lp-cgraph__detail-case";
        detailInner.append(detailCase);
      }
      detailCase.href = caseHref;
      detailCase.textContent = `${caseLabel} →`;
      detailCase.hidden = false;
    } else if (detailCase) {
      detailCase.hidden = true;
      detailCase.removeAttribute("href");
    }

    if (!animate) {
      detailInner.classList.remove("is-updating");
      return;
    }

    detailInner.classList.remove("is-updating");
    void detailInner.offsetWidth;
    detailInner.classList.add("is-updating");
  }

  function scrollCardIntoView(card: HTMLButtonElement): void {
    const trackBox = track!.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    const pad = 28;
    let delta = 0;
    if (cardBox.left < trackBox.left + pad) {
      delta = cardBox.left - trackBox.left - pad;
    } else if (cardBox.right > trackBox.right - pad) {
      delta = cardBox.right - trackBox.right + pad;
    }
    if (delta !== 0) {
      track!.scrollBy({ left: delta, behavior: "smooth" });
    }
  }

  function setActive(
    key: string,
    opts: { scroll?: boolean; animate?: boolean } = {},
  ): void {
    const next = cardByKey.get(key);
    if (!next) return;

    if (key === activeKey && next.classList.contains("is-active")) {
      if (opts.scroll) scrollCardIntoView(next);
      return;
    }

    const prev = cardByKey.get(activeKey);
    if (prev) {
      prev.classList.remove("is-active");
      prev.setAttribute("aria-pressed", "false");
    }

    activeKey = key;
    next.classList.add("is-active");
    next.setAttribute("aria-pressed", "true");
    updateDetail(next, opts.animate !== false);
    syncWireHot();

    if (opts.scroll !== false) scrollCardIntoView(next);
  }

  function syncScrollFades(): void {
    const max = track!.scrollWidth - track!.clientWidth;
    if (max <= 8) {
      fadeLeft?.classList.remove("is-visible");
      fadeRight?.classList.remove("is-visible");
      return;
    }
    fadeLeft?.classList.toggle("is-visible", track!.scrollLeft > 12);
    fadeRight?.classList.toggle("is-visible", track!.scrollLeft < max - 12);
  }

  function maybeShowScrollHint(): void {
    if (!scrollHint) return;
    try {
      if (sessionStorage.getItem(SCROLL_HINT_KEY)) return;
    } catch {
      /* private browsing */
    }
    const max = track!.scrollWidth - track!.clientWidth;
    if (max <= 24) return;
    scrollHint.hidden = false;
    track!.scrollLeft = max;
    syncScrollFades();
  }

  function dismissScrollHint(): void {
    if (!scrollHint || scrollHint.hidden) return;
    scrollHint.hidden = true;
    try {
      sessionStorage.setItem(SCROLL_HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  for (const card of cards) {
    const lane = Number(card.dataset.lane ?? 0);
    card.style.setProperty("--lane-y", `${lane * LANE_OFFSET}px`);

    // pointerdown = instant; mouse hover updates detail automatically
    card.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      dismissScrollHint();
      const key = card.dataset.key;
      if (key) setActive(key, { animate: true });
    });

    card.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      const key = card.dataset.key;
      if (key) setActive(key, { scroll: false, animate: false });
    });

    card.addEventListener("focus", () => {
      const key = card.dataset.key;
      if (key) setActive(key, { animate: true });
    });

    // Activation already handled on pointerdown / focus
    card.addEventListener("click", (e) => {
      e.preventDefault();
    });
  }

  track.addEventListener(
    "scroll",
    () => {
      dismissScrollHint();
      syncScrollFades();
    },
    { passive: true },
  );
  track.addEventListener("pointerdown", dismissScrollHint);

  const ro = new ResizeObserver(() => {
    queueLayout();
    syncScrollFades();
  });
  ro.observe(chart);

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const live = entry.isIntersecting;
        root.classList.toggle("is-live", live);
        if (live) {
          queueLayout();
          maybeShowScrollHint();
        } else if (runner) {
          runner.style.display = "none";
        }
      }
    },
    { threshold: 0.2 },
  );
  io.observe(root);

  requestAnimationFrame(() => {
    const max = track.scrollWidth - track.clientWidth;
    if (max > 0) track.scrollLeft = max;
    layoutWires();
    setActive(activeKey, { scroll: false, animate: false });
    syncScrollFades();
  });
}

export function initCareerGraph(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>("[data-career-graph]").forEach(initOne);
}
