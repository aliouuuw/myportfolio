"use client";

import { usePathname } from "next/navigation";

import { SynthesisTopNav } from "@/components/synthesis-top-nav";
import { getLocaleFromPathname } from "@/lib/synthesis-routes";

export function TopNav() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  return <SynthesisTopNav locale={locale} pathname={pathname} />;
}
