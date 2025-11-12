/**
 * String manipulation utilities
 */

/**
 * Removes whitespace from both ends of a string
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * Removes whitespace from the start of a string
 */
export function trimStart(str: string): string {
  return str.trimStart();
}

/**
 * Removes whitespace from the end of a string
 */
export function trimEnd(str: string): string {
  return str.trimEnd();
}

/**
 * Converts string to lowercase
 */
export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

/**
 * Converts string to uppercase
 */
export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

/**
 * Reverses a string
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Checks if string starts with a substring
 */
export function startsWith(str: string, searchString: string): boolean {
  return str.startsWith(searchString);
}

/**
 * Checks if string ends with a substring
 */
export function endsWith(str: string, searchString: string): boolean {
  return str.endsWith(searchString);
}

/**
 * Replaces all occurrences of a substring
 */
export function replaceAll(str: string, search: string, replace: string): string {
  return str.split(search).join(replace);
}

/**
 * Pads string to a certain length
 */
export function padStart(str: string, length: number, padString: string = ' '): string {
  return str.padStart(length, padString);
}

/**
 * Pads string at the end to a certain length
 */
export function padEnd(str: string, length: number, padString: string = ' '): string {
  return str.padEnd(length, padString);
}

/**
 * Removes HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Escapes HTML special characters
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Unescapes HTML entities
 */
export function unescapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, (m) => map[m]);
}

/**
 * Splits string by delimiter and trims each part
 */
export function splitAndTrim(str: string, delimiter: string): string[] {
  return str.split(delimiter).map((s) => s.trim()).filter((s) => s.length > 0);
}

/**
 * Joins array of strings with delimiter
 */
export function join(array: string[], delimiter: string = ''): string {
  return array.join(delimiter);
}

/**
 * Checks if string contains a substring (case-insensitive)
 */
export function containsIgnoreCase(str: string, searchString: string): boolean {
  return str.toLowerCase().includes(searchString.toLowerCase());
}

/**
 * Extracts words from a string
 */
export function extractWords(str: string): string[] {
  return str.match(/\b\w+\b/g) || [];
}

/**
 * Counts words in a string
 */
export function countWords(str: string): number {
  return extractWords(str).length;
}

/**
 * Converts string to slug format
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
 * Converts slug back to readable string
 */
export function unslugify(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

