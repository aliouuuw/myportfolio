"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { TransitionLink } from "@/components/transition-link";

const LOCALES = ["en", "fr"] as const;

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

  if (!useNavStyle) {
    return (
      <div
        className="locale-switcher inline-flex shrink-0 items-center gap-0.5 text-[11px] font-medium"
        aria-label={t("ariaLabel")}
      >
        {LOCALES.map((code, index) => (
          <span key={code} className="inline-flex items-center gap-0.5">
            {index > 0 ? (
              <span className="text-ink-muted select-none" aria-hidden>
                /
              </span>
            ) : null}
            <LocaleSegment
              code={code}
              current={locale}
              href={`/${code}${suffix}`}
              label={t(code)}
              nav={false}
            />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="locale-switcher locale-switcher--nav"
      role="group"
      aria-label={t("ariaLabel")}
    >
      {LOCALES.map((code) => (
        <LocaleSegment
          key={code}
          code={code}
          current={locale}
          href={`/${code}${suffix}`}
          label={t(code)}
          nav
        />
      ))}
    </div>
  );
}

function LocaleSegment({
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

  if (!nav) {
    if (isActive) {
      return (
        <span className="rounded px-1.5 py-0.5 text-ink-primary" aria-current="true">
          {label}
        </span>
      );
    }
    return (
      <TransitionLink
        href={href}
        hrefLang={code}
        className="rounded px-1.5 py-0.5 text-ink-tertiary transition-colors hover:text-ink-primary"
      >
        {label}
      </TransitionLink>
    );
  }

  return (
    <TransitionLink
      href={href}
      hrefLang={code}
      className={`locale-switcher__segment ${isActive ? "locale-switcher__segment--active" : ""}`}
      aria-current={isActive ? "true" : undefined}
    >
      {label}
    </TransitionLink>
  );
}
