"use client";

import { useTranslations } from "next-intl";

type FooterProps = {
  synthesis?: boolean;
};

export function Footer({ synthesis = false }: FooterProps) {
  const t = useTranslations("Footer");

  const items = [
    { href: t("githubHref"), label: t("githubLabel") },
    { href: t("linkedinHref"), label: t("linkedinLabel") },
    { href: t("emailHref"), label: t("emailLabel") },
    { href: t("whatsappHref"), label: t("whatsappLabel") },
  ] as const;

  return (
    <footer
      className={
        synthesis
          ? "mt-auto border-t border-syn-border bg-syn-canvas"
          : "mt-auto border-t border-border"
      }
    >
      <div
        className={
          synthesis
            ? "mx-auto max-w-[1400px] px-4 py-8 md:px-6 lg:px-8"
            : "mx-auto max-w-[var(--n-page,72rem)] px-[var(--n-gutter,1.25rem)] py-10 sm:py-12"
        }
      >
        {!synthesis ? (
          <p className="mb-6 max-w-[42ch] text-sm leading-relaxed text-ink-secondary">
            {t("tagline")}
          </p>
        ) : null}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p
            className={
              synthesis
                ? "mono text-xs text-syn-ink-faint"
                : "text-xs tabular-nums text-ink-muted"
            }
          >
            {t("copyright")}
          </p>
          <nav aria-label={t("linksAriaLabel")}>
            <ul
              className={
                synthesis
                  ? "flex flex-wrap items-center gap-x-5 gap-y-2"
                  : "flex flex-wrap items-center gap-x-6 gap-y-2"
              }
            >
              {items.map(({ href, label }) => {
                const isExternal = href.startsWith("http");
                return (
                  <li key={label}>
                    <a
                      href={href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className={
                        synthesis
                          ? "mono text-[10px] uppercase tracking-widest text-syn-ink-subtle transition-colors hover:text-syn-ink-muted"
                          : "text-xs text-ink-tertiary transition-colors duration-200 hover:text-ink-primary"
                      }
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
