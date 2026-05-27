"use client";

/**
 * Production scroll root for GSAP ScrollTrigger.
 * Uses the document scroller (not mock's `.mock-shell`).
 */
export function getSiteScroller(): HTMLElement | Window {
  if (typeof document === "undefined") {
    return window;
  }
  return document.documentElement;
}
