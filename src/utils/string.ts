/**
 * String manipulation utilities for Builder Score App
 */

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toLowerCase());
}

/**
 * Convert string to PascalCase
 */
export function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Convert string to snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Uppercase first letter of each word
 */
export function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

/**
 * Reverse a string
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Count words in a string
 */
export function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Truncate string to word boundary
 */
export function truncateWords(str: string, maxWords: number, suffix = '...'): string {
  const words = str.split(/\s+/);
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(' ') + suffix;
}

/**
 * Pad start of string
 */
export function padStart(str: string, length: number, char = ' '): string {
  return str.padStart(length, char);
}

/**
 * Pad end of string
 */
export function padEnd(str: string, length: number, char = ' '): string {
  return str.padEnd(length, char);
}

/**
 * Remove whitespace from both ends
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * Remove all whitespace
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s/g, '');
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * Unescape HTML special characters
 */
export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  return str.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => htmlUnescapes[entity]);
}

/**
 * Slugify a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate random string
 */
export function randomString(length: number, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Check if string is empty or whitespace
 */
export function isBlank(str: string): boolean {
  return !str || /^\s*$/.test(str);
}

/**
 * Check if string contains substring (case-insensitive)
 */
export function includesIgnoreCase(str: string, search: string): boolean {
  return str.toLowerCase().includes(search.toLowerCase());
}

/**
 * Replace all occurrences
 */
export function replaceAll(str: string, search: string, replace: string): string {
  return str.split(search).join(replace);
}

/**
 * Count occurrences of substring
 */
export function countOccurrences(str: string, search: string): number {
  return (str.match(new RegExp(search, 'g')) || []).length;
}

/**
 * Insert string at position
 */
export function insertAt(str: string, index: number, insert: string): string {
  return str.slice(0, index) + insert + str.slice(index);
}

/**
 * Remove substring at position
 */
export function removeAt(str: string, index: number, length = 1): string {
  return str.slice(0, index) + str.slice(index + length);
}

/**
 * Check if string starts with any of the given prefixes
 */
export function startsWithAny(str: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => str.startsWith(prefix));
}

/**
 * Check if string ends with any of the given suffixes
 */
export function endsWithAny(str: string, suffixes: string[]): boolean {
  return suffixes.some((suffix) => str.endsWith(suffix));
}

/**
 * Repeat string n times
 */
export function repeat(str: string, times: number): string {
  return str.repeat(times);
}

/**
 * Extract numbers from string
 */
export function extractNumbers(str: string): number[] {
  return (str.match(/\d+/g) || []).map(Number);
}

/**
 * Mask string (e.g., for credit cards)
 */
export function mask(str: string, visibleChars = 4, maskChar = '*'): string {
  if (str.length <= visibleChars) return str;
  const visible = str.slice(-visibleChars);
  const masked = maskChar.repeat(str.length - visibleChars);
  return masked + visible;
}

