export interface AnalyticsEvent {
  id: string;
  type: string;
  userId?: string;
  properties: Record<string, any>;
  timestamp: string;
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  track(type: string, properties: Record<string, any>, userId?: string): void {
    const event: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type,
      userId,
      properties,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);

    // In production, send to analytics service
    console.log("Analytics event:", event);
  }

  getEvents(filters?: {
    type?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): AnalyticsEvent[] {
    let filteredEvents = [...this.events];

    if (filters?.type) {
      filteredEvents = filteredEvents.filter((e) => e.type === filters.type);
    }

    if (filters?.userId) {
      filteredEvents = filteredEvents.filter((e) => e.userId === filters.userId);
    }

    if (filters?.startDate) {
      filteredEvents = filteredEvents.filter(
        (e) => e.timestamp >= filters.startDate!
      );
    }

    if (filters?.endDate) {
      filteredEvents = filteredEvents.filter(
        (e) => e.timestamp <= filters.endDate!
      );
    }

    return filteredEvents;
  }

  getEventCounts(type?: string): Record<string, number> {
    const events = type
      ? this.events.filter((e) => e.type === type)
      : this.events;

    const counts: Record<string, number> = {};

    for (const event of events) {
      counts[event.type] = (counts[event.type] || 0) + 1;
    }

    return counts;
  }

  getUserActivity(userId: string, limit?: number): AnalyticsEvent[] {
    const userEvents = this.events.filter((e) => e.userId === userId);

    return limit ? userEvents.slice(-limit) : userEvents;
  }
}

export const analyticsService = new AnalyticsService();

