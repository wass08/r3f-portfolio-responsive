import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUIStore } from "./uiStore";

// Default window dimensions
const DEFAULT_WINDOW_WIDTH = 800;
const DEFAULT_WINDOW_HEIGHT = 600;

// Generate default position based on stacking
const generateWindowPosition = (index = 0) => ({
  x: 50 + index * 30,
  y: 50 + index * 30,
});

/**
 * Window State Store
 * Manages all open windows, their positions, focus state, and interactions
 */
export const useWindowStore = create(
  persist(
    (set, get) => ({
      windows: [],
      focusStack: [],
      snapPreview: null,

      // ============ CORE OPERATIONS ============

      /**
       * Open a new window or focus existing
       * @param {Object} config - { id?, app, title?, icon?, x?, y?, width?, height?, state? }
       */
      openWindow: (config) =>
        set((state) => {
          const id = config.id || `${config.app}-${Date.now()}`;

          // Check if window already open
          const existing = state.windows.find((w) => w.id === id);
          if (existing) {
            // Just focus it
            const newFocusStack = state.focusStack.filter((wid) => wid !== id);
            newFocusStack.push(id);
            return { focusStack: newFocusStack };
          }

          // Create new window
          const position = generateWindowPosition(state.windows.length);
          const newWindow = {
            id,
            app: config.app,
            title: config.title || config.app,
            icon: config.icon || "📦",
            x: config.x ?? position.x,
            y: config.y ?? position.y,
            width: config.width ?? DEFAULT_WINDOW_WIDTH,
            height: config.height ?? DEFAULT_WINDOW_HEIGHT,
            minimized: false,
            maximized: false,
            snappedLayout: null,
            previousBounds: null,
            spaceId: config.spaceId || useUIStore.getState().activeSpace || 1,
            windowState: config.state || null, // Store any additional state/data
          };

          return {
            windows: [...state.windows, newWindow],
            focusStack: [...state.focusStack, id],
          };
        }),

      /**
       * Close a window
       */
      closeWindow: (id) =>
        set((state) => ({
          windows: state.windows.filter((w) => w.id !== id),
          focusStack: state.focusStack.filter((wid) => wid !== id),
        })),

      /**
       * Focus a window (bring to front)
       */
      focusWindow: (id) =>
        set((state) => {
          const newFocusStack = state.focusStack.filter((wid) => wid !== id);
          newFocusStack.push(id);
          return { focusStack: newFocusStack };
        }),

      /**
       * Move a window to new position
       */
      dragWindow: (id, x, y) =>
        set((state) => ({
          windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
        })),

      setWindowBounds: (id, bounds) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  x: bounds.x ?? w.x,
                  y: bounds.y ?? w.y,
                  width: bounds.width ?? w.width,
                  height: bounds.height ?? w.height,
                  maximized: false,
                  minimized: false,
                }
              : w,
          ),
        })),

      /**
       * Resize a window
       */
      resizeWindow: (id, width, height) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, width, height } : w,
          ),
        })),

      /**
       * Minimize a window
       */
      minimizeWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, minimized: true, maximized: false } : w,
          ),
        })),

      /**
       * Maximize a window
       */
      maximizeWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  previousBounds: {
                    x: w.x,
                    y: w.y,
                    width: w.width,
                    height: w.height,
                  },
                  maximized: true,
                  minimized: false,
                  snappedLayout: null,
                }
              : w,
          ),
        })),

      /**
       * Restore a window (unminimize/unmaximize)
       */
      restoreWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  minimized: false,
                  maximized: false,
                  snappedLayout: null,
                  ...(w.previousBounds || {}),
                }
              : w,
          ),
        })),

      applySnapLayout: (id, layout, bounds) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  previousBounds: w.previousBounds || {
                    x: w.x,
                    y: w.y,
                    width: w.width,
                    height: w.height,
                  },
                  x: bounds.x,
                  y: bounds.y,
                  width: bounds.width,
                  height: bounds.height,
                  maximized: false,
                  minimized: false,
                  snappedLayout: layout,
                }
              : w,
          ),
        })),

      unsnapWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id !== id || !w.snappedLayout || !w.previousBounds) {
              return w;
            }

            return {
              ...w,
              ...w.previousBounds,
              snappedLayout: null,
            };
          }),
        })),

      setSnapPreview: (preview) => set({ snapPreview: preview }),
      clearSnapPreview: () => set({ snapPreview: null }),

      /**
       * Close all windows
       */
      closeAllWindows: () =>
        set(() => ({
          windows: [],
          focusStack: [],
        })),

      // ============ SELECTORS / HELPERS ============

      /**
       * Get the currently focused window ID
       */
      getFocusedWindowId: () => {
        const state = get();
        return state.focusStack[state.focusStack.length - 1] || null;
      },

      /**
       * Get the z-index for a given window
       */
      getWindowZIndex: (id) => {
        const state = get();
        const index = state.focusStack.indexOf(id);
        return index >= 0 ? index + 100 : 1;
      },

      /**
       * Check if a window is currently focused
       */
      isWindowFocused: (id) => {
        return get().getFocusedWindowId() === id;
      },

      /**
       * Get a specific window by ID
       */
      getWindow: (id) => {
        const state = get();
        return state.windows.find((w) => w.id === id);
      },

      /**
       * Get all visible windows (not minimized)
       */
      getVisibleWindows: () => {
        const state = get();
        return state.windows.filter((w) => !w.minimized);
      },

      /**
       * Get all minimized windows
       */
      getMinimizedWindows: () => {
        const state = get();
        return state.windows.filter((w) => w.minimized);
      },
    }),
    {
      name: "arhanos-window-store",
      partialize: (state) => ({
        windows: state.windows,
        focusStack: state.focusStack,
      }),
    },
  ),
);
