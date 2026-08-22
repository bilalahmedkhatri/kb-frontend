"use client";

import { useEffect, useState } from "react";

/**
 * Responsive contract hook: subscribes to a CSS media query and returns
 * whether it currently matches. Use with breakpoint tokens (sm/md/lg/xl)
 * to switch presentation shells while preserving identical state logic.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Matches Tailwind `sm` breakpoint (640px). */
export function useIsSmall(): boolean {
  return useMediaQuery("(min-width: 640px)");
}

/** Matches Tailwind `md` breakpoint (768px). */
export function useIsMedium(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

/** Matches Tailwind `lg` breakpoint (1024px). */
export function useIsLarge(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/** Matches Tailwind `xl` breakpoint (1280px). */
export function useIsExtraLarge(): boolean {
  return useMediaQuery("(min-width: 1280px)");
}

/** True below the `md` breakpoint — mobile presentation shell. */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/** True at or above the `md` breakpoint — desktop presentation shell. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}
