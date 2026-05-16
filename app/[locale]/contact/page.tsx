import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ContactForm } from "@/components/contact-form";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("ContactPage");
  const footerT = await getTranslations("Footer");

  const emailHref = footerT("emailHref");
  const whatsappHref = footerT("whatsappHref");
  // Extract email from mailto: for display
  const emailDisplay = emailHref.replace("mailto:", "");

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
    <div className="px-6 py-24 sm:px-12 lg:px-24 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-16 max-w-xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink-primary mb-4">
          {t("title")}
        </h1>
        <p className="text-base leading-relaxed text-ink-secondary">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
        {/* Left: direct contact */}
        <div>
          <h2 className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-6">
            {t("directTitle")}
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-ink-tertiary mb-1">{t("email")}</p>
              <a
                href={emailHref}
                className="text-sm text-ink-primary hover:text-ink-secondary transition-colors underline underline-offset-2 decoration-border"
              >
                {emailDisplay}
              </a>
            </div>
            <div>
              <p className="text-xs text-ink-tertiary mb-1">{t("whatsapp")}</p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-primary hover:text-ink-secondary transition-colors underline underline-offset-2 decoration-border"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Right: contact form */}
        <ContactForm translations={formTranslations} />
      </div>
    </div>
  );
}
