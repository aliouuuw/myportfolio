"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

type LocaleSwitcherProps = {
  locale: string;
  nav?: boolean;
  /** @deprecated Use `nav` — kept for mock pages */
  synthesis?: boolean;
};

export function LocaleSwitcher({
  locale,
  nav = false,
  synthesis = false,
}: LocaleSwitcherProps) {
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");
  const useNavStyle = nav || synthesis;

  const segments = pathname.split("/").filter(Boolean);
  const rest = segments.slice(1).join("/");
  const suffix = rest ? `/${rest}` : "";

  return (
    <div
      className={`hidden shrink-0 items-center gap-0.5 text-[11px] font-medium sm:flex ${
        useNavStyle ? "mono text-ink-muted" : ""
      }`}
      aria-label={t("ariaLabel")}
    >
      <LocaleLink
        code="en"
        current={locale}
        href={`/en${suffix}`}
        label={t("en")}
        nav={useNavStyle}
      />
      <span
        className={useNavStyle ? "text-ink-muted/60 select-none" : "text-ink-muted select-none"}
        aria-hidden
      >
        /
      </span>
      <LocaleLink
        code="fr"
        current={locale}
        href={`/fr${suffix}`}
        label={t("fr")}
        nav={useNavStyle}
      />
    </div>
  );
}

function LocaleLink({
  code,
  current,
  href,
  label,
  nav,
}: {
  code: string;
  current: string;
  href: string;
  label: string;
  nav: boolean;
}) {
  const isActive = code === current;
  if (isActive) {
    return (
      <span
        className={
          nav
            ? "px-1.5 py-0.5 text-ink-primary"
            : "rounded px-1.5 py-0.5 text-ink-primary"
        }
        aria-current="true"
      >
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      hrefLang={code}
      className={
        nav
          ? "px-1.5 py-0.5 transition-colors hover:text-ink-secondary"
          : "rounded px-1.5 py-0.5 text-ink-tertiary transition-colors hover:text-ink-primary"
      }
    >
      {label}
    </Link>
  );
}
