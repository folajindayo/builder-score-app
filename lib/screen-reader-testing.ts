/**
 * Screen reader testing utilities
 * 
 * Provides utilities for testing and validating screen reader compatibility
 * and accessibility features.
 */

/**
 * Screen reader detection (basic)
 * Note: Direct detection is limited, but we can check for common patterns
 */
export function detectScreenReader(): {
  detected: boolean;
  type?: 'NVDA' | 'JAWS' | 'VoiceOver' | 'TalkBack' | 'Narrator' | 'Unknown';
} {
  if (typeof window === 'undefined') {
    return { detected: false };
  }

  // Check for common screen reader indicators
  const userAgent = navigator.userAgent.toLowerCase();
  const isWindows = userAgent.includes('windows');
  const isMac = userAgent.includes('mac');
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = userAgent.includes('android');

  // Check for NVDA (Windows)
  if (isWindows && (window as any).speechSynthesis) {
    // NVDA often leaves traces
    if (document.querySelector('[aria-live]')) {
      return { detected: true, type: 'NVDA' };
    }
  }

  // Check for VoiceOver (Mac/iOS)
  if ((isMac || isIOS) && (window as any).webkitSpeechRecognition) {
    return { detected: true, type: 'VoiceOver' };
  }

  // Check for TalkBack (Android)
  if (isAndroid) {
    return { detected: true, type: 'TalkBack' };
  }

  // Check for Narrator (Windows)
  if (isWindows) {
    return { detected: true, type: 'Narrator' };
  }

  // Check for ARIA live regions (indicates screen reader usage)
  const hasLiveRegions = document.querySelectorAll('[aria-live]').length > 0;
  if (hasLiveRegions) {
    return { detected: true, type: 'Unknown' };
  }

  return { detected: false };
}

/**
 * Validates screen reader announcements
 */
export function validateAnnouncements(): Array<{
  element: HTMLElement;
  issue: string;
  recommendation: string;
}> {
  const issues: Array<{
    element: HTMLElement;
    issue: string;
    recommendation: string;
  }> = [];

  // Check for aria-live regions
  const liveRegions = document.querySelectorAll('[aria-live]');
  liveRegions.forEach((region) => {
    const element = region as HTMLElement;
    const priority = element.getAttribute('aria-live');
    const atomic = element.getAttribute('aria-atomic');

    // Check for appropriate priority
    if (priority === 'off') {
      issues.push({
        element,
        issue: 'aria-live is set to "off"',
        recommendation: 'Use "polite" for non-urgent updates or "assertive" for urgent updates',
      });
    }

    // Check for atomic regions (should be used carefully)
    if (atomic === 'true' && priority === 'assertive') {
      issues.push({
        element,
        issue: 'Combination of aria-atomic="true" and aria-live="assertive" may be too aggressive',
        recommendation: 'Consider using aria-live="polite" for less disruptive announcements',
      });
    }
  });

  // Check for missing aria-live on dynamic content
  const dynamicContent = document.querySelectorAll('[role="status"], [role="alert"]');
  dynamicContent.forEach((content) => {
    const element = content as HTMLElement;
    if (!element.hasAttribute('aria-live')) {
      issues.push({
        element,
        issue: 'Dynamic content missing aria-live attribute',
        recommendation: 'Add aria-live="polite" or aria-live="assertive" to ensure screen readers announce updates',
      });
    }
  });

  return issues;
}

/**
 * Tests keyboard navigation flow
 */
export function testKeyboardNavigation(): {
  success: boolean;
  issues: Array<{
    element: HTMLElement;
    issue: string;
    recommendation: string;
  }>;
} {
  const issues: Array<{
    element: HTMLElement;
    issue: string;
    recommendation: string;
  }> = [];

  // Get all focusable elements
  const focusableElements = document.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  // Check for logical tab order
  let previousTabIndex = -1;
  focusableElements.forEach((element, index) => {
    const tabIndex = element.tabIndex;

    // Check for positive tabindex that might break natural order
    if (tabIndex > 0 && previousTabIndex > 0 && tabIndex < previousTabIndex) {
      issues.push({
        element,
        issue: `Tab order may be broken: tabindex ${tabIndex} comes after tabindex ${previousTabIndex}`,
        recommendation: 'Use natural tab order (tabindex="0" or no tabindex) or ensure positive tabindex values are sequential',
      });
    }

    previousTabIndex = tabIndex > 0 ? tabIndex : 0;
  });

  // Check for interactive elements without keyboard support
  const interactiveElements = document.querySelectorAll<HTMLElement>(
    '[onclick], [onmouseover], [role="button"]:not(button), [role="link"]:not(a)'
  );
  interactiveElements.forEach((element) => {
    if (element.tabIndex === -1 && !element.hasAttribute('aria-hidden')) {
      issues.push({
        element,
        issue: 'Interactive element not keyboard accessible',
        recommendation: 'Add tabindex="0" and keyboard event handlers, or use semantic HTML elements',
      });
    }
  });

  return {
    success: issues.length === 0,
    issues,
  };
}

