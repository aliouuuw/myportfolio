"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";

import { TransitionLink } from "@/components/transition-link";
import {
  CAREER_AXIS_YEARS,
  CAREER_GRAPH_EDGES,
  CAREER_STINTS,
  type CareerStint,
} from "@/lib/career-timeline";
import { SYNTHESIS_WORK, synthesisWorkHref } from "@/lib/synthesis-data";

const LANE_COLORS = [
  "var(--cgraph-lane-0)",
  "var(--cgraph-lane-1)",
  "var(--cgraph-lane-2)",
];

/** Chronological — oldest left, newest right. */
const STINTS: CareerStint[] = CAREER_STINTS;

/** Middle of the timeline — good demo target without overriding HEAD default too long. */
const DEMO_TARGET_KEY = "ergobit-se";
const DEMO_SEEN_KEY = "syn-cgraph-demo-seen";
const SCROLL_ONBOARD_KEY = "syn-cgraph-scroll-onboard-seen";
const MOBILE_MQ = "(max-width: 767px)";

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_MQ).matches;
}

type NodePos = { x: number; y: number; lane: number };
type EdgePath = {
  id: string;
  d: string;
  lane: number;
  childKey: string;
  parentKey: string;
};

type SynthesisCareerGraphProps = {
  locale: string;
};

function caseHrefFor(locale: string, linkedWork: string[]): string | undefined {
  const id = linkedWork[0];
  if (!id) return undefined;
  const row = SYNTHESIS_WORK.find((w) => w.id === id);
  return row ? synthesisWorkHref(locale, row.slug) : undefined;
}

function horizontalEdgePath(
  px: number,
  py: number,
  cx: number,
  cy: number,
): string {
  if (Math.abs(cy - py) < 2) {
    return `M ${px} ${py} L ${cx} ${cy}`;
  }
  const span = cx - px;
  const bend = Math.min(36, span * 0.42);
  const midX = px + bend;
  return `M ${px} ${py} L ${midX} ${py} C ${midX + bend * 0.5} ${py} ${cx - bend} ${cy} ${cx} ${cy}`;
}

type DemoCursor = {
  x: number;
  y: number;
  opacity: number;
  clicking: boolean;
  animate: boolean;
};

