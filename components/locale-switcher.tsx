"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

type LocaleSwitcherProps = {
  locale: string;
};

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");

  const segments = pathname.split("/").filter(Boolean);
  const rest = segments.slice(1).join("/");
  const suffix = rest ? `/${rest}` : "";

  return (
    <div
      className="flex shrink-0 items-center gap-1.5 text-xs font-medium tabular-nums"
      aria-label={t("ariaLabel")}
    >
      <LocaleLink
        code="en"
        current={locale}
        href={`/en${suffix}`}
        label={t("en")}
      />
      <span className="text-ink-muted select-none" aria-hidden>
        |
      </span>
      <LocaleLink
        code="fr"
        current={locale}
        href={`/fr${suffix}`}
        label={t("fr")}
      />
    </div>
  );
}

function LocaleLink({
  code,
  current,
  href,
  label,
}: {
  code: string;
  current: string;
  href: string;
  label: string;
}) {
  if (code === current) {
    return (
      <span className="text-ink-primary" aria-current="true">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      hrefLang={code}
      className="text-ink-tertiary transition-colors duration-200 ease-out hover:text-ink-primary"
    >
      {label}
    </Link>
  );
}
