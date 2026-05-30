import type { ReactNode } from "react";

type SynBezelProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

/** Nested shell + core for machined card depth on synthesis surfaces. */
export function SynBezel({
  children,
  className = "",
  innerClassName = "",
}: SynBezelProps) {
  return (
    <div className={`syn-bezel ${className}`.trim()}>
      <div className={`syn-bezel__inner ${innerClassName}`.trim()}>{children}</div>
    </div>
  );
}
