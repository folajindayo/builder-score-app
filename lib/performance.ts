/**
 * Performance Monitoring Utilities
 * For tracking and optimizing application performance
 */

/**
 * Measure function execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms`);
    throw error;
  }
}

/**
 * Measure synchronous function execution time
 */
export function measure<T>(name: string, fn: () => T): T {
  const start = performance.now();
  try {
    const result = fn();
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms`);
    throw error;
  }
}

/**
 * Performance mark and measure
 */
export class PerformanceTracker {
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    if (!start) {
      console.warn(`Mark "${startMark}" not found`);
      return 0;
    }

    const end = endMark ? this.marks.get(endMark) : performance.now();
    if (endMark && !end) {
      console.warn(`Mark "${endMark}" not found`);
      return 0;
    }

    return (end as number) - start;
  }

  clear(name?: string): void {
    if (name) {
      this.marks.delete(name);
    } else {
      this.marks.clear();
    }
  }
}

/**
 * Debounced performance logger
 */
export function logPerformance(
  metric: string,
  value: number,
  unit = "ms"
): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${metric}: ${value.toFixed(2)}${unit}`);
  }
}
