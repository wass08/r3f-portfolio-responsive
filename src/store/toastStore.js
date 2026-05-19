import { create } from "zustand";

export const useToastStore = create((set, get) => ({
  toasts: [],

  pushToast: (toast) => {
    const id = toast.id || `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const next = { id, ...toast };
    set((s) => ({ toasts: [...s.toasts, next] }));

    if (toast.duration !== false) {
      const duration =
        typeof toast.duration === "number" ? toast.duration : 5000;
      setTimeout(() => get().removeToast(id), duration);
    }

    return id;
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

export default useToastStore;
