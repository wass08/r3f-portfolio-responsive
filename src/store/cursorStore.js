import { create } from "zustand";

/**
 * Cursor System Store
 * Manages cursor assets, state, and watchdog recovery
 */

// Map cursor types to asset paths (using /public/cursors)
const CURSOR_ASSETS = {
  default: { path: "/cursors/default.svg", hotspot: [0, 0] },
  pointer: { path: "/cursors/handpointing.svg", hotspot: [5, 1] },
  text: { path: "/cursors/textcursor.svg", hotspot: [10, 7] },
  move: { path: "/cursors/move.svg", hotspot: [11, 11] },
  grab: { path: "/cursors/handgrabbing.svg", hotspot: [10, 5] },
  grabbing: { path: "/cursors/handopen.svg", hotspot: [10, 5] },
  wait: { path: "/cursors/busy.svg", hotspot: [11, 11] },
  "not-allowed": { path: "/cursors/notallowed.svg", hotspot: [11, 11] },
  "resize-ns": { path: "/cursors/resizenorthsouth.svg", hotspot: [10, 11] },
  "resize-ew": { path: "/cursors/resizeleftright.svg", hotspot: [11, 10] },
  "resize-nwse": {
    path: "/cursors/resizenorthwestsoutheast.svg",
    hotspot: [11, 11],
  },
  "resize-nesw": {
    path: "/cursors/resizenortheastsouthwest.svg",
    hotspot: [11, 11],
  },
  "resize-n": { path: "/cursors/resizenorth.svg", hotspot: [10, 3] },
  "resize-s": { path: "/cursors/resizesouth.svg", hotspot: [10, 18] },
  "resize-e": { path: "/cursors/resizeeast.svg", hotspot: [18, 10] },
  "resize-w": { path: "/cursors/resizeleft.svg", hotspot: [3, 10] },
  "resize-ne": { path: "/cursors/resizenortheast.svg", hotspot: [18, 3] },
  "resize-nw": { path: "/cursors/resizenorthwest.svg", hotspot: [3, 3] },
  "resize-se": { path: "/cursors/resizesoutheast.svg", hotspot: [18, 18] },
  "resize-sw": { path: "/cursors/resizesouthwest.svg", hotspot: [3, 18] },
  copy: { path: "/cursors/copy.svg", hotspot: [0, 0] },
  "zoom-in": { path: "/cursors/zoomin.svg", hotspot: [10, 10] },
  "zoom-out": { path: "/cursors/zoomout.svg", hotspot: [10, 10] },
};

export const useCursorStore = create((set, get) => ({
  cursorType: "default",
  isVisible: true,
  watchdogActive: false,
  watchdogInterval: null,
  lastValidPosition: { x: -9999, y: -9999 },

  // ─── Set cursor type (triggers visual switch) ───────────────────────
  setCursorType: (type) => {
    const validType = type in CURSOR_ASSETS ? type : "default";
    set({ cursorType: validType });
  },

  // ─── Get cursor asset info ───────────────────────────────────────────
  getCursorAsset: (type = get().cursorType) => {
    return CURSOR_ASSETS[type] || CURSOR_ASSETS.default;
  },

  // ─── Force cursor visibility (recovery action) ──────────────────────
  forceVisibility: () => {
    set({ isVisible: true });
    document.body.style.cursor = "auto";
    // Restore native cursor briefly to force browser to re-render
    setTimeout(() => {
      document.body.style.cursor = "none";
    }, 50);
  },

  // ─── Start watchdog for cursor recovery ──────────────────────────────
  startWatchdog: () => {
    const state = get();
    if (state.watchdogActive) return; // already running

    set({ watchdogActive: true });

    const interval = setInterval(() => {
      const { isVisible, lastValidPosition } = get();

      // If cursor has been invisible for more than 100ms and no movement detected
      if (!isVisible) {
        // Force recovery
        get().forceVisibility();
        set({ isVisible: true });
      }
    }, 150); // Check every 150ms

    set({ watchdogInterval: interval });
  },

  // ─── Stop watchdog ───────────────────────────────────────────────────
  stopWatchdog: () => {
    const { watchdogInterval } = get();
    if (watchdogInterval) {
      clearInterval(watchdogInterval);
      set({ watchdogInterval: null, watchdogActive: false });
    }
  },

  // ─── Record cursor position (for recovery tracking) ───────────────────
  updatePosition: (x, y) => {
    set({ lastValidPosition: { x, y } });
  },

  // ─── Set visibility state ────────────────────────────────────────────
  setVisibility: (visible) => {
    set({ isVisible: visible });
  },

  // ─── Cleanup ──────────────────────────────────────────────────────────
  cleanup: () => {
    get().stopWatchdog();
  },
}));

export default useCursorStore;
