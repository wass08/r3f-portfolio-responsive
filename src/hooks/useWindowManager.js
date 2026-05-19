import { useCallback } from 'react';
import { useWindowStore } from '../store/windowStore';
import { useAppStore } from '../store/appStore';
import { useUIStore } from '../store/uiStore';

/**
 * Hook to interact with window manager
 * Provides common window operations
 */
export const useWindowManager = () => {
  const windowStore = useWindowStore();
  const appStore = useAppStore();
  const activeSpace = useUIStore((state) => state.activeSpace);

  const openWindow = useCallback(
    (appId) => {
      const app = appStore.getApp(appId);
      if (!app) {
        console.warn(`App not found: ${appId}`);
        return;
      }

      windowStore.openWindow({
        id: `${appId}-main`,
        app: appId,
        title: app.title,
        icon: app.icon,
      });
    },
    [windowStore, appStore]
  );

  /**
   * Smart toggle: open/restore/focus depending on state
   * - If window doesn't exist: open new
   * - If minimized: restore
   * - If already open: focus
   */
  const toggleWindow = useCallback(
    (appId) => {
      const windowId = `${appId}-main`;
      const window = windowStore.getWindow(windowId);

      if (!window) {
        // Window doesn't exist - create new
        openWindow(appId);
      } else if (window.minimized) {
        // Window is minimized - restore
        windowStore.restoreWindow(windowId);
        windowStore.focusWindow(windowId);
      } else {
        // Window is already open - focus it
        windowStore.focusWindow(windowId);
      }
    },
    [windowStore, appStore, openWindow]
  );

  const closeWindow = useCallback(
    (windowId) => {
      windowStore.closeWindow(windowId);
    },
    [windowStore]
  );

  const focusWindow = useCallback(
    (windowId) => {
      windowStore.focusWindow(windowId);
    },
    [windowStore]
  );

  const minimizeWindow = useCallback(
    (windowId) => {
      windowStore.minimizeWindow(windowId);
    },
    [windowStore]
  );

  const maximizeWindow = useCallback(
    (windowId) => {
      windowStore.maximizeWindow(windowId);
    },
    [windowStore]
  );

  const restoreWindow = useCallback(
    (windowId) => {
      windowStore.restoreWindow(windowId);
    },
    [windowStore]
  );

  return {
    // State
    windows: windowStore.windows.filter((window) => window.spaceId === activeSpace),
    focusStack: windowStore.focusStack,
    focusedWindowId: windowStore.getFocusedWindowId(),

    // Actions
    openWindow,
    toggleWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,

    // Selectors
    getWindow: windowStore.getWindow,
    getWindowZIndex: windowStore.getWindowZIndex,
    isWindowFocused: windowStore.isWindowFocused,
    getVisibleWindows: windowStore.getVisibleWindows,
  };
};
