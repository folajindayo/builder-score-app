/**
 * Utilities for managing tab order and keyboard navigation
 */

/**
 * Gets all focusable elements in a container
 * @param container The container element to search within
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement | Document = document): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => {
      // Filter out hidden elements
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }
  );
}

/**
 * Gets the next focusable element in tab order
 * @param currentElement The current focused element
 * @param container The container to search within (defaults to document)
 * @returns The next focusable element or null
 */
export function getNextFocusableElement(
  currentElement: HTMLElement,
  container: HTMLElement | Document = document
): HTMLElement | null {
  const focusableElements = getFocusableElements(container);
  const currentIndex = focusableElements.indexOf(currentElement);

  if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
    return focusableElements[0] || null; // Wrap to first
  }

  return focusableElements[currentIndex + 1] || null;
}

/**
 * Gets the previous focusable element in tab order
 * @param currentElement The current focused element
 * @param container The container to search within (defaults to document)
 * @returns The previous focusable element or null
 */
export function getPreviousFocusableElement(
  currentElement: HTMLElement,
  container: HTMLElement | Document = document
): HTMLElement | null {
  const focusableElements = getFocusableElements(container);
  const currentIndex = focusableElements.indexOf(currentElement);

  if (currentIndex === -1 || currentIndex === 0) {
    return focusableElements[focusableElements.length - 1] || null; // Wrap to last
  }

  return focusableElements[currentIndex - 1] || null;
}

/**
 * Focuses the first focusable element in a container
 * @param container The container to search within
 */
export function focusFirstElement(container: HTMLElement | Document = document): void {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
}

/**
 * Focuses the last focusable element in a container
 * @param container The container to search within
 */
export function focusLastElement(container: HTMLElement | Document = document): void {
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus();
  }
}

/**
 * Validates tab order by checking for logical flow
 * @param container The container to validate
 * @returns Array of issues found
 */
export function validateTabOrder(container: HTMLElement | Document = document): Array<{
  element: HTMLElement;
  issue: string;
}> {
  const issues: Array<{ element: HTMLElement; issue: string }> = [];
  const focusableElements = getFocusableElements(container);

  focusableElements.forEach((el, index) => {
    const tabIndex = el.getAttribute('tabindex');
    const computedTabIndex = el.tabIndex;

    // Check for explicit tabindex that might break natural order
    if (tabIndex && parseInt(tabIndex) > 0 && index > 0) {
      const prevTabIndex = focusableElements[index - 1].tabIndex;
      if (prevTabIndex > 0 && parseInt(tabIndex) < prevTabIndex) {
        issues.push({
          element: el,
          issue: `Tab order may be broken: tabindex ${tabIndex} comes after tabindex ${prevTabIndex}`,
        });
      }
    }

    // Check for elements that should be focusable but aren't
    if (computedTabIndex === -1 && (el.tagName === 'BUTTON' || el.tagName === 'A')) {
      if (!el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden')) {
        issues.push({
          element: el,
          issue: 'Interactive element has tabindex="-1" but is not disabled or hidden',
        });
      }
    }
  });

  return issues;
}

/**
 * Sets tab order for a group of elements
 * @param elements Array of elements to set tab order for
 * @param startIndex Starting tabindex value (defaults to 0, which uses natural order)
 */
export function setTabOrder(
  elements: HTMLElement[],
  startIndex: number = 0
): void {
  elements.forEach((el, index) => {
    if (startIndex === 0) {
      // Use natural order - remove explicit tabindex
      el.removeAttribute('tabindex');
    } else {
      el.setAttribute('tabindex', String(startIndex + index));
    }
  });
}

/**
 * Creates a logical tab order by sorting elements by their visual position
 * @param container The container to reorder elements in
 */
export function createLogicalTabOrder(container: HTMLElement | Document = document): void {
  const focusableElements = getFocusableElements(container);

  // Sort by visual position (top to bottom, left to right)
  const sortedElements = focusableElements.sort((a, b) => {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();

    // First compare by top position
    const topDiff = rectA.top - rectB.top;
    if (Math.abs(topDiff) > 10) {
      // More than 10px difference - different rows
      return topDiff;
    }

    // Same row - compare by left position
    return rectA.left - rectB.left;
  });

  // Set tab order based on visual position
  setTabOrder(sortedElements, 0);
}



