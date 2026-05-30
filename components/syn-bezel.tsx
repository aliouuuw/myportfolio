import type { CSSProperties, ReactNode } from "react";

type SynBezelProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
};

/** Nested shell + core for machined card depth on synthesis surfaces. */
export function SynBezel({
  children,
  className = "",
  innerClassName = "",
  style,
}: SynBezelProps) {
  return (
    <div className={`syn-bezel ${className}`.trim()} style={style}>
      <div className={`syn-bezel__inner ${innerClassName}`.trim()}>{children}</div>
    </div>
  );
}
