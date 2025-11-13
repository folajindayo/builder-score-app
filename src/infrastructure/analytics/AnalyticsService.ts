/**
 * Analytics Service Infrastructure
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

export interface IAnalyticsService {
  track(eventName: string, properties?: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
  page(pageName: string, properties?: Record<string, any>): void;
}

export class AnalyticsService implements IAnalyticsService {
  private events: AnalyticsEvent[] = [];

  track(eventName: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: new Date(),
    };

    this.events.push(event);
    
    // In production, send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    this.track('identify', { userId, ...traits });
  }

  page(pageName: string, properties?: Record<string, any>): void {
    this.track('page_view', { page: pageName, ...properties });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}

export const analytics = new AnalyticsService();

