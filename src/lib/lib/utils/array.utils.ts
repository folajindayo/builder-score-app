/**
 * Array Utilities
 */

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function sample<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

export function flatten<T>(array: T[][]): T[] {
  return array.flat();
}

export function compact<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item != null);
}

