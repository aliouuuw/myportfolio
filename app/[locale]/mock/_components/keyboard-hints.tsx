"use client";

import { useEffect, useState } from "react";

const HINTS: { keys: string; label: string }[] = [
  { keys: "g w", label: "Work" },
  { keys: "g j", label: "Open seats" },
  { keys: "g c", label: "Contact" },
  { keys: "?", label: "This panel" },
];

const SECTION_FOR: Record<string, string> = {
  w: "work",
  j: "join",
  c: "contact",
};

export function KeyboardHints() {
  const [open, setOpen] = useState(false);
  const [primed, setPrimed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let primeReset: number | undefined;

    const isTyping = (target: EventTarget | null) => {
      const t = target as HTMLElement | null;
      if (!t) return false;
      const tag = t.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        t.isContentEditable
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;

      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      if (!primed && e.key.toLowerCase() === "g") {
        setPrimed(true);
        if (primeReset) window.clearTimeout(primeReset);
        primeReset = window.setTimeout(() => setPrimed(false), 1200);
        return;
      }

      if (primed) {
        const id = SECTION_FOR[e.key.toLowerCase()];
        setPrimed(false);
        if (id) {
          const el = document.getElementById(id);
          if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (primeReset) window.clearTimeout(primeReset);
    };
  }, [primed]);

  return (
    <>
      <button
        type="button"
        className={`kbd-toggle${open ? " is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts"
      >
        <span className="kbd-toggle-key" aria-hidden>?</span>
      </button>

      {open && (
        <div className="kbd-panel" role="dialog" aria-label="Keyboard shortcuts">
          <p className="kbd-panel-title label">Shortcuts</p>
          <ul className="kbd-panel-list">
            {HINTS.map((h) => (
              <li key={h.keys}>
                <kbd className="kbd-keys">{h.keys}</kbd>
                <span>{h.label}</span>
              </li>
            ))}
          </ul>
          {primed && <p className="kbd-panel-prime">Pick a section…</p>}
        </div>
      )}
    </>
  );
}