/**
 * Validates ARIA labels and descriptions
 */
export function validateARIALabels(): Array<{
  element: HTMLElement;
  issue: string;
  recommendation: string;
}> {
  const issues: Array<{
    element: HTMLElement;
    issue: string;
    recommendation: string;
  }> = [];

  // Check for elements with aria-label but no visible text
  const elementsWithAriaLabel = document.querySelectorAll<HTMLElement>('[aria-label]');
  elementsWithAriaLabel.forEach((element) => {
    const ariaLabel = element.getAttribute('aria-label');
    const hasVisibleText = element.textContent?.trim() || element.querySelector('img[alt]');

    // Icon-only buttons should have aria-label
    if (element.tagName === 'BUTTON' && !hasVisibleText && !ariaLabel) {
      issues.push({
        element,
        issue: 'Icon-only button missing aria-label',
        recommendation: 'Add aria-label to describe the button action',
      });
    }
  });

  // Check for form inputs without labels
  const formInputs = document.querySelectorAll<HTMLElement>(
    'input:not([type="hidden"]), textarea, select'
  );
  formInputs.forEach((input) => {
    const id = input.id;
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = input.hasAttribute('aria-label');
    const hasAriaLabelledBy = input.hasAttribute('aria-labelledby');

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        element: input,
        issue: 'Form input missing accessible label',
        recommendation: 'Add a <label> element, aria-label, or aria-labelledby attribute',
      });
    }
  });

  // Check for images without alt text
  const images = document.querySelectorAll<HTMLImageElement>('img');
  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    if (alt === null) {
      issues.push({
        element: img,
        issue: 'Image missing alt attribute',
        recommendation: 'Add alt attribute (use empty string for decorative images)',
      });
    }
  });

  return issues;
}

/**
 * Runs comprehensive screen reader accessibility audit
 */
export function runAccessibilityAudit(): {
  screenReader: ReturnType<typeof detectScreenReader>;
  announcements: ReturnType<typeof validateAnnouncements>;
  keyboardNavigation: ReturnType<typeof testKeyboardNavigation>;
  ariaLabels: ReturnType<typeof validateARIALabels>;
  summary: {
    totalIssues: number;
    criticalIssues: number;
    warnings: number;
  };
} {
  const screenReader = detectScreenReader();
  const announcements = validateAnnouncements();
  const keyboardNavigation = testKeyboardNavigation();
  const ariaLabels = validateARIALabels();

  const allIssues = [
    ...announcements,
    ...keyboardNavigation.issues,
    ...ariaLabels,
  ];

  const criticalIssues = allIssues.filter((issue) =>
    issue.issue.toLowerCase().includes('missing') ||
    issue.issue.toLowerCase().includes('not accessible')
  ).length;

  const warnings = allIssues.length - criticalIssues;

  return {
    screenReader,
    announcements,
    keyboardNavigation,
    ariaLabels,
    summary: {
      totalIssues: allIssues.length,
      criticalIssues,
      warnings,
    },
  };
}

/**
 * Logs accessibility audit results to console
 */
export function logAccessibilityAudit(): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  const audit = runAccessibilityAudit();

  console.group('🔍 Accessibility Audit');
  console.log('Screen Reader:', audit.screenReader);
  console.log('Announcements:', audit.announcements);
  console.log('Keyboard Navigation:', audit.keyboardNavigation);
  console.log('ARIA Labels:', audit.ariaLabels);
  console.log('Summary:', audit.summary);
  console.groupEnd();

  if (audit.summary.totalIssues > 0) {
    console.warn(
      `Found ${audit.summary.totalIssues} accessibility issues (${audit.summary.criticalIssues} critical, ${audit.summary.warnings} warnings)`
    );
  } else {
    console.log('✅ No accessibility issues found!');
  }
}

