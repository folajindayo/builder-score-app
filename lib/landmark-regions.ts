/**
 * Landmark region utilities for accessibility
 *
 * Landmark regions help screen reader users navigate pages more efficiently
 * by identifying major sections of content.
 */

/**
 * Standard ARIA landmark roles
 */
export const LANDMARK_ROLES = {
  BANNER: 'banner',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  COMPLEMENTARY: 'complementary',
  CONTENTINFO: 'contentinfo',
  SEARCH: 'search',
  FORM: 'form',
  REGION: 'region',
} as const;

/**
 * Creates a landmark region element
 * @param role The landmark role
 * @param label The accessible label for the region
 * @returns HTML attributes for the landmark
 */
export function createLandmark(
  role: string,
  label?: string
): {
  role: string;
  'aria-label'?: string;
} {
  const landmark: { role: string; 'aria-label'?: string } = { role };

  if (label) {
    landmark['aria-label'] = label;
  }

  return landmark;
}

/**
 * Validates landmark regions on a page
 * @returns Array of validation issues
 */
export function validateLandmarks(): Array<{
  element: HTMLElement;
  issue: string;
  recommendation: string;
}> {
  const issues: Array<{
    element: HTMLElement;
    issue: string;
    recommendation: string;
  }> = [];

  // Check for required landmarks
  const main = document.querySelector('main, [role="main"]');
  if (!main) {
    issues.push({
      element: document.body,
      issue: 'Missing main landmark region',
      recommendation: 'Add a <main> element or element with role="main"',
    });
  }

  // Check for multiple banners (should only have one per page)
  const banners = document.querySelectorAll('[role="banner"], header');
  if (banners.length > 1) {
    banners.forEach((banner, index) => {
      if (index > 0) {
        issues.push({
          element: banner as HTMLElement,
          issue: 'Multiple banner regions found',
          recommendation:
            'Only one banner region should exist per page. Consider using role="region" for additional headers.',
        });
      }
    });
  }

  // Check for navigation regions without labels
  const navs = document.querySelectorAll('[role="navigation"], nav');
  navs.forEach((nav) => {
    const hasLabel =
      nav.hasAttribute('aria-label') ||
      nav.hasAttribute('aria-labelledby') ||
      nav.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      issues.push({
        element: nav as HTMLElement,
        issue: 'Navigation region missing accessible label',
        recommendation: 'Add aria-label or aria-labelledby to identify the navigation purpose',
      });
    }
  });

  // Check for complementary regions without labels
  const complementaries = document.querySelectorAll('[role="complementary"], aside');
  complementaries.forEach((aside) => {
    const hasLabel =
      aside.hasAttribute('aria-label') ||
      aside.hasAttribute('aria-labelledby') ||
      aside.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      issues.push({
        element: aside as HTMLElement,
        issue: 'Complementary region missing accessible label',
        recommendation: 'Add aria-label or aria-labelledby to identify the complementary content',
      });
    }
  });

  // Check for search regions
  const searches = document.querySelectorAll('[role="search"]');
  searches.forEach((search) => {
    const hasLabel = search.hasAttribute('aria-label') || search.hasAttribute('aria-labelledby');
    if (!hasLabel) {
      issues.push({
        element: search as HTMLElement,
        issue: 'Search region missing accessible label',
        recommendation: 'Add aria-label to identify the search functionality',
      });
    }
  });

  return issues;
}

/**
 * Gets all landmark regions on the page
 * @returns Map of role to elements
 */
export function getLandmarks(): Map<string, HTMLElement[]> {
  const landmarks = new Map<string, HTMLElement[]>();

  const roles = [
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'search',
    'form',
    'region',
  ];

  roles.forEach((role) => {
    const elements = Array.from(
      document.querySelectorAll(
        `[role="${role}"], ${role === 'main' ? 'main' : role === 'navigation' ? 'nav' : role === 'complementary' ? 'aside' : role === 'contentinfo' ? 'footer' : ''}`
      )
    ) as HTMLElement[];
    if (elements.length > 0) {
      landmarks.set(role, elements);
    }
  });

  return landmarks;
}

/**
 * Creates a skip link target
 * @param id The ID for the skip link target
 * @param label The accessible label
 * @returns HTML attributes
 */
export function createSkipLinkTarget(
  id: string,
  label?: string
): {
  id: string;
  tabIndex: number;
  'aria-label'?: string;
} {
  return {
    id,
    tabIndex: -1,
    ...(label && { 'aria-label': label }),
  };
}
