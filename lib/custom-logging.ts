/**
 * Custom logging infrastructure
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Output to console
    this.outputToConsole(entry);

    // Send to remote logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToRemote(entry);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  private outputToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        if (process.env.NODE_ENV === 'development') {
          console.debug(message, entry.context);
        }
        break;
      case LogLevel.INFO:
        console.log(message, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(message, entry.context);
        break;
      case LogLevel.ERROR:
        console.error(message, entry.error, entry.context);
        break;
    }
  }

  private sendToRemote(entry: LogEntry): void {
    // Send to remote logging service (e.g., Datadog, LogRocket)
    if (process.env.NEXT_PUBLIC_LOGGING_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_LOGGING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      }).catch((error) => {
        console.error('Failed to send log to remote:', error);
      });
    }
  }

  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filtered = level
      ? this.logs.filter((log) => log.level === level)
      : this.logs;

    if (limit) {
      filtered = filtered.slice(-limit);
    }

    return filtered;
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const debug = (message: string, context?: Record<string, any>) =>
  logger.debug(message, context);
export const info = (message: string, context?: Record<string, any>) =>
  logger.info(message, context);
export const warn = (message: string, context?: Record<string, any>) =>
  logger.warn(message, context);
export const error = (message: string, err?: Error, context?: Record<string, any>) =>
  logger.error(message, err, context);

