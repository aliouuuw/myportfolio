"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAbout } from "@/components/about-provider";

export function BottomMobileNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { openAbout } = useAbout();

  const locale = pathname.split("/")[1] || "en";
  const homePath = `/${locale}`;

  const isHome = pathname === homePath || pathname === `${homePath}/`;

  const links = [
    { href: `/${locale}/work`, label: t("workShort"), icon: WorkIcon },
    { href: `${homePath}#systems`, label: t("systemsShort"), icon: SystemsIcon, isHash: true },
    { href: `/${locale}/writing`, label: t("writingShort"), icon: WritingIcon },
    { href: `/${locale}/contact`, label: t("contactShort"), icon: ContactIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-canvas/95 backdrop-blur-md sm:hidden">
      <div className="flex h-14 items-stretch">
        {links.map((link) => {
          const isActive =
            !link.isHash &&
            (pathname === link.href || pathname.startsWith(`${link.href}/`));

          return (
            <div key={link.href} className="flex-1">
              {link.isHash && !isHome ? (
                <button
                  onClick={() => {
                    window.location.href = link.href;
                  }}
                  className={`flex h-full w-full flex-col items-center justify-center gap-1 text-xs ${
                    isActive ? "text-accent" : "text-ink-tertiary"
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </button>
              ) : (
                <Link
                  href={link.href}
                  className={`flex h-full w-full flex-col items-center justify-center gap-1 text-xs ${
                    isActive ? "text-accent" : "text-ink-tertiary"
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              )}
            </div>
          );
        })}
        <button
          onClick={openAbout}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-xs text-ink-tertiary"
        >
          <AboutIcon className="h-5 w-5" />
          <span>{t("aboutShort")}</span>
        </button>
      </div>
    </nav>
  );
}

function WorkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function SystemsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function WritingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function ContactIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function AboutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
