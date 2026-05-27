"use client";

/**
 * Production scroll root for GSAP ScrollTrigger.
 * Use the viewport (window), not mock's `.mock-shell` or `documentElement`.
 */
export function getSiteScroller(): Window {
  if (typeof window === "undefined") {
    return window;
  }
  return window;
}
