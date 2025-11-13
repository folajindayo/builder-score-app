import * as Sentry from '@sentry/nextjs';

/**
 * Error reporting utilities
 */

export interface ErrorContext {
  userId?: string;
  walletAddress?: string;
  page?: string;
  action?: string;
  [key: string]: any;
}

/**
 * Report an error to Sentry
 */
export function reportError(error: Error, context?: ErrorContext): void {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error, 'Context:', context);
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setContext(key, { value: context[key] });
      });
    }
    
    Sentry.captureException(error);
  });
}

/**
 * Report a message to Sentry
 */
export function reportMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: ErrorContext
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level}]`, message, context);
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    
    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setContext(key, { value: context[key] });
      });
    }
    
    Sentry.captureMessage(message);
  });
}

/**
 * Set user context for error reporting
 */
export function setUserContext(user: {
  id?: string;
  username?: string;
  email?: string;
  walletAddress?: string;
}): void {
  Sentry.setUser(user);
}

/**
 * Clear user context
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof Error) {
        reportError(error, context);
      }
      throw error;
    }
  }) as T;
}

/**
 * Performance monitoring
 */
export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({ name, op });
}

/**
 * Capture performance metric
 */
export function capturePerformance(
  name: string,
  value: number,
  unit: string = 'millisecond'
): void {
  Sentry.captureMessage(`Performance: ${name}`, {
    level: 'info',
    tags: {
      type: 'performance',
      metric: name,
    },
    extra: {
      value,
      unit,
    },
  });
}

