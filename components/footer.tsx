import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("Footer");

  const items = [
    { href: t("githubHref"), label: t("githubLabel") },
    { href: t("linkedinHref"), label: t("linkedinLabel") },
    { href: t("emailHref"), label: t("emailLabel") },
    { href: t("whatsappHref"), label: t("whatsappLabel") },
  ] as const;

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-[var(--n-page,72rem)] px-[var(--n-gutter,1.25rem)] py-10 sm:py-12">
        <p className="max-w-[42ch] text-sm leading-relaxed text-ink-secondary mb-6">
          {t("tagline")}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs tabular-nums text-ink-muted">{t("copyright")}</p>
          <nav aria-label={t("linksAriaLabel")}>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {items.map(({ href, label }) => {
                const isExternal = href.startsWith("http");
                return (
                  <li key={label}>
                    <a
                      href={href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="text-xs text-ink-tertiary transition-colors duration-200 hover:text-ink-primary"
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
