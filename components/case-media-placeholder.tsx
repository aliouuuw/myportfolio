"use client";

import { useTranslations } from "next-intl";

type CaseMediaPlaceholderProps = {
  /** MDX / case-study slug when known */
  slug?: string | null;
  variant?: "featured" | "thumb" | "story" | "modal";
  className?: string;
};

export function CaseMediaPlaceholder({
  slug,
  variant = "featured",
  className = "",
}: CaseMediaPlaceholderProps) {
  const t = useTranslations("HomePage.synthesis.media");

  return (
    <div
      className={`syn-media-placeholder syn-media-placeholder--${variant} ${className}`.trim()}
      role="img"
      aria-label={t("ariaLabel")}
    >
      <div className="syn-media-placeholder__pattern" aria-hidden />
      <div className="syn-media-placeholder__wash" aria-hidden />
      <div className="syn-media-placeholder__content">
        <p className="syn-media-placeholder__label mono">{t("label")}</p>
        <p className="syn-media-placeholder__caption">{t("caption")}</p>
        {slug ? (
          <p className="syn-media-placeholder__slug mono" aria-hidden>
            {slug}
          </p>
        ) : null}
      </div>
    </div>
  );
}
