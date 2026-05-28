"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { BottomMobileNav } from "@/components/bottom-mobile-nav";
import { Footer } from "@/components/footer";
import { TopNav } from "@/components/top-nav";
import { isSynthesisShellPath } from "@/lib/synthesis-routes";

export function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSynthesisShell = isSynthesisShellPath(pathname);

  return (
    <>
      <TopNav />
      <main id="main-content" className="flex flex-1 flex-col pt-0 pb-14 sm:pb-0">
        {children}
      </main>
      <Footer synthesis={isSynthesisShell} />
      <BottomMobileNav />
    </>
  );
}
