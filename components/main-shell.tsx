"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { BottomMobileNav } from "@/components/bottom-mobile-nav";
import { Footer } from "@/components/footer";
import { TopNav } from "@/components/top-nav";
import {
  getLocaleFromPathname,
  isSynthesisHomePath,
  isSynthesisShellPath,
} from "@/lib/synthesis-routes";

export function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isHome = isSynthesisHomePath(pathname, locale);
  const isSynthesisShell = isSynthesisShellPath(pathname);

  return (
    <>
      <TopNav />
      <main className="flex flex-1 flex-col pt-0 pb-14 sm:pb-0">{children}</main>
      {!isHome ? <Footer synthesis={isSynthesisShell} /> : null}
      <BottomMobileNav hideOnHome={isHome} />
    </>
  );
}
