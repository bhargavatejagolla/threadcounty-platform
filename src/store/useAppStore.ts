import { create } from 'zustand';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  read: boolean;
}

export interface ActivityItem {
  id: string;
  action: string;
  timestamp: number;
  icon?: string;
  details?: string;
}

interface AppState {
  // Global Event Bus
  lastEvent: { type: string; payload: any; timestamp: number } | null;
  fireEvent: (type: string, payload?: any) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  
  getUnreadCount: () => number;

  // Activity Feed
  activityFeed: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  clearActivityFeed: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  lastEvent: null,
  
  fireEvent: (type, payload) => {
    set({ lastEvent: { type, payload, timestamp: Date.now() } });
    console.log(`[EventBus] ${type}`, payload || '');
  },

  notifications: [],
  
  addNotification: (notif) => {
    const newNotification: Notification = {
      ...notif,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50), // keep last 50
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    }));
  },

  clearNotifications: () => set({ notifications: [] }),

  getUnreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  },

  activityFeed: [],

  addActivity: (activity) => {
    const newItem: ActivityItem = {
      ...activity,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    set((state) => ({
      activityFeed: [newItem, ...state.activityFeed].slice(0, 100), // keep last 100
    }));
  },

  clearActivityFeed: () => set({ activityFeed: [] }),
}));
