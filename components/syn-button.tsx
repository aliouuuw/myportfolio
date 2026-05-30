import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SynButtonVariant = "primary" | "secondary";

export function synButtonClasses(
  variant: SynButtonVariant = "primary",
  className = "",
): string {
  const variantClass = variant === "primary" ? "syn-btn-primary" : "syn-btn-secondary";
  return ["syn-btn", variantClass, className].filter(Boolean).join(" ");
}

type SynButtonBaseProps = {
  variant?: SynButtonVariant;
  className?: string;
  children: ReactNode;
};

type SynButtonAsLink = SynButtonBaseProps &
  ComponentPropsWithoutRef<"a"> & { href: string };

type SynButtonAsButton = SynButtonBaseProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

export type SynButtonProps = SynButtonAsLink | SynButtonAsButton;

export function SynButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: SynButtonProps) {
  const classes = synButtonClasses(variant, className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ComponentPropsWithoutRef<"button">;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