export function SynthesisCareerGraph({ locale }: SynthesisCareerGraphProps) {
  const t = useTranslations("HomePage.synthesis.workedWith");
  const [activeKey, setActiveKey] = useState<string>("everest");
  const [inView, setInView] = useState(false);
  const [fullyInView, setFullyInView] = useState(false);
  const [positions, setPositions] = useState<Record<string, NodePos>>({});
  const [demoCursor, setDemoCursor] = useState<DemoCursor | null>(null);
  const [demoTargetKey, setDemoTargetKey] = useState<string | null>(null);
  const [scrollHint, setScrollHint] = useState<"none" | "left">("none");
  const [scrollFades, setScrollFades] = useState({ left: false, right: false });

  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const demoPlayedRef = useRef(false);
  const scrollOnboardPlayedRef = useRef(false);
  const demoTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const measure = useCallback(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const box = chart.getBoundingClientRect();
    const next: Record<string, NodePos> = {};
    for (const stint of STINTS) {
      const el = nodeRefs.current[stint.key];
      if (!el) continue;
      const n = el.getBoundingClientRect();
      next[stint.key] = {
        x: n.left - box.left + n.width / 2,
        y: n.top - box.top + n.height / 2,
        lane: stint.lane,
      };
    }
    setPositions(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (chartRef.current) ro.observe(chartRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const clearDemoTimers = useCallback(() => {
    for (const id of demoTimersRef.current) clearTimeout(id);
    demoTimersRef.current = [];
  }, []);

  const clearScrollTimers = useCallback(() => {
    for (const id of scrollTimersRef.current) clearTimeout(id);
    scrollTimersRef.current = [];
  }, []);

  const syncScrollFades = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 8) {
      setScrollFades({ left: false, right: false });
      return;
    }
    setScrollFades({
      left: track.scrollLeft > 12,
      right: track.scrollLeft < max - 12,
    });
  }, []);

  const dismissScrollHint = useCallback(() => {
    setScrollHint("none");
    try {
      sessionStorage.setItem(SCROLL_ONBOARD_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const cancelDemo = useCallback(() => {
    clearDemoTimers();
    setDemoCursor(null);
    setDemoTargetKey(null);
    demoPlayedRef.current = true;
    try {
      sessionStorage.setItem(DEMO_SEEN_KEY, "1");
    } catch {
      /* private browsing */
    }
  }, [clearDemoTimers]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
          setFullyInView(
            entry.isIntersecting && entry.intersectionRatio >= 0.72,
          );
        }
      },
      { threshold: [0, 0.12, 0.72, 0.9] },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      syncScrollFades();
      if (scrollHint === "left") {
        const max = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft < max - 40) dismissScrollHint();
      }
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    syncScrollFades();
    return () => track.removeEventListener("scroll", onScroll);
  }, [syncScrollFades, scrollHint, dismissScrollHint]);

  useEffect(() => {
    if (!fullyInView || scrollOnboardPlayedRef.current) return;
    if (!isMobileViewport()) return;

    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 8) return;

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SCROLL_ONBOARD_KEY) === "1";
    } catch {
      /* ignore */
    }

    scrollOnboardPlayedRef.current = true;
    clearScrollTimers();

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      scrollTimersRef.current.push(id);
    };

    if (alreadySeen) {
      track.scrollLeft = maxScroll;
      syncScrollFades();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollLeft = 0;
    syncScrollFades();

    schedule(() => {
      track.scrollTo({
        left: maxScroll,
        behavior: reduced ? "auto" : "smooth",
      });
      syncScrollFades();
    }, 450);

    schedule(() => {
      setScrollHint("left");
      syncScrollFades();
      try {
        sessionStorage.setItem(SCROLL_ONBOARD_KEY, "1");
      } catch {
        /* ignore */
      }
    }, reduced ? 500 : 1650);

    return clearScrollTimers;
  }, [fullyInView, syncScrollFades, clearScrollTimers]);

  useEffect(() => {
    if (!fullyInView || demoPlayedRef.current) return;
    if (typeof window === "undefined") return;
    if (isMobileViewport()) {
      demoPlayedRef.current = true;
      return;
    }

    try {
      if (sessionStorage.getItem(DEMO_SEEN_KEY) === "1") {
        demoPlayedRef.current = true;
        return;
      }
    } catch {
      /* ignore */
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      demoPlayedRef.current = true;
      return;
    }

    const target = positions[DEMO_TARGET_KEY];
    const chart = chartRef.current;
    if (!target || !chart) return;

    demoPlayedRef.current = true;
    clearDemoTimers();

    const targetEl = nodeRefs.current[DEMO_TARGET_KEY];
    targetEl
      ?.closest("button")
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });

    const w = chart.clientWidth;
    const h = chart.clientHeight;
    const from = { x: w * 0.78, y: h * 0.92 };
    const to = { x: target.x, y: target.y };

    setDemoTargetKey(DEMO_TARGET_KEY);
    setDemoCursor({ ...from, opacity: 0, clicking: false, animate: false });

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      demoTimersRef.current.push(id);
    };

    schedule(() => {
      setDemoCursor({ ...from, opacity: 1, clicking: false, animate: false });
    }, 120);

    schedule(() => {
      setDemoCursor({ ...to, opacity: 1, clicking: false, animate: true });
    }, 280);

    schedule(() => {
      setDemoCursor({ ...to, opacity: 1, clicking: true, animate: true });
      setActiveKey(DEMO_TARGET_KEY);
    }, 1850);

    schedule(() => {
      setDemoCursor({ ...to, opacity: 1, clicking: false, animate: true });
    }, 2050);

    schedule(() => {
      setDemoCursor({ ...to, opacity: 0, clicking: false, animate: true });
    }, 2500);

    schedule(() => {
      setDemoCursor(null);
      setDemoTargetKey(null);
      try {
        sessionStorage.setItem(DEMO_SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 2900);

    return clearDemoTimers;
  }, [fullyInView, positions, clearDemoTimers]);

  const edges = useMemo<EdgePath[]>(() => {
    const out: EdgePath[] = [];
    for (const { from, to } of CAREER_GRAPH_EDGES) {
      const parent = positions[from];
      const child = positions[to];
      if (!parent || !child) continue;
      out.push({
        id: `${from}-${to}`,
        d: horizontalEdgePath(parent.x, parent.y, child.x, child.y),
        lane: child.lane,
        childKey: to,
        parentKey: from,
      });
    }
    return out;
  }, [positions]);

  const spinePath = useMemo(() => {
    const chain = [
      "daust",
      "itech",
      "orange",
      "ergobit-fe",
      "purolator",
      "ergobit-se",
      "everest",
    ];
    const pts = chain
      .map((k) => positions[k])
      .filter((p): p is NodePos => Boolean(p));
    if (pts.length < 2) return "";
    return pts.reduce(
      (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
      "",
    );
  }, [positions]);

  const chartW =
    Object.values(positions).reduce((m, p) => Math.max(m, p.x), 0) + 48;
  const chartH =
    Object.values(positions).reduce((m, p) => Math.max(m, p.y), 0) + 56;

  const activeStint =
    STINTS.find((s) => s.key === activeKey) ?? STINTS[STINTS.length - 1];
  const activeHref = caseHrefFor(locale, activeStint.linkedWork);

  return (
    <div
      ref={rootRef}
      className={`syn-cgraph syn-cgraph--horizontal${inView ? " is-live" : ""}`}
    >
      <div className="syn-cgraph__terminal" aria-hidden>
        <span className="syn-cgraph__dots">
          <i /> <i /> <i />
        </span>
        <span className="syn-cgraph__prompt">$</span>
        <span className="syn-cgraph__cmd">
          git log --graph --oneline --decorate career/main
        </span>
        <span className="syn-cgraph__cursor" />
      </div>

      <div className="syn-cgraph__track-wrap">
        <div
          ref={trackRef}
          className="syn-cgraph__track"
          onPointerDown={() => {
            cancelDemo();
            if (scrollHint === "left") dismissScrollHint();
          }}
        >
        <div
          ref={chartRef}
          className="syn-cgraph__chart"
          aria-label={t("graphAria")}
        >
          {demoCursor ? (
            <div
              className={`syn-cgraph__demo-cursor${demoCursor.clicking ? " is-clicking" : ""}${demoCursor.animate ? " is-moving" : ""}`}
              style={{
                left: demoCursor.x,
                top: demoCursor.y,
                opacity: demoCursor.opacity,
              }}
              aria-hidden
            />
          ) : null}
          <svg
            className="syn-cgraph__wires"
            width={chartW || 1}
            height={chartH || 1}
            viewBox={`0 0 ${chartW || 1} ${chartH || 1}`}
            aria-hidden
          >
            {spinePath ? (
              <path
                id="cgraph-spine"
                d={spinePath}
                className="syn-cgraph__spine"
                pathLength={1}
              />
            ) : null}
            {spinePath && inView ? (
              <circle r={4} className="syn-cgraph__runner">
                <animateMotion
                  dur="14s"
                  repeatCount="indefinite"
                  path={spinePath}
                />
              </circle>
            ) : null}
            {edges.map((edge) => {
              const hot =
                edge.childKey === activeKey || edge.parentKey === activeKey;
              return (
                <path
                  key={edge.id}
                  d={edge.d}
                  className={`syn-cgraph__wire${hot ? " is-hot" : ""}`}
                  style={{
                    stroke: LANE_COLORS[edge.lane] ?? LANE_COLORS[0],
                  }}
                  pathLength={1}
                />
              );
            })}
          </svg>

          <ol className="syn-cgraph__commits">
            {STINTS.map((stint, i) => (
              <CommitCard
                key={stint.key}
                stint={stint}
                index={i}
                isActive={activeKey === stint.key}
                isDemoTarget={demoTargetKey === stint.key}
                isDemoClick={
                  demoTargetKey === stint.key && demoCursor?.clicking === true
                }
                laneColor={LANE_COLORS[stint.lane] ?? LANE_COLORS[0]}
                currentBadge={t("currentBadge")}
                onActivate={() => {
                  cancelDemo();
                  setActiveKey(stint.key);
                }}
                registerNode={(el) => {
                  nodeRefs.current[stint.key] = el;
                }}
              />
            ))}
          </ol>

          <div className="syn-cgraph__years" aria-hidden>
            {CAREER_AXIS_YEARS.map((year) => (
              <span key={year} className="syn-cgraph__year">
                {year}
              </span>
            ))}
          </div>
        </div>
        </div>

        <div
          className={`syn-cgraph__fade syn-cgraph__fade--left${scrollFades.left ? " is-visible" : ""}`}
          aria-hidden
        />
        <div
          className={`syn-cgraph__fade syn-cgraph__fade--right${scrollFades.right ? " is-visible" : ""}`}
          aria-hidden
        />

        {scrollHint === "left" ? (
          <p className="syn-cgraph__scroll-hint" role="status">
            <span className="syn-cgraph__scroll-hint-arrows" aria-hidden>
              <span>‹</span>
              <span>‹</span>
              <span>‹</span>
            </span>
            {t("scrollHintLeft")}
          </p>
        ) : null}
      </div>

      <div className="syn-cgraph__detail" aria-live="polite" aria-atomic="true">
        <CommitDetail
          key={activeStint.key}
          stintKey={activeStint.key}
          laneColor={LANE_COLORS[activeStint.lane] ?? LANE_COLORS[0]}
          caseHref={activeHref}
        />
      </div>
    </div>
  );
}

function CommitCard({
  stint,
  index,
  isActive,
  isDemoTarget,
  isDemoClick,
  laneColor,
  currentBadge,
  onActivate,
  registerNode,
}: {
  stint: CareerStint;
  index: number;
  isActive: boolean;
  isDemoTarget: boolean;
  isDemoClick: boolean;
  laneColor: string;
  currentBadge: string;
  onActivate: () => void;
  registerNode: (el: HTMLSpanElement | null) => void;
}) {
  const t = useTranslations(
    `HomePage.synthesis.workedWith.stints.${stint.key}`,
  );

  return (
    <li>
      <button
        type="button"
        className={`syn-cgraph__card${isActive ? " is-active" : ""}${isDemoTarget ? " is-demo-target" : ""}${isDemoClick ? " is-demo-click" : ""}`}
        style={{ ["--i" as string]: index, ["--lane-color" as string]: laneColor }}
        onClick={onActivate}
        onFocus={onActivate}
        aria-pressed={isActive}
      >
        <span className="syn-cgraph__card-rail">
          <span ref={registerNode} className="syn-cgraph__node">
            {stint.current ? (
              <span className="syn-cgraph__node-pulse" aria-hidden />
            ) : null}
          </span>
        </span>
        <span className="syn-cgraph__label">{t("label")}</span>
        <span className="syn-cgraph__name">{t("name")}</span>
        <span className="syn-cgraph__period">{t("period")}</span>
        {stint.current ? (
          <span className="syn-cgraph__head">{currentBadge}</span>
        ) : null}
      </button>
    </li>
  );
}

function CommitDetail({
  stintKey,
  laneColor,
  caseHref,
}: {
  stintKey: string;
  laneColor: string;
  caseHref?: string;
}) {
  const t = useTranslations(
    `HomePage.synthesis.workedWith.stints.${stintKey}`,
  );

  return (
    <div className="syn-cgraph__detail-inner">
      <div className="syn-cgraph__detail-head">
        <span
          className="syn-cgraph__detail-dot"
          style={{ ["--lane-color" as string]: laneColor }}
          aria-hidden
        />
        <span className="syn-cgraph__detail-label">{t("label")}</span>
        <span className="syn-cgraph__detail-period">{t("period")}</span>
      </div>
      <p className="syn-cgraph__detail-name">{t("name")}</p>
      <p className="syn-cgraph__detail-role">{t("role")}</p>
      <p className="syn-cgraph__detail-proof">{t("proof")}</p>
      {caseHref ? (
        <TransitionLink href={caseHref} className="syn-cgraph__detail-case">
          {t("caseLink")} →
        </TransitionLink>
      ) : null}
    </div>
  );
}
