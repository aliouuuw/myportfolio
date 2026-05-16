"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

type NavLink = {
  href: string;
  label: string;
};

type MobileNavProps = {
  links: NavLink[];
  brand: string;
  brandHref: string;
  ariaLabel: string;
  closeLabel: string;
  menuLabel: string;
  pathname: string;
};

export function MobileNav({
  links,
  brand,
  brandHref,
  ariaLabel,
  closeLabel,
  menuLabel,
  pathname,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const lastLinkRef = useRef<HTMLAnchorElement>(null);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus first link when menu opens
      setTimeout(() => firstLinkRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap: handle Tab key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = menuRef.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  // Return focus to hamburger when menu closes
  useEffect(() => {
    if (!isOpen && hamburgerRef.current) {
      hamburgerRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="sm:hidden">
      {/* Hamburger button */}
      <button
        ref={hamburgerRef}
        onClick={toggleMenu}
        className="p-2 -mr-2 text-ink-secondary hover:text-ink-primary transition-colors"
        aria-label={isOpen ? closeLabel : menuLabel}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-canvas/80 backdrop-blur-sm z-40"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div
            ref={menuRef}
            id="mobile-menu"
            className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-canvas border-l border-border z-50 flex flex-col"
            role="dialog"
            aria-label={ariaLabel}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-14 border-b border-border">
              <Link
                href={brandHref}
                className="text-sm font-semibold tracking-tight text-ink-primary"
                onClick={closeMenu}
              >
                {brand}
              </Link>
              <button
                onClick={closeMenu}
                className="p-2 -mr-2 text-ink-secondary hover:text-ink-primary transition-colors"
                aria-label={closeLabel}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-6 py-8" aria-label={ariaLabel}>
              <ul className="space-y-6">
                {links.map(({ href, label }, index) => {
                  const isActive = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <li key={href}>
                      <Link
                        ref={index === 0 ? firstLinkRef : index === links.length - 1 ? lastLinkRef : undefined}
                        href={href}
                        onClick={closeMenu}
                        className={`block text-lg transition-colors ${
                          isActive
                            ? "font-medium text-ink-primary"
                            : "text-ink-secondary hover:text-ink-primary"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border text-sm text-ink-tertiary">
              © 2026 Aliou Wade
            </div>
          </div>
        </>
      )}
    </div>
  );
}
