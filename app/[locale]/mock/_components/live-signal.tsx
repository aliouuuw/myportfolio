"use client";

import { useEffect, useState } from "react";

type Signal = {
  label: string;
  value: string;
  tone?: "ok" | "live" | "muted";
};

const SIGNALS: Signal[] = [
  { label: "shipping", value: "everest-finance", tone: "live" },
  { label: "last push", value: "3d ago", tone: "ok" },
  { label: "open", value: "2 seats · Q3", tone: "muted" },
];

const ROTATE_MS = 5000;

export function LiveSignal() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % SIGNALS.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const current = SIGNALS[idx];

  return (
    <span className="live-signal" aria-live="polite">
      <span className="live-signal-dot" aria-hidden />
      <span className="live-signal-key">{current.label}</span>
      <span className={`live-signal-val live-signal-val--${current.tone ?? "muted"}`}>
        {current.value}
      </span>
    </span>
  );
}
