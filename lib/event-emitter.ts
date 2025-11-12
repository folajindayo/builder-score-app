/**
 * Simple event emitter implementation
 */

type EventHandler<T = unknown> = (data: T) => void;

export class EventEmitter<T extends Record<string, unknown> = Record<string, unknown>> {
  private handlers: Map<keyof T, Set<EventHandler>> = new Map();

  /**
   * Subscribe to an event
   */
  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as EventHandler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler as EventHandler);
    };
  }

  /**
   * Emit an event
   */
  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  /**
   * Remove all handlers for an event
   */
  off<K extends keyof T>(event: K): void {
    this.handlers.delete(event);
  }

  /**
   * Remove all handlers
   */
  clear(): void {
    this.handlers.clear();
  }
}

