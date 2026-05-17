"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

const STORAGE_KEY = "theme";

/**
 * Read the current theme from the DOM.
 * Source of truth is set by ThemeInitScript before React hydrates.
 * On the server, document is undefined so we default to "light".
 */
function readThemeFromDOM(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyThemeToDOM(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initial state: "light" on SSR; on client, the lazy initializer reads the
  // value already applied to <html data-theme="..."> by ThemeInitScript.
  const [theme, setTheme] = useState<Theme>(readThemeFromDOM);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage may be unavailable (private mode, etc.) — ignore
      }
      applyThemeToDOM(next);
      return next;
    });
  }, []);

  // Sync system preference changes IF the user hasn't made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      // Respect explicit user choice; only follow system if no choice stored
      if (stored === "light" || stored === "dark") return;
      const next: Theme = event.matches ? "dark" : "light";
      applyThemeToDOM(next);
      setTheme(next);
    };
    mq.addEventListener("change", handleSystemChange);
    return () => mq.removeEventListener("change", handleSystemChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
