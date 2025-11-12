"use client";

import { useEffect } from "react";

/**
 * Announces a message to screen readers
 */
export function useAnnounce(message: string, priority: "polite" | "assertive" = "polite") {
  useEffect(() => {
    if (!message) return;

    const announcement = document.createElement("div");
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    const timeout = setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    };
  }, [message, priority]);
}

/**
 * Creates a live region for announcements
 */
export function createAnnounceRegion(priority: "polite" | "assertive" = "polite"): HTMLElement {
  const region = document.createElement("div");
  region.setAttribute("role", "status");
  region.setAttribute("aria-live", priority);
  region.setAttribute("aria-atomic", "true");
  region.className = "sr-only";
  document.body.appendChild(region);
  return region;
}

/**
 * Announces a message to a live region
 */
export function announce(message: string, region?: HTMLElement, priority: "polite" | "assertive" = "polite") {
  const targetRegion = region || createAnnounceRegion(priority);
  targetRegion.textContent = message;
  
  if (!region) {
    setTimeout(() => {
      if (document.body.contains(targetRegion)) {
        document.body.removeChild(targetRegion);
      }
    }, 1000);
  }
}

