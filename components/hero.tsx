import Link from "next/link";
import { getTranslations } from "next-intl/server";

type HeroProps = {
  locale: string;
};

export async function Hero({ locale }: HeroProps) {
  const t = await getTranslations("HomePage.hero");

  return (
    <section className="flex flex-col items-start justify-center px-6 pt-32 pb-24 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
      <p className="text-xs font-medium tracking-widest uppercase text-ink-tertiary mb-8">
        {t("role")}
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight tracking-tight text-ink-primary mb-8 max-w-3xl">
        {t("tagline")}
      </h1>
      <p className="text-lg sm:text-xl leading-relaxed text-ink-secondary max-w-2xl mb-12">
        {t("description")}
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href={`/${locale}/work`}
          className="inline-flex items-center justify-center h-10 px-6 rounded bg-ink-primary text-canvas text-sm font-medium transition-colors hover:bg-ink-secondary"
        >
          {t("ctaWork")}
        </Link>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center justify-center h-10 px-6 rounded border border-border text-ink-primary text-sm font-medium transition-colors hover:border-border-strong hover:bg-canvas-elevated"
        >
          {t("ctaContact")}
        </Link>
      </div>
    </section>
  );
}
