import { redirect } from "next/navigation";

import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Legacy /about URLs open the homepage about modal via hash. */
export default async function AboutRedirectPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  redirect(`/${locale}#about`);
}
