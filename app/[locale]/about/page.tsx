import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  };
}

export default async function AboutPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("AboutPage");

  return (
    <div className="flex flex-col flex-1">
      <div className="px-6 pt-24 pb-16 sm:px-12 lg:px-24 max-w-3xl mx-auto w-full">
        <p className="text-xs font-medium tracking-widest uppercase text-ink-tertiary mb-6">
          {t("title")}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-ink-primary leading-tight">
          {t("hero.line1")}
          <br />
          <span className="text-ink-tertiary">{t("hero.line2")}</span>
        </h1>
      </div>

      <div className="hairline max-w-3xl mx-auto px-6 sm:px-12 lg:px-24 w-full" />

      {/* Section 1 — Who I am */}
      <section className="px-6 py-20 sm:px-12 lg:px-24 max-w-3xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:gap-16">
          <div className="sm:w-40 shrink-0 mb-6 sm:mb-0">
            <span className="text-xs font-medium tracking-widest uppercase text-ink-tertiary">
              {t("section1.heading")}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-base leading-relaxed text-ink-secondary">
              {t("section1.body")}
            </p>
          </div>
        </div>
      </section>

      <div className="hairline max-w-3xl mx-auto px-6 sm:px-12 lg:px-24 w-full" />

      {/* Section 2 — What I build */}
      <section className="px-6 py-20 sm:px-12 lg:px-24 max-w-3xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:gap-16">
          <div className="sm:w-40 shrink-0 mb-6 sm:mb-0">
            <span className="text-xs font-medium tracking-widest uppercase text-ink-tertiary">
              {t("section2.heading")}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-base leading-relaxed text-ink-secondary mb-10">
              {t("section2.body")}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 w-1 h-1 rounded-full bg-ink-tertiary shrink-0" />
                <p className="text-sm text-ink-secondary">{t("section2.currentWork")}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-1 h-1 rounded-full bg-ink-tertiary shrink-0" />
                <p className="text-sm text-ink-secondary">{t("section2.pastWork")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hairline max-w-3xl mx-auto px-6 sm:px-12 lg:px-24 w-full" />

      {/* Section 3 — Beyond the work */}
      <section className="px-6 py-20 sm:px-12 lg:px-24 max-w-3xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:gap-16">
          <div className="sm:w-40 shrink-0 mb-6 sm:mb-0">
            <span className="text-xs font-medium tracking-widest uppercase text-ink-tertiary">
              {t("section3.heading")}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-base leading-relaxed text-ink-secondary">
              {t("section3.body")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
