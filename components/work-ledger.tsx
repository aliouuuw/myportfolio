"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";

import type { WorkLedgerProject } from "@/lib/work-ledger-types";

interface WorkLedgerProps {
  locale: string;
  projects: WorkLedgerProject[];
}

const SPRING = { ease: "power3.out", duration: 0.35 };

export function WorkLedger({ locale, projects }: WorkLedgerProps) {
  const t = useTranslations("WorkLedger");
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggle = useCallback((id: string) => {
    const isOpening = openId !== id;

    if (openId && openId !== id) {
      const prevEl = contentRefs.current[openId];
      if (prevEl) {
        gsap.to(prevEl, {
          height: 0,
          opacity: 0,
          ...SPRING,
          onComplete: () => {
            prevEl.style.display = "none";
          },
        });
      }
    }

    if (!isOpening && openId) {
      const el = contentRefs.current[openId];
      if (el) {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          ...SPRING,
          onComplete: () => {
            el.style.display = "none";
          },
        });
      }
      setOpenId(null);
      return;
    }

    setOpenId(id);
    const el = contentRefs.current[id];
    if (el) {
      el.style.display = "block";
      const height = el.scrollHeight;
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height, opacity: 1, ...SPRING }
      );
    }
  }, [openId]);

  const goToCase = useCallback(
    (href: string) => {
      if (typeof document === "undefined") return;
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { finished: Promise<void> };
      };
      const navigate = () => router.push(href);
      if (doc.startViewTransition) {
        doc.startViewTransition(navigate);
      } else {
        navigate();
      }
    },
    [router]
  );

  return (
    <div className="border-t border-border">
      {projects.map((project, index) => {
        const isOpen = openId === project.id;
        const numeral = String(index + 1).padStart(2, "0");
        const caseHref = `/${locale}/work/${project.id}`;

        return (
          <article
            key={project.id}
            className="border-b border-border"
          >
            <button
              type="button"
              className="flex w-full items-center gap-4 py-5 text-left transition-colors hover:bg-canvas-elevated/50"
              aria-expanded={isOpen}
              aria-controls={`work-content-${project.id}`}
              onClick={() => toggle(project.id)}
            >
              <span className="w-8 font-mono text-lg font-light text-ink-muted">
                {numeral}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-ink-primary">
                  {project.title}
                </h3>
                <p className="truncate text-xs uppercase tracking-wide text-ink-tertiary">
                  {project.domain}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-ink-muted">
                <span className="hidden sm:inline">{project.period}</span>
                <StatusBadge status={project.status} />
                <span
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronIcon />
                </span>
              </div>
            </button>

            <div
              id={`work-content-${project.id}`}
              ref={(el) => {
                contentRefs.current[project.id] = el;
              }}
              className="overflow-hidden"
              style={{ display: "none", height: 0, opacity: 0 }}
            >
              <div className="grid gap-6 pb-6 pt-2 sm:grid-cols-[1fr_1.2fr] sm:gap-8">
                {/* Visual placeholder - will be replaced with actual content */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-canvas-elevated">
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <p className="text-center text-xs uppercase tracking-wide text-ink-muted">
                      {t("mediaPlaceholder")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <p className="text-lg font-light italic text-ink-primary">
                    {project.proofClaim}
                  </p>

                  <p className="text-sm leading-relaxed text-ink-secondary">
                    {project.summary}
                  </p>

                  <div className="mt-auto pt-4">
                    <p className="mb-2 text-xs uppercase tracking-wide text-ink-tertiary">
                      {t("stackLabel")}
                    </p>
                    <p className="text-sm text-ink-secondary">
                      {project.meta.stack}
                    </p>
                  </div>

                  <a
                    href={caseHref}
                    className="group mt-2 inline-flex items-center gap-2 text-sm font-medium text-ink-primary transition-colors hover:text-accent"
                    onClick={(e) => {
                      e.preventDefault();
                      goToCase(caseHref);
                    }}
                  >
                    {t("readCaseStudy")}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: WorkLedgerProject["status"] }) {
  const t = useTranslations("WorkLedger");

  const styles = {
    active: "border-accent/30 text-accent",
    shipped: "border-success/30 text-success",
    archived: "border-ink-muted/30 text-ink-muted",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[10px] uppercase tracking-wider ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "active"
            ? "bg-accent"
            : status === "shipped"
            ? "bg-success"
            : "bg-ink-muted"
        }`}
      />
      {t(`status.${status}`)}
    </span>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
