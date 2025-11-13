/**
 * Domain Event Base Class
 * 
 * Base class for all domain events.
 */

import { IDomainEvent } from '../types';

export abstract class DomainEvent implements IDomainEvent {
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly eventType: string;

  constructor(aggregateId: string, eventType: string) {
    this.aggregateId = aggregateId;
    this.eventType = eventType;
    this.occurredAt = new Date();
  }

  /**
   * Get event metadata
   */
  abstract getEventData(): Record<string, any>;

  /**
   * Convert to plain object
   */
  toObject(): Record<string, any> {
    return {
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      occurredAt: this.occurredAt.toISOString(),
      data: this.getEventData(),
    };
  }
}

