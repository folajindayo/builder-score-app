/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(
  element: HTMLElement | null,
  options?: ScrollIntoViewOptions
): void {
  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
    ...options,
  });
}

/**
 * Scroll to top of page
 */
export function scrollToTop(smooth = true): void {
  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "auto",
  });
}

/**
 * Get scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

/**
 * Check if user has scrolled to bottom
 */
export function isScrolledToBottom(threshold = 0): boolean {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  return scrollHeight - scrollTop - clientHeight <= threshold;
}

/**
 * Lock body scroll
 */
export function lockScroll(): void {
  document.body.style.overflow = "hidden";
}

/**
 * Unlock body scroll
 */
export function unlockScroll(): void {
  document.body.style.overflow = "";
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch (err) {
      document.body.removeChild(textarea);
      return false;
    }
  }
}

/**
 * Get element dimensions
 */
export function getElementDimensions(element: HTMLElement): {
  width: number;
  height: number;
  top: number;
  left: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
  };
}

