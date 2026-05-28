import { redirect } from "next/navigation";

/** Legacy `/contact` URLs → homepage connect section. */
export default async function ContactRedirect(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  redirect(`/${locale}#connect`);
}
