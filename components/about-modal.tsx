"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  const t = useTranslations("AboutPage");
  const tCommon = useTranslations("common");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="about-modal-root"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
        tabIndex={-1}
        className="about-modal-panel site-ledger"
      >
        <header className="about-modal-head">
          <div className="about-modal-portrait" aria-hidden>
            <span className="about-modal-portrait-label">
              {t("photoPlaceholder")}
            </span>
          </div>
          <div className="about-modal-intro">
            <p className="label">{t("modalEyebrow")}</p>
            <h2 id="about-modal-title" className="about-modal-name">
              {t("name")}
            </h2>
            <p className="about-modal-role">{t("role")}</p>
          </div>
          <button
            type="button"
            className="about-modal-close btn"
            onClick={onClose}
            aria-label={tCommon("close")}
          >
            ×
          </button>
        </header>

        <div className="about-modal-body">
          <p className="about-modal-bio">{t("bio")}</p>
          <p className="about-modal-context">{t("context")}</p>

          <div className="about-modal-currently">
            <span className="status-dot active" aria-hidden />
            <p>{t("currently")}</p>
          </div>

          <div className="about-modal-languages">
            <p className="label-sm">{t("languagesLabel")}</p>
            <p>{t("languages")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
