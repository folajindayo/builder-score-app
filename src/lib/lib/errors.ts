/**
 * Error Handling Utilities
 * Structured error handling for the application
 */

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class NetworkError extends Error {
  constructor(message = "Network request failed") {
    super(message);
    this.name = "NetworkError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Handle API errors and convert to APIError
 */
export async function handleAPIError(response: Response): Promise<never> {
  let errorMessage = `Request failed with status ${response.status}`;
  let errorCode: string | undefined;

  try {
    const data = await response.json();
    errorMessage = data.message || data.error || errorMessage;
    errorCode = data.code;
  } catch {
    // If parsing fails, use default message
  }

  throw new APIError(errorMessage, response.status, errorCode);
}

/**
 * Format error for display
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }

  if (error instanceof NetworkError) {
    return "Network error. Please check your connection.";
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) {
    return true;
  }

  if (error instanceof APIError) {
    // Retry on 5xx and 429 status codes
    return error.statusCode >= 500 || error.statusCode === 429;
  }

  return false;
}

/**
 * Log error with context
 */
export function logError(
  error: unknown,
  context?: Record<string, any>
): void {
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error, "Context:", context);
  }

  // In production, send to error tracking service
  // TODO: Integrate with Sentry or similar
}

