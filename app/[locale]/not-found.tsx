import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Page not found",
};

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("NotFoundPage");

  return (
    <div className="flex flex-col flex-1">
      <div className="px-6 py-24 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
        {/* 404 number */}
        <div className="text-7xl sm:text-9xl font-serif font-light text-ink-tertiary/30 mb-8">
          404
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink-primary mb-4">
          {t("title")}
        </h1>

        {/* Description */}
        <p className="text-base text-ink-secondary max-w-md mb-12 leading-relaxed">
          {t("description")}
        </p>

        {/* Back link */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center px-5 py-2.5 rounded-md bg-canvas-elevated border border-border text-sm font-medium text-ink-secondary hover:text-ink-primary hover:border-ink-tertiary/30 transition-colors"
        >
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}
