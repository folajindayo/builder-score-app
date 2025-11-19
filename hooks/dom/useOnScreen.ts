"use client";

import { useState, useEffect, RefObject } from "react";

/**
 * Custom hook to detect if element is visible on screen
 * Uses Intersection Observer API
 */
export function useOnScreen(
  ref: RefObject<Element>,
  rootMargin: string = "0px"
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, rootMargin]);

  return isVisible;
}

