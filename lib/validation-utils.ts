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

