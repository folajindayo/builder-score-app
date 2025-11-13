/**
 * Notification Service Infrastructure
 */

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

export type NotificationHandler = (notification: Notification) => void;

export class NotificationService {
  private handlers: NotificationHandler[] = [];
  private notifications: Notification[] = [];

  /**
   * Subscribe to notifications
   */
  subscribe(handler: NotificationHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  /**
   * Show notification
   */
  notify(
    type: NotificationType,
    title: string,
    message: string,
    duration?: number
  ): string {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      duration,
      timestamp: new Date(),
    };

    this.notifications.push(notification);
    this.handlers.forEach((handler) => handler(notification));

    return notification.id;
  }

  success(title: string, message: string, duration?: number): string {
    return this.notify(NotificationType.SUCCESS, title, message, duration);
  }

  error(title: string, message: string, duration?: number): string {
    return this.notify(NotificationType.ERROR, title, message, duration);
  }

  warning(title: string, message: string, duration?: number): string {
    return this.notify(NotificationType.WARNING, title, message, duration);
  }

  info(title: string, message: string, duration?: number): string {
    return this.notify(NotificationType.INFO, title, message, duration);
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notifications = [];
  }
}

export const notificationService = new NotificationService();

