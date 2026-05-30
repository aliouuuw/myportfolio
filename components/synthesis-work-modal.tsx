"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import { CaseStudyMediaGallery } from "@/components/case-study-media-gallery";
import { SynButton } from "@/components/syn-button";
import { SYNTHESIS_WORK, type SynthesisWorkRow } from "@/lib/synthesis-data";

type SynthesisWorkModalProps = {
  work: SynthesisWorkRow | null;
  onClose: () => void;
  onNavigate: (workId: string) => void;
};

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function statusClass(status: SynthesisWorkRow["status"]): string {
  if (status === "ACTIVE") return "syn-work-modal-status--active";
  if (status === "SHIPPED") return "syn-work-modal-status--shipped";
  return "syn-work-modal-status--frozen";
}

function SynthesisWorkModalPanel({
  work,
  onClose,
  onNavigate,
}: {
  work: SynthesisWorkRow;
  onClose: () => void;
  onNavigate: (workId: string) => void;
}) {
  const t = useTranslations("HomePage.synthesis.work");
  const tRow = useTranslations(`HomePage.synthesis.work.rows.${work.id}`);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const workIndex = SYNTHESIS_WORK.findIndex((w) => w.id === work.id);
  const prevWork = workIndex > 0 ? SYNTHESIS_WORK[workIndex - 1] : null;
  const nextWork =
    workIndex >= 0 && workIndex < SYNTHESIS_WORK.length - 1
      ? SYNTHESIS_WORK[workIndex + 1]
      : null;

  const stackItems = tRow("stack")
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);

  const outcomes = tRow("outcomes")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [work.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft" && prevWork && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.closest(".syn-gallery__thumbs")) return;
        e.preventDefault();
        onNavigate(prevWork.id);
      }
      if (e.key === "ArrowRight" && nextWork && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.closest(".syn-gallery__thumbs")) return;
        e.preventDefault();
        onNavigate(nextWork.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [work.id, onClose, onNavigate, prevWork, nextWork]);

  const onBackdropClick = useCallback(() => onClose(), [onClose]);

  const onDiscuss = useCallback(() => {
    onClose();
    window.setTimeout(() => {
      document.getElementById("connect")?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  }, [onClose]);

  return (
    <div
      className="syn-work-modal-root"
      role="dialog"
      aria-modal
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="syn-work-modal-backdrop"
        onClick={onBackdropClick}
        aria-label={t("modalClose")}
      />

      <div className="syn-work-modal-panel" onClick={(e) => e.stopPropagation()}>
        <header className="syn-work-modal-toolbar">
          <div className="syn-work-modal-toolbar-meta mono">
            <span>{work.id}</span>
            <span className="syn-work-modal-toolbar-sep" aria-hidden>
              /
            </span>
            <span>{workIndex + 1}</span>
            <span className="syn-work-modal-toolbar-sep" aria-hidden>
              /
            </span>
            <span>{SYNTHESIS_WORK.length}</span>
          </div>

          <div className="syn-work-modal-toolbar-actions">
            <button
              type="button"
              className="syn-work-modal-page"
              onClick={() => prevWork && onNavigate(prevWork.id)}
              disabled={!prevWork}
              aria-label={t("modalPrev")}
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              type="button"
              className="syn-work-modal-page"
              onClick={() => nextWork && onNavigate(nextWork.id)}
              disabled={!nextWork}
              aria-label={t("modalNext")}
            >
              <span aria-hidden>›</span>
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="syn-work-modal-close"
              aria-label={t("modalClose")}
            >
              <span aria-hidden>×</span>
            </button>
          </div>
        </header>

        <div className="syn-work-modal-layout">
          <div className="syn-work-modal-media-col">
            <CaseStudyMediaGallery key={work.id} slug={work.slug} />
          </div>

          <div className="syn-work-modal-body">
            <div className="syn-work-modal-meta mono">
              <span
                className={`syn-work-modal-status ${statusClass(work.status)}`}
              >
                {t(`status.${work.status}`)}
              </span>
              <span className="syn-work-modal-type">
                {work.type.replace(/_/g, " ")}
              </span>
              <span className="syn-work-modal-year">{work.year}</span>
            </div>

            <h2 id={titleId} className="syn-work-modal-title">
              {tRow("name")}
            </h2>

            <p className="syn-work-modal-role">{tRow("role")}</p>

            <div className="syn-work-modal-copy">
              <p className="syn-work-modal-lead">{tRow("desc")}</p>
              <p className="syn-work-modal-detail">{tRow("detail")}</p>
            </div>

            {outcomes.length > 0 ? (
              <div className="syn-work-modal-outcomes">
                <p className="mono-eyebrow">{t("modalOutcomesLabel")}</p>
                <ul className="syn-work-modal-outcome-list">
                  {outcomes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="syn-work-modal-stack">
              <p className="mono-eyebrow">{t("modalStackLabel")}</p>
              <ul className="syn-work-modal-stack-list">
                {stackItems.map((item) => (
                  <li key={item} className="syn-work-modal-chip mono">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="syn-work-modal-actions">
              <SynButton variant="primary" onClick={onDiscuss}>
                {t("modalDiscuss")} →
              </SynButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SynthesisWorkModal({
  work,
  onClose,
  onNavigate,
}: SynthesisWorkModalProps) {
  const isClient = useIsClient();
  if (!work || !isClient) return null;

  return createPortal(
    <SynthesisWorkModalPanel
      work={work}
      onClose={onClose}
      onNavigate={onNavigate}
    />,
    document.body,
  );
}
