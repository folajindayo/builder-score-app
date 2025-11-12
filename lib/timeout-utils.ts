/**
 * Timeout utilities
 */

/**
 * Creates a promise that resolves after a delay
 */
export function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a promise that rejects after a timeout
 */
export function timeoutReject<T>(ms: number, message: string = 'Operation timed out'): Promise<T> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
}

/**
 * Wraps a promise with a timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    timeoutReject<T>(ms, timeoutMessage),
  ]);
}

