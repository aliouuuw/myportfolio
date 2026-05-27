"use client";

/**
 * The mock route renders inside a `.mock-shell` element with
 * `position: fixed; overflow-y: auto`. GSAP ScrollTrigger defaults to the
 * window scroller, which never scrolls in this layout — sections stay
 * frozen at their initial state.
 *
 * Resolve the shell element synchronously (during render) so child
 * ScrollTrigger configs can reference it on the very first effect.
 */
export function getMockScroller(): HTMLElement | undefined {
  if (typeof document === "undefined") return undefined;
  return (
    (document.querySelector(".mock-shell") as HTMLElement | null) ?? undefined
  );
}
