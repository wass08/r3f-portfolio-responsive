import { useEffect, useRef } from 'react';
import { useWindowStore } from '../store/windowStore';
import { constrainWindowPosition } from '../utils/windowUtils';

const SNAP_THRESHOLD = 24;

const getSnapLayout = (x, y) => {
  const nearLeft = x <= SNAP_THRESHOLD;
  const nearRight = x >= window.innerWidth - SNAP_THRESHOLD;
  const nearTop = y <= SNAP_THRESHOLD;

  if (nearTop && nearLeft) return 'top-left';
  if (nearTop && nearRight) return 'top-right';
  if (nearTop) return 'top';
  if (nearLeft) return 'left';
  if (nearRight) return 'right';

  return null;
};

const getSnapBounds = (layout) => {
  const padding = 16;
  const width = window.innerWidth - padding * 2;
  const height = window.innerHeight - padding * 2;
  const halfWidth = Math.floor(width / 2);
  const halfHeight = Math.floor(height / 2);

  if (layout === 'left') {
    return { x: padding, y: padding, width: halfWidth, height };
  }

  if (layout === 'right') {
    return { x: padding + halfWidth, y: padding, width: width - halfWidth, height };
  }

  if (layout === 'top-left') {
    return { x: padding, y: padding, width: halfWidth, height: halfHeight };
  }

  if (layout === 'top-right') {
    return {
      x: padding + halfWidth,
      y: padding,
      width: width - halfWidth,
      height: halfHeight,
    };
  }

  if (layout === 'top') {
    return { x: padding, y: padding, width, height };
  }

  return null;
};

/**
 * Hook to handle window dragging
 * @param {string} windowId - Window ID to drag
 * @param {React.RefObject} dragHandleRef - Ref to the drag handle element (usually titlebar)
 */
export const useDragWindow = (windowId, dragHandleRef) => {
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startWindowX: 0,
    startWindowY: 0,
  });

  const windowStore = useWindowStore();
  const storeRef = useRef(windowStore);
  storeRef.current = windowStore;

  useEffect(() => {
    const dragHandle = dragHandleRef?.current;
    if (!dragHandle) return;

    const handleMouseDown = (e) => {
      // Only drag from titlebar
      if (e.button !== 0) return; // Left click only

      let currentWindow = storeRef.current.getWindow(windowId);
      if (!currentWindow) return;

      if (currentWindow.snappedLayout) {
        storeRef.current.unsnapWindow(windowId);
        currentWindow = storeRef.current.getWindow(windowId);
      }

      storeRef.current.clearSnapPreview();

      dragState.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startWindowX: currentWindow.x,
        startWindowY: currentWindow.y,
      };

      // Focus window on drag
      storeRef.current.focusWindow(windowId);

      // Add drag listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!dragState.current.isDragging) return;

      const currentWindow = storeRef.current.getWindow(windowId);
      if (!currentWindow) return;

      const deltaX = e.clientX - dragState.current.startX;
      const deltaY = e.clientY - dragState.current.startY;

      const newX = dragState.current.startWindowX + deltaX;
      const newY = dragState.current.startWindowY + deltaY;

      // Constrain to viewport
      const { x, y } = constrainWindowPosition(
        newX,
        newY,
        currentWindow.width,
        currentWindow.height
      );

      storeRef.current.dragWindow(windowId, x, y);

      const snapLayout = getSnapLayout(e.clientX, e.clientY);
      if (snapLayout) {
        storeRef.current.setSnapPreview({
          windowId,
          layout: snapLayout,
          bounds: getSnapBounds(snapLayout),
        });
      } else {
        storeRef.current.clearSnapPreview();
      }
    };

    const handleMouseUp = () => {
      const preview = storeRef.current.snapPreview;
      if (preview && preview.windowId === windowId) {
        if (preview.layout === 'top') {
          storeRef.current.maximizeWindow(windowId);
        } else if (preview.bounds) {
          storeRef.current.applySnapLayout(windowId, preview.layout, preview.bounds);
        }
      }

      storeRef.current.clearSnapPreview();
      dragState.current.isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    dragHandle.addEventListener('mousedown', handleMouseDown);

    return () => {
      dragHandle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [windowId, dragHandleRef]);
};
