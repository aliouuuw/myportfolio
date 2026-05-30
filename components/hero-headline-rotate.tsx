"use client";

import { useEffect, useState } from "react";

const ROTATE_MS = 3200;

type HeroHeadlineRotateProps = {
  before: string;
  products: string;
  services: string;
  staticLabel: string;
  ariaLabel: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function HeroHeadlineRotate({
  before,
  products,
  services,
  staticLabel,
  ariaLabel,
}: HeroHeadlineRotateProps) {
  const reducedMotion = usePrefersReducedMotion();
  const words = [products, services];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % words.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, words.length]);

  return (
    <>
      <span className="sr-only">{ariaLabel}</span>
      <span aria-hidden="true">
        {before}{" "}
        {reducedMotion ? (
          <span className="syn-hero-rotate__static">{staticLabel}</span>
        ) : (
          <span className="syn-hero-rotate">
            <span className="syn-hero-rotate__slot">
              <span className="syn-hero-rotate__sizer">{services}</span>
              {words.map((word, i) => (
                <span
                  key={word}
                  className={
                    i === active
                      ? "syn-hero-rotate__word syn-hero-rotate__word--active"
                      : "syn-hero-rotate__word"
                  }
                >
                  {word}
                </span>
              ))}
            </span>
          </span>
        )}
      </span>
    </>
  );
}
