import Link from "next/link";
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
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-12 lg:px-24">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-sm text-xs leading-relaxed text-ink-tertiary">
            {t("tagline")}
          </p>
          <nav aria-label={t("linksAriaLabel")}>
            <ul className="flex flex-col gap-3 sm:items-end">
              {items.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-ink-secondary transition-colors duration-200 ease-out hover:text-ink-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="hairline mt-10" />
        <p className="mt-6 text-xs tabular-nums text-ink-muted">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
