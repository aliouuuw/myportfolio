import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("Footer");

  const items = [
    { href: t("emailHref"), label: t("emailLabel") },
    { href: t("whatsappHref"), label: t("whatsappLabel") },
    { href: t("linkedinHref"), label: t("linkedinLabel") },
  ] as const;

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-8 sm:px-12 lg:px-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs tabular-nums text-ink-muted">
            {t("copyright")}
          </p>
          <nav aria-label={t("linksAriaLabel")}>
            <ul className="flex items-center gap-6">
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
