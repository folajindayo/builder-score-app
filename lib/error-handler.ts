/**
 * Error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * Creates a standardized error object
 */
export function createError(
  message: string,
  code?: string,
  statusCode?: number,
  details?: unknown
): AppError {
  return {
    message,
    code,
    statusCode,
    details,
  };
}

/**
 * Checks if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as AppError).message === "string"
  );
}

/**
 * Extracts error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}

/**
 * Logs an error with context
 */
export function logError(error: unknown, context?: string): void {
  const message = getErrorMessage(error);
  const logMessage = context ? `[${context}] ${message}` : message;
  console.error(logMessage, error);
}

