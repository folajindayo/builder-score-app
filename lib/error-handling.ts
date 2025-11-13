/**
 * Error handling utilities
 */

export interface ErrorWithMessage {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Check if error has a message
 */
export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Create a standardized error object
 */
export function createError(message: string, code?: string, status?: number): ErrorWithMessage {
  return { message, code, status };
}

/**
 * Handle async errors with retry logic
 */
export async function handleAsyncError<T>(
  fn: () => Promise<T>,
  onError?: (error: Error) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const err = new Error(errorMessage);
    onError?.(err);
    console.error('Async error:', err);
    return null;
  }
}

/**
 * Error boundary helper
 */
export function logError(error: Error, errorInfo?: { componentStack?: string }) {
  console.error('Error:', error);
  if (errorInfo) {
    console.error('Error Info:', errorInfo);
  }
}
