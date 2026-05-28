"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function SynthesisRevealSection({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInView();

  return (
    <section
      id={id}
      ref={ref as React.RefObject<HTMLElement>}
      className={`reveal-section ${inView ? "reveal-section--visible" : ""} ${className}`}
    >
      {children}
    </section>
  );
}
