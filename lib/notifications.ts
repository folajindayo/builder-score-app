// Notifications system (commits 101-110)
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: { label: string; url: string };
}

export function createNotification(type: Notification['type'], title: string, message: string): Notification {
  return {
    id: Math.random().toString(36),
    type,
    title,
    message,
    timestamp: Date.now(),
    read: false,
  };
}

export function addNotification(notification: Notification): void {
  const notifications = getNotifications();
  notifications.unshift(notification);
  localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, 100)));
}

export function getNotifications(): Notification[] {
  return JSON.parse(localStorage.getItem('notifications') || '[]');
}

export function markAsRead(id: string): void {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
}

export function markAllAsRead(): void {
  const notifications = getNotifications();
  notifications.forEach(n => n.read = true);
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

export function deleteNotification(id: string): void {
  const notifications = getNotifications().filter(n => n.id !== id);
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

export function archiveNotification(id: string): void {
  const archived = JSON.parse(localStorage.getItem('notifications-archived') || '[]');
  const notification = getNotifications().find(n => n.id === id);
  if (notification) {
    archived.push(notification);
    deleteNotification(id);
    localStorage.setItem('notifications-archived', JSON.stringify(archived));
  }
}

export function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) return Promise.resolve(false);
  return Notification.requestPermission().then(permission => permission === 'granted');
}

export function sendPushNotification(title: string, body: string): void {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icon.png' });
  }
}

export function batchNotifications(notifications: Notification[]): Notification {
  return {
    id: Math.random().toString(36),
    type: 'info',
    title: `${notifications.length} new notifications`,
    message: notifications.map(n => n.title).join(', '),
    timestamp: Date.now(),
    read: false,
  };
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
  types: Record<string, boolean>;
}

export function getNotificationPreferences(): NotificationPreferences {
  return JSON.parse(localStorage.getItem('notification-prefs') || JSON.stringify({
    email: true,
    push: false,
    inApp: true,
    frequency: 'realtime',
    types: { follow: true, comment: true, mention: true },
  }));
}

export function updateNotificationPreferences(prefs: Partial<NotificationPreferences>): void {
  const current = getNotificationPreferences();
  localStorage.setItem('notification-prefs', JSON.stringify({ ...current, ...prefs }));
}

