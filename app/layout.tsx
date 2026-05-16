import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

/**
 * Inter — clean, highly legible sans-serif for UI elements,
 * navigation, buttons, and technical content.
 */
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Lora — elegant serif for long-form content and editorial moments.
 * Adds warmth and premium feel to case studies and writing.
 */
const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

/** Root shell only: locale-specific metadata lives under `app/[locale]/`. */
export const metadata: Metadata = {
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
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
