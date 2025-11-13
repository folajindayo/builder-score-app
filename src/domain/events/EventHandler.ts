/**
 * Domain Event Handler Interface
 */

import { DomainEvent } from './DomainEvent';

export interface IEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void> | void;
}

export class EventBus {
  private handlers: Map<string, IEventHandler<any>[]> = new Map();

  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: IEventHandler<T>
  ): void {
    const existing = this.handlers.get(eventType) || [];
    this.handlers.set(eventType, [...existing, handler]);
  }

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || [];
    await Promise.all(handlers.map((h) => h.handle(event)));
  }
}

