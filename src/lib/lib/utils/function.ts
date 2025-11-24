/**
 * Function utility functions
 */

export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>) => {
    if (!called) {
      result = fn(...args);
      called = true;
    }
    return result;
  }) as T;
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limitMs) {
      lastCall = now;
      fn(...args);
    }
  };
}

export function curry<T extends (...args: any[]) => any>(fn: T) {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  };
}

export function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}

export function noop(): void {
  // Does nothing
}

export function identity<T>(value: T): T {
  return value;
}

export function constant<T>(value: T): () => T {
  return () => value;
}

export function negate<T extends (...args: any[]) => boolean>(
  fn: T
): (...args: Parameters<T>) => boolean {
  return (...args: Parameters<T>) => !fn(...args);
}

export function partial<T extends (...args: any[]) => any>(
  fn: T,
  ...presetArgs: any[]
): (...args: any[]) => ReturnType<T> {
  return (...laterArgs: any[]) => fn(...presetArgs, ...laterArgs);
}

export function attempt<T>(fn: () => T): T | Error {
  try {
    return fn();
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}

