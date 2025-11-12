/**
 * Rate limiting utilities
 */

/**
 * Creates a rate limiter that allows a certain number of calls per time window
 */
export function createRateLimiter(maxCalls: number, windowMs: number) {
  const calls: number[] = [];

  return function rateLimit(): boolean {
    const now = Date.now();
    
    // Remove calls outside the window
    while (calls.length > 0 && calls[0] < now - windowMs) {
      calls.shift();
    }

    if (calls.length >= maxCalls) {
      return false; // Rate limit exceeded
    }

    calls.push(now);
    return true; // Allowed
  };
}

/**
 * Throttles a function to execute at most once per time window
 */
export function throttleRate<T extends (...args: any[]) => any>(
  fn: T,
  windowMs: number
): T {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= windowMs) {
      lastCall = now;
      fn(...args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, windowMs - timeSinceLastCall);
    }
  }) as T;
}

