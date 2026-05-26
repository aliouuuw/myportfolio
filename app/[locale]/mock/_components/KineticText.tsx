"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface KineticTextProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  splitBy?: "chars" | "words" | "lines";
}

// Map of element types to components
const ELEMENTS: Record<string, (props: { children: ReactNode; className?: string }) => React.ReactElement> = {
  h1: ({ children, className }) => <h1 className={className}>{children}</h1>,
  h2: ({ children, className }) => <h2 className={className}>{children}</h2>,
  h3: ({ children, className }) => <h3 className={className}>{children}</h3>,
  p: ({ children, className }) => <p className={className}>{children}</p>,
  span: ({ children, className }) => <span className={className}>{children}</span>,
};

export function KineticText({
  children,
  as = "span",
  className = "",
  delay = 0,
  splitBy = "chars",
}: KineticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const Component = ELEMENTS[as];

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll(".kinetic-item");
      if (!elements) return;

      gsap.fromTo(
        elements,
        {
          y: 100,
          opacity: 0,
          rotateX: -90,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          ease: "power4.out",
          stagger: splitBy === "chars" ? 0.02 : 0.08,
          delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [children, delay, splitBy]);

  const content =
    splitBy === "chars"
      ? children.split("").map((char, i) => (
          <span
            key={i}
            className="kinetic-item inline-block"
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))
      : children.split(" ").map((word, i) => (
          <span key={i} className="kinetic-item inline-block mr-[0.25em]">
            {word}
          </span>
        ));

  return (
    <div ref={containerRef}>
      <Component className={`${className} perspective-[1000px]`}>
        {content}
      </Component>
    </div>
  );
}
