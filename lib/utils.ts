import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatScore(score: number): string {
  return score.toFixed(2);
}

/**
 * Formats a number with US locale formatting
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

// Format wallet address with ellipsis
export function formatWalletAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address || address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

// Validate wallet address format
export function isValidWalletAddress(address: string): boolean {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Capitalize first letter of string
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Get initials from name
export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Calculate percentage change
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Check if value is empty
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// Generate unique ID
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Sleep/delay utility
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formats a large number with K, M, B suffixes
 * @param num - The number to format
 * @returns Formatted number string (e.g., "12.3K", "1.5M")
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Validates an email address format
 * @param email - The email address to validate
 * @returns True if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Throttles a function to limit how often it can be called
 * @param func - The function to throttle
 * @param delay - The delay in milliseconds
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Debounces a function to delay its execution until after a specified time has passed
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Parses a URL and returns its components
 * @param url - The URL to parse
 * @returns An object with URL components or null if invalid
 */
export function parseURL(url: string): {
  protocol: string;
  hostname: string;
  pathname: string;
  search: string;
  hash: string;
} | null {
  try {
    const urlObj = new URL(url);
    return {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
    };
  } catch {
    return null;
  }
}

// Clamp number between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a random string of specified length
 * @param length - The length of the random string
 * @returns A random alphanumeric string
 */
export function randomString(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Groups an array of items by a key function
 * @param array - The array to group
 * @param keyFn - Function that returns the key for each item
 * @returns An object with keys and arrays of items
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Removes duplicate items from an array based on a key function
 * @param array - The array to deduplicate
 * @param keyFn - Function that returns the unique key for each item
 * @returns An array with duplicates removed
 */
export function uniqueBy<T>(array: T[], keyFn: (item: T) => string | number): T[] {
  const seen = new Set<string | number>();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Sorts an array of objects by a key function
 * @param array - The array to sort
 * @param keyFn - Function that returns the value to sort by
 * @param order - 'asc' for ascending, 'desc' for descending
 * @returns A new sorted array
 */
export function sortBy<T>(array: T[], keyFn: (item: T) => number | string, order: "asc" | "desc" = "asc"): T[] {
  return [...array].sort((a, b) => {
    const aVal = keyFn(a);
    const bVal = keyFn(b);
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Chunks an array into smaller arrays of specified size
 * @param array - The array to chunk
 * @param size - The size of each chunk
 * @returns An array of chunks
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flattens a nested array one level deep
 * @param array - The array to flatten
 * @returns A flattened array
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? item : [item]);
  }, [] as T[]);
}

/**
 * Calculates the difference between two arrays
 * @param array1 - First array
 * @param array2 - Second array
 * @returns An object with added and removed items
 */
export function arrayDiff<T>(array1: T[], array2: T[]): { added: T[]; removed: T[] } {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  const added = array2.filter((item) => !set1.has(item));
  const removed = array1.filter((item) => !set2.has(item));

  return { added, removed };
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param array - The array to shuffle
 * @returns A new shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Picks a random item from an array
 * @param array - The array to pick from
 * @returns A random item or undefined if array is empty
 */
export function randomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Removes an item from an array by value
 * @param array - The array to remove from
 * @param item - The item to remove
 * @returns A new array with the item removed
 */
export function removeItem<T>(array: T[], item: T): T[] {
  return array.filter((i) => i !== item);
}

/**
 * Removes an item from an array by index
 * @param array - The array to remove from
 * @param index - The index to remove
 * @returns A new array with the item at index removed
 */
export function removeItemAtIndex<T>(array: T[], index: number): T[] {
  if (index < 0 || index >= array.length) return array;
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

/**
 * Inserts an item into an array at a specific index
 * @param array - The array to insert into
 * @param item - The item to insert
 * @param index - The index to insert at
 * @returns A new array with the item inserted
 */
export function insertItem<T>(array: T[], item: T, index: number): T[] {
  return [...array.slice(0, index), item, ...array.slice(index)];
}

/**
 * Calculates the sum of numbers in an array
 * @param array - The array of numbers
 * @returns The sum of all numbers
 */
export function sum(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0);
}

/**
 * Calculates the average of numbers in an array
 * @param array - The array of numbers
 * @returns The average or 0 if array is empty
 */
export function average(array: number[]): number {
  if (array.length === 0) return 0;
  return sum(array) / array.length;
}

/**
 * Finds the minimum value in an array
 * @param array - The array of numbers
 * @returns The minimum value or undefined if array is empty
 */
export function min(array: number[]): number | undefined {
  if (array.length === 0) return undefined;
  return Math.min(...array);
}

/**
 * Finds the maximum value in an array
 * @param array - The array of numbers
 * @returns The maximum value or undefined if array is empty
 */
export function max(array: number[]): number | undefined {
  if (array.length === 0) return undefined;
  return Math.max(...array);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}

// Format currency with symbol
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Format currency without symbol
export function formatCurrencyAmount(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

// Format currency with compact notation (e.g., $1.2K, $1.5M)
export function formatCompactCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}


