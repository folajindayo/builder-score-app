/**
 * String manipulation utility functions
 */

/**
 * Generates a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Highlights search terms in text
 * @param text - The text to highlight in
 * @param searchTerm - The term to highlight
 * @param highlightClass - CSS class for highlighting (default: 'highlight')
 * @returns Text with highlighted terms
 */
export function highlightText(
  text: string,
  searchTerm: string,
  highlightClass: string = 'highlight'
): string {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
}

/**
 * Matches a string against a search term (case-insensitive)
 * @param text - The text to search in
 * @param searchTerm - The search term
 * @returns True if match found, false otherwise
 */
export function matchesSearchTerm(text: string, searchTerm: string): boolean {
  if (!text || !searchTerm) return false;
  return text.toLowerCase().includes(searchTerm.toLowerCase());
}

/**
 * Pluralizes a word based on count
 * @param count - The count to check
 * @param singular - Singular form of the word
 * @param plural - Plural form (optional, adds 's' if not provided)
 * @returns Pluralized string
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : plural || `${singular}s`;
}

/**
 * Truncates text at word boundary
 * @param text - The text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text at word boundary
 */
export function truncateAtWord(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + '...';
  }

  return truncated + '...';
}
