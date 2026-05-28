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
      className="flex shrink-0 items-center gap-0.5 text-[12px] font-medium"
      aria-label={t("ariaLabel")}
    >
      <LocaleLink code="en" current={locale} href={`/en${suffix}`} label={t("en")} />
      <span className="text-ink-muted select-none" aria-hidden>·</span>
      <LocaleLink code="fr" current={locale} href={`/fr${suffix}`} label={t("fr")} />
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
  const isActive = code === current;
  if (isActive) {
    return (
      <span
        className="px-1.5 py-0.5 rounded text-ink-primary"
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
      className="px-1.5 py-0.5 rounded text-ink-tertiary hover:text-ink-primary transition-colors"
    >
      {label}
    </Link>
  );
}
