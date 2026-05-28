"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ReactNode, useCallback, forwardRef } from "react";

interface TransitionLinkProps extends React.ComponentProps<typeof Link> {
  children: ReactNode;
  className?: string;
  href: string;
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ children, href, className, ...props }, ref) => {
    const router = useRouter();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        // Check if View Transitions API is supported
        if (!document.startViewTransition) {
          router.push(href);
          return;
        }

        document.startViewTransition(() => {
          router.push(href);
        });
      },
      [href, router]
    );

    return (
      <Link ref={ref} href={href} className={className} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  }
);

TransitionLink.displayName = "TransitionLink";
