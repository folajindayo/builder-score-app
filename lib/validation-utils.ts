/**
 * Validation utility functions
 */

/**
 * Validates an ENS name format
 * @param name - The ENS name to validate
 * @returns True if valid ENS name, false otherwise
 */
export function isValidENS(name: string): boolean {
  if (!name) return false;
  // ENS names end with .eth and contain only lowercase letters, numbers, and hyphens
  const ensRegex = /^[a-z0-9-]+\.eth$/;
  return ensRegex.test(name.toLowerCase());
}

/**
 * Validates URL format with improved checks
 * @param url - The URL to validate
 * @returns True if valid URL, false otherwise
 */
export function isValidURL(url: string): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates form field is not empty
 * @param value - The form field value
 * @returns True if not empty, false otherwise
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * Validates a value matches a schema pattern
 * @param value - The value to validate
 * @param pattern - RegExp pattern to match
 * @returns True if matches pattern, false otherwise
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

/**
 * Sanitizes user input by removing dangerous characters
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '')
    .trim();
}
