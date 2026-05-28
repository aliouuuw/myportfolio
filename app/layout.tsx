import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

/**
 * Fraunces — variable serif with optical size axis.
 * Used for display text: hero sentences, case-study titles, essay headings.
 * Engraved feel at large sizes via low weight + tight tracking.
 */
const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

/**
 * Inter — clean, legible sans-serif for UI, body text, and labels.
 * Geist is preferred but Inter is the reliable Google Fonts fallback.
 */
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * JetBrains Mono — technical mono for numerical labels, code blocks,
 * margin notes, and the "Currently —" line.
 */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aliouwade.com";

/** Root shell only: locale-specific metadata lives under `app/[locale]/`. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Aliou Wade",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-canvas focus:text-ink-primary focus:border focus:border-border focus:rounded"
        >
          Skip to content
        </a>
        <main id="main-content" className="flex flex-col flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
