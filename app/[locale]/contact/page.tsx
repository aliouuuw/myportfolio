import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ContactForm } from "@/components/contact-form";
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
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates: {
      canonical: buildCanonical(locale, "/contact"),
    },
  };
}

export default async function ContactPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("ContactPage");

  const formTranslations = {
    formTitle: t("formTitle"),
    name: t("name"),
    emailLabel: t("emailLabel"),
    message: t("message"),
    namePlaceholder: t("namePlaceholder"),
    emailPlaceholder: t("emailPlaceholder"),
    messagePlaceholder: t("messagePlaceholder"),
    submit: t("submit"),
    submitting: t("submitting"),
    successTitle: t("successTitle"),
    successBody: t("successBody"),
    errorBody: t("errorBody"),
    validation: {
      nameRequired: t("validation.nameRequired"),
      emailRequired: t("validation.emailRequired"),
      messageRequired: t("validation.messageRequired"),
    },
  };

  return (
    <div className="flex flex-col flex-1 px-6 py-24 sm:px-12 lg:px-24 max-w-3xl mx-auto w-full">
      <p className="label-micro mb-8">{t("stamp")}</p>

      {/* Large serif headline */}
      <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal tracking-tight text-ink-primary leading-tight mb-4">
        {t("title")}
      </h1>

      {/* One-line positioning */}
      <p className="text-base text-ink-secondary mb-16 max-w-[68ch]">
        {t("subtitle")}
      </p>

      {/* Three numbered contact methods */}
      <div className="flex flex-col gap-8 mb-16">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[11px] font-medium text-ink-tertiary tracking-tight w-6">
            01
          </span>
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-tertiary mb-1">
              {t("email")}
            </p>
            <a
              href="mailto:wadealiou00@gmail.com"
              className="text-sm text-ink-primary hover:text-accent transition-colors underline underline-offset-4 decoration-border hover:decoration-accent"
            >
              wadealiou00@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[11px] font-medium text-ink-tertiary tracking-tight w-6">
            02
          </span>
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-tertiary mb-1">
              {t("whatsapp")}
            </p>
            <a
              href="https://wa.me/221777228845"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-primary hover:text-accent transition-colors underline underline-offset-4 decoration-border hover:decoration-accent"
            >
              +221 77 722 88 45
            </a>
          </div>
        </div>

        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[11px] font-medium text-ink-tertiary tracking-tight w-6">
            03
          </span>
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-tertiary mb-1">
              {t("calendar")}
            </p>
            <p className="text-sm text-ink-tertiary italic">{t("calendarPlaceholder")}</p>
          </div>
        </div>
      </div>

      <div className="hairline mb-16" />

      {/* Contact form — below the fold */}
      <ContactForm translations={formTranslations} />
    </div>
  );
}
