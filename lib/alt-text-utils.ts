/**
 * Utilities for generating and validating alt text for images.
 * 
 * Alt text is crucial for accessibility. Follow these guidelines:
 * - Informative images: Describe the image content and context
 * - Decorative images: Use empty string "" and add aria-hidden="true"
 * - Functional images (icons, buttons): Describe the function, not appearance
 * - Complex images (charts, graphs): Provide detailed descriptions
 * - Images with text: Include the text in alt attribute
 */

/**
 * Generates alt text for a user profile image.
 * @param displayName The user's display name
 * @param name The user's name (fallback)
 * @param position Optional leaderboard position for context
 * @returns A descriptive alt text for the profile image
 */
export function generateProfileAltText(
  displayName?: string | null,
  name?: string | null,
  position?: number | null
): string {
  const userName = displayName || name || "Anonymous";
  if (position !== undefined && position !== null) {
    return `Profile picture of ${userName}, ranked #${position}`;
  }
  return `Profile picture of ${userName}`;
}

/**
 * Generates alt text for a builder's profile image in leaderboard context.
 * @param displayName The builder's display name
 * @param name The builder's name (fallback)
 * @param position The builder's leaderboard position
 * @returns A descriptive alt text for the builder's profile image
 */
export function generateBuilderAltText(
  displayName?: string | null,
  name?: string | null,
  position?: number | null
): string {
  const builderName = displayName || name || "Anonymous builder";
  if (position !== undefined && position !== null) {
    return `Profile picture of ${builderName}, ranked #${position} on the leaderboard`;
  }
  return `Profile picture of ${builderName}`;
}

/**
 * Validates alt text for images.
 * @param alt The alt text to validate
 * @param isDecorative Whether the image is decorative (should be empty)
 * @returns An object with validation result and suggestions
 */
export function validateAltText(
  alt: string,
  isDecorative: boolean = false
): {
  isValid: boolean;
  warning?: string;
  suggestion?: string;
} {
  if (isDecorative) {
    if (alt !== "") {
      return {
        isValid: false,
        warning: "Decorative images should have empty alt text",
        suggestion: 'Use alt="" and add aria-hidden="true"',
      };
    }
    return { isValid: true };
  }

  if (!alt || alt.trim() === "") {
    return {
      isValid: false,
      warning: "Informative images must have alt text",
      suggestion: "Provide a description of the image content and context",
    };
  }

  if (alt.length > 125) {
    return {
      isValid: true,
      warning: "Alt text is very long",
      suggestion: "Consider providing a shorter description or using a longdesc attribute for complex images",
    };
  }

  // Check for common mistakes
  const lowerAlt = alt.toLowerCase();
  if (lowerAlt.startsWith("image of") || lowerAlt.startsWith("picture of")) {
    return {
      isValid: true,
      suggestion: "Avoid redundant phrases like 'image of' or 'picture of'",
    };
  }

  return { isValid: true };
}

/**
 * Generates alt text for an icon based on its function.
 * @param iconName The name/type of the icon
 * @param context Optional context about where/how the icon is used
 * @returns Descriptive alt text for the icon
 */
export function generateIconAltText(
  iconName: string,
  context?: string
): string {
  const iconDescriptions: Record<string, string> = {
    search: "Search",
    close: "Close",
    menu: "Menu",
    settings: "Settings",
    user: "User profile",
    home: "Home",
    back: "Go back",
    next: "Next",
    previous: "Previous",
    first: "First",
    last: "Last",
    download: "Download",
    share: "Share",
    print: "Print",
    refresh: "Refresh",
    expand: "Expand",
    collapse: "Collapse",
    check: "Check",
    error: "Error",
    warning: "Warning",
    info: "Information",
    success: "Success",
  };

  const baseDescription = iconDescriptions[iconName.toLowerCase()] || iconName;
  return context ? `${baseDescription}: ${context}` : baseDescription;
}

/**
 * Determines if an image should be treated as decorative.
 * Decorative images are those that don't convey important information
 * and are used purely for visual enhancement.
 * @param context The context where the image is used
 * @returns Whether the image should be decorative
 */
export function isDecorativeImage(context?: {
  hasAdjacentText?: boolean;
  isBackground?: boolean;
  isIcon?: boolean;
  isPattern?: boolean;
}): boolean {
  if (!context) return false;
  
  return !!(
    context.isBackground ||
    context.isPattern ||
    (context.isIcon && context.hasAdjacentText)
  );
}

