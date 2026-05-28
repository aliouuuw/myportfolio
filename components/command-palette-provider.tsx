"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CommandPaletteContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  copyToast: boolean;
  showCopyToast: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
  null,
);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const showCopyToast = useCallback(() => {
    setCopyToast(true);
    window.setTimeout(() => setCopyToast(false), 2200);
  }, []);

  const value = useMemo(
    () => ({ open, setOpen, toggle, copyToast, showCopyToast }),
    [open, toggle, copyToast, showCopyToast],
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }
  return ctx;
}
