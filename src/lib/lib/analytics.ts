/**
 * Analytics Utilities
 * Track user events and metrics
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private enabled: boolean;
  private queue: AnalyticsEvent[] = [];

  constructor() {
    this.enabled = process.env.NODE_ENV === "production";
  }

  /**
   * Track an event
   */
  track(name: string, properties?: Record<string, any>): void {
    if (!this.enabled) {
      console.log("[Analytics]", name, properties);
      return;
    }

    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
    };

    this.queue.push(event);
    this.flush();
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string): void {
    this.track("page_view", {
      path,
      title: title || document.title,
      referrer: document.referrer,
    });
  }

  /**
   * Track user action
   */
  action(action: string, category?: string, label?: string): void {
    this.track("user_action", {
      action,
      category,
      label,
    });
  }

  /**
   * Track error
   */
  error(error: Error, context?: Record<string, any>): void {
    this.track("error", {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  /**
   * Flush events to analytics service
   */
  private flush(): void {
    if (this.queue.length === 0) return;

    // In production, send to analytics service
    // For now, just clear the queue
    if (this.enabled) {
      // TODO: Send to analytics service
    }

    this.queue = [];
  }

  /**
   * Identify user
   */
  identify(userId: string, traits?: Record<string, any>): void {
    this.track("identify", {
      userId,
      ...traits,
    });
  }
}

export const analytics = new Analytics();
export { Analytics };
