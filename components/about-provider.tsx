"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import { AboutModal } from "@/components/about-modal";

type AboutContextValue = {
  openAbout: () => void;
  closeAbout: () => void;
};

const AboutContext = createContext<AboutContextValue | null>(null);

export function useAbout(): AboutContextValue {
  const ctx = useContext(AboutContext);
  if (!ctx) {
    throw new Error("useAbout must be used within AboutProvider");
  }
  return ctx;
}

/** Optional hook for nav items outside provider tree edge cases */
export function useAboutOptional(): AboutContextValue | null {
  return useContext(AboutContext);
}

interface AboutProviderProps {
  children: React.ReactNode;
}

export function AboutProvider({ children }: AboutProviderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const openAbout = useCallback(() => {
    setOpen(true);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `${pathname}#about`);
    }
  }, [pathname]);

  const closeAbout = useCallback(() => {
    setOpen(false);
    if (typeof window !== "undefined" && window.location.hash === "#about") {
      window.history.replaceState(
        null,
        "",
        `${pathname}${window.location.search}`,
      );
    }
  }, [pathname]);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#about") {
        setOpen(true);
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAbout();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeAbout]);

  const value = useMemo(
    () => ({ openAbout, closeAbout }),
    [openAbout, closeAbout],
  );

  return (
    <AboutContext.Provider value={value}>
      {children}
      <AboutModal open={open} onClose={closeAbout} />
    </AboutContext.Provider>
  );
}
