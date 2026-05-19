import { useEffect, useRef } from 'react';
import { useWindowStore } from '../store/windowStore';

/**
 * Hook to manage window focus on mouse events
 */
export const useFocusManager = (windowId, ref) => {
  const storeRef = useRef(useWindowStore());
  
  // Get fresh store reference
  const store = useWindowStore();
  storeRef.current = store;
  
  // Subscribe to focus state
  const isFocused = useWindowStore((state) => state.isWindowFocused(windowId));

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    const handleMouseDown = (e) => {
      // Focus window on any mousedown within the window
      storeRef.current.focusWindow(windowId);
    };

    element.addEventListener('mousedown', handleMouseDown, true); // Use capture phase to ensure it fires before titlebar
    return () => element.removeEventListener('mousedown', handleMouseDown, true);
  }, [windowId, ref]);

  return { isFocused };
};
