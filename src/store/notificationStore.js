import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid/non-secure';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      items: [],

      pushNotification: ({ type = 'system', title, description = '', source = 'system', action = null }) => {
        const item = {
          id: nanoid(),
          type,
          title,
          description,
          source,
          action,
          createdAt: Date.now(),
          read: false,
        };

        set((state) => ({ items: [item, ...state.items].slice(0, 20) }));
        return item;
      },

      markAsRead: (id) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
        })),

      dismissNotification: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'arhanos-notification-store',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useNotificationStore;
