import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { TopNav } from "@/components/top-nav";
import { BottomMobileNav } from "@/components/bottom-mobile-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aliouwade.com";

const ogLocaleMap: Record<string, string> = {
  en: "en_US",
  fr: "fr_FR",
};

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "Metadata" });

  const title = t("title");
  const description = t("description");
  const ogLocale = ogLocaleMap[locale] ?? "en_US";
  const alternateLocale = locale === "en" ? "fr_FR" : "en_US";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        fr: `${SITE_URL}/fr`,
      },
    },
    openGraph: {
      title,
      description,
      locale: ogLocale,
      alternateLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(0.96 0.005 240)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.16 0.010 248)" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <TopNav />
            {/* Padding top for fixed header, padding bottom for mobile bottom nav */}
            <main className="flex flex-1 flex-col pt-14 pb-14 sm:pb-0">
              {children}
            </main>
            <Footer />
            <BottomMobileNav />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
