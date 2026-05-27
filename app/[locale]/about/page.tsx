import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildCanonical } from "@/lib/metadata";
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
    alternates: {
      canonical: buildCanonical(locale, "/about"),
    },
  };
}

export default async function AboutPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("AboutPage");

  return (
    <div className="flex flex-col flex-1 px-6 py-24 sm:px-12 lg:px-24 max-w-3xl mx-auto w-full">
      <p className="label-micro mb-8">Operator record</p>

      {/* Name + role */}
      <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-normal tracking-tight text-ink-primary leading-tight mb-3">
        {t("name")}
      </h1>
      <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-tertiary mb-10">
        {t("role")}
      </p>

      {/* First-person operator paragraph */}
      <div className="text-base leading-relaxed text-ink-secondary max-w-[68ch] mb-12">
        <p>{t("bio")}</p>
      </div>

      <div className="hairline mb-12" />

      {/* Operator context */}
      <div className="text-base leading-relaxed text-ink-secondary max-w-[68ch] mb-12">
        <p>{t("context")}</p>
      </div>

      <div className="hairline mb-12" />

      {/* Currently */}
      <div className="flex items-center gap-3 mb-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
        <p className="text-sm text-ink-secondary">{t("currently")}</p>
      </div>

      {/* Languages */}
      <div className="mb-10">
        <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-tertiary mb-3">
          {t("languagesLabel")}
        </p>
        <p className="text-sm text-ink-secondary">{t("languages")}</p>
      </div>

      {/* Contact links */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <a
          href="mailto:wadealiou00@gmail.com"
          className="text-sm text-ink-secondary hover:text-ink-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-ink-tertiary"
        >
          wadealiou00@gmail.com
        </a>
        <a
          href="https://wa.me/221777228845"
          className="text-sm text-ink-secondary hover:text-ink-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-ink-tertiary"
        >
          WhatsApp
        </a>
        <a
          href="https://www.linkedin.com/in/aliouuuw"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ink-secondary hover:text-ink-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-ink-tertiary"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
