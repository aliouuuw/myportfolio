"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import type { LedgerCase } from "./mock-config";

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export type WorkDetailMeta = {
  tags: string[];
  outcome: string;
  stack: string;
};

export type WorkLedgerEntry = LedgerCase & {
  meta: WorkDetailMeta;
};

interface WorkLedgerProps {
  projects: WorkLedgerEntry[];
}

const STATUS_LABEL: Record<LedgerCase["status"], string> = {
  active: "In production",
  shipped: "Shipped",
  archived: "Archived",
};

/** Partial height revealed on hover (desktop) */
const PEEK_HEIGHT = 128;

const SPRING_OPEN = { ease: "power3.out", duration: 0.4 };
const SPRING_PEEK = { ease: "power3.out", duration: 0.3 };
const SPRING_CLOSE = { ease: "power2.inOut", duration: 0.28 };

function canHoverPreview(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Accordion Ledger with hover peek.
 * Desktop: rows spring-open slightly on hover; click locks full expand.
 */
export function WorkLedger({ projects }: WorkLedgerProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [peekId, setPeekId] = useState<string | null>(null);

  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const innerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openIdRef = useRef<string | null>(null);

  useEffect(() => {
    openIdRef.current = openId;
  }, [openId]);

  const killPanelTween = (id: string) => {
    const el = contentRefs.current[id];
    const inner = innerRefs.current[id];
    if (el) gsap.killTweensOf(el);
    if (inner) gsap.killTweensOf(inner);
  };

  const measurePanel = (el: HTMLDivElement) => {
    const prevHeight = el.style.height;
    const prevDisplay = el.style.display;
    el.style.display = "block";
    el.style.height = "auto";
    const full = el.scrollHeight;
    el.style.height = prevHeight;
    el.style.display = prevDisplay;
    return full;
  };

  const animateInnerIn = (id: string, peek: boolean) => {
    const inner = innerRefs.current[id];
    if (!inner) return;
    gsap.fromTo(
      inner,
      { opacity: peek ? 0.55 : 0.72, y: peek ? 10 : 14 },
      {
        opacity: 1,
        y: 0,
        duration: peek ? SPRING_PEEK.duration : SPRING_OPEN.duration,
        ease: peek ? SPRING_PEEK.ease : SPRING_OPEN.ease,
      },
    );
    if (!peek) typeInProof(id);
  };

  const typeInProof = (id: string) => {
    const inner = innerRefs.current[id];
    if (!inner) return;
    const target = inner.querySelector<HTMLElement>("[data-typewriter]");
    if (!target) return;
    if (target.dataset.typed === "true") return;
    const full = target.dataset.fullText ?? target.textContent ?? "";
    target.dataset.fullText = full;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      target.textContent = full;
      target.dataset.typed = "true";
      return;
    }
    target.textContent = "";
    target.dataset.typed = "true";
    const total = full.length;
    const obj = { i: 0 };
    gsap.to(obj, {
      i: total,
      duration: Math.min(0.9, 0.012 * total),
      ease: "none",
      onUpdate: () => {
        target.textContent = full.slice(0, Math.floor(obj.i));
      },
      onComplete: () => {
        target.textContent = full;
      },
    });
  };

  const resetInner = (id: string) => {
    const inner = innerRefs.current[id];
    if (!inner) return;
    gsap.killTweensOf(inner);
    gsap.set(inner, { opacity: 1, y: 0 });
  };

  const closePanel = useCallback((id: string, onDone?: () => void) => {
    const el = contentRefs.current[id];
    if (!el) return;

    killPanelTween(id);
    gsap.to(el, {
      height: 0,
      ...SPRING_CLOSE,
      onComplete: () => {
        el.style.display = "none";
        el.style.height = "";
        resetInner(id);
        onDone?.();
      },
    });
  }, []);

  const openPanel = useCallback(
    (
      id: string,
      targetHeight: number,
      spring: typeof SPRING_OPEN,
      isPeek: boolean,
      onDone?: () => void,
    ) => {
      const el = contentRefs.current[id];
      if (!el) return;

      killPanelTween(id);
      el.style.display = "block";
      el.style.overflow = "hidden";

      const current = el.offsetHeight;
      el.style.height = `${current}px`;

      gsap.to(el, {
        height: targetHeight,
        ...spring,
        onComplete: () => {
          if (openIdRef.current === id) {
            el.style.height = "auto";
          }
          onDone?.();
        },
      });

      animateInnerIn(id, isPeek);
    },
    [],
  );

  const peek = useCallback(
    (id: string) => {
      if (!canHoverPreview()) return;
      if (openIdRef.current === id) return;

      const el = contentRefs.current[id];
      if (!el) return;

      const full = measurePanel(el);
      const target = Math.min(PEEK_HEIGHT, Math.max(72, full * 0.22));

      openPanel(id, target, SPRING_PEEK, true);
      setPeekId(id);
    },
    [openPanel],
  );

  const unpeek = useCallback(
    (id: string) => {
      if (openIdRef.current === id) return;
      closePanel(id, () => setPeekId((current) => (current === id ? null : current)));
    },
    [closePanel],
  );

  const toggle = (id: string) => {
    const isOpening = openId !== id;
    const prevOpen = openId;

    if (prevOpen && prevOpen !== id) {
      closePanel(prevOpen);
    }

    if (!isOpening && openId) {
      closePanel(openId);
      setOpenId(null);
      setPeekId(null);
      return;
    }

    setOpenId(id);
    setPeekId(null);

    const el = contentRefs.current[id];
    if (!el) return;

    const full = measurePanel(el);
    openPanel(id, full, SPRING_OPEN, false);
  };

  const handleItemEnter = (id: string) => {
    if (!canHoverPreview()) return;

    if (peekId && peekId !== id && peekId !== openIdRef.current) {
      unpeek(peekId);
    }

    peek(id);
  };

  const handleItemLeave = (id: string) => {
    if (!canHoverPreview()) return;
    if (openIdRef.current === id) return;
    unpeek(id);
  };

  const goToCase = useCallback((href: string) => {
    if (typeof document === "undefined") return;
    const doc = document as DocWithVT;
    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        window.location.assign(href);
      });
    } else {
      window.location.assign(href);
    }
  }, []);

  return (
    <div className="work-accordion">
      {projects.map((project, index) => {
        const isOpen = openId === project.id;
        const isPeeking = peekId === project.id && !isOpen;
        const numeral = String(index + 1).padStart(2, "0");

        return (
          <article
            key={project.id}
            className={`work-accordion-item${isOpen ? " is-open" : ""}${isPeeking ? " is-peeking" : ""}`}
            onMouseEnter={() => handleItemEnter(project.id)}
            onMouseLeave={() => handleItemLeave(project.id)}
          >
            <button
              type="button"
              className="work-accordion-header"
              aria-expanded={isOpen}
              aria-controls={`work-content-${project.id}`}
              onClick={() => toggle(project.id)}
            >
              <span className="work-accordion-numeral" aria-hidden>
                {numeral}
              </span>

              <div className="work-accordion-header-main">
                <span className="work-accordion-title">{project.title}</span>
                <span className="work-accordion-domain">{project.domain}</span>
              </div>

              <div className="work-accordion-header-meta">
                <span className="work-accordion-period">{project.period}</span>
                <span className={`work-accordion-status ${project.status}`}>
                  <span className={`status-dot ${project.status}`} aria-hidden />
                  {STATUS_LABEL[project.status]}
                </span>
                <span className="work-accordion-chevron" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </button>

            <div
              id={`work-content-${project.id}`}
              ref={(el) => {
                contentRefs.current[project.id] = el;
              }}
              className="work-accordion-content"
              style={{ display: "none", overflow: "hidden" }}
            >
              {isPeeking && (
                <button
                  type="button"
                  className="work-accordion-peek-overlay"
                  onClick={() => toggle(project.id)}
                  aria-label={`Open full entry for ${project.title}`}
                >
                  <span className="work-accordion-peek-hint">Open full entry</span>
                </button>
              )}

              <div
                ref={(el) => {
                  innerRefs.current[project.id] = el;
                }}
                className="work-accordion-content-inner"
              >
                <div
                  className="work-accordion-media"
                  style={{ viewTransitionName: `work-media-${project.id}` } as React.CSSProperties}
                >
                  <div className="work-media-placeholder" aria-hidden>
                    <div className="work-media-pattern" />
                  </div>
                  <span className="work-media-badge">
                    {project.mediaSlots[0]?.label ?? "Preview"}
                  </span>
                </div>

                <div className="work-accordion-text">
                  <p
                    className="work-accordion-proof"
                    data-typewriter
                    data-full-text={project.proofClaim}
                  >
                    {project.proofClaim}
                  </p>

                  <p className="work-accordion-summary">{project.summary}</p>

                  <dl className="work-accordion-meta">
                    <div>
                      <dt>Outcome</dt>
                      <dd>{project.meta.outcome}</dd>
                    </div>
                    <div>
                      <dt>Stack</dt>
                      <dd>{project.meta.stack}</dd>
                    </div>
                  </dl>

                  {project.meta.tags.length > 0 && (
                    <ul className="work-accordion-tags" aria-label="Technologies">
                      {project.meta.tags.map((t) => (
                        <li key={t} className="work-accordion-tag">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="work-accordion-action">
                    <a
                      href={`/work/${project.id}`}
                      className="work-accordion-cta"
                      onClick={(e) => {
                        e.preventDefault();
                        goToCase(`/work/${project.id}`);
                      }}
                    >
                      Read case study
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path
                          d="M6 12l4-4-4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
