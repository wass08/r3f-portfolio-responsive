import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { WindowTitleBar } from './WindowTitleBar';
import { useDragWindow } from '../../hooks/useDragWindow';
import { useFocusManager } from '../../hooks/useFocusManager';
import { WINDOW_ANIMATIONS } from '../../utils/animations';

/**
 * Window Frame Component
 * Draggable window wrapper with titlebar and content
 */
export const WindowFrame = React.forwardRef(
  (
    {
      id,
      title,
      icon,
      children,
      x = 100,
      y = 100,
      width = 800,
      height = 600,
      minimized = false,
      maximized = false,
      zIndex = 100,
      onClose,
      onMinimize,
      onMaximize,
      onRestore,
      className = '',
    },
    ref
  ) => {
    const titleBarRef = useRef(null);
    const windowRef = useRef(null);

    // Setup dragging
    useDragWindow(id, titleBarRef);

    // Setup focus management
    const { isFocused } = useFocusManager(id, windowRef);

    // Handle window controls
    const handleClose = () => {
      if (onClose) onClose(id);
    };

    const handleMinimize = () => {
      if (onMinimize) onMinimize(id);
    };

    // Toggle between maximize and restore
    const handleMaximize = () => {
      if (maximized) {
        // Window is maximized, so restore it
        if (onRestore) onRestore(id);
      } else {
        // Window is not maximized, so maximize it
        if (onMaximize) onMaximize(id);
      }
    };

    // Don't render if minimized
    if (minimized) return null;

    // Maximized dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const padding = 16;

    const displayX = maximized ? padding : x;
    const displayY = maximized ? padding : y;
    const displayWidth = maximized ? windowWidth - padding * 2 : width;
    const displayHeight = maximized ? windowHeight - padding * 2 : height;
    const isHidden = minimized;

    return (
      <motion.div
        ref={ref || windowRef}
        className={`
          fixed flex flex-col
          bg-neutral-900 border border-neutral-700/50
          rounded-xl overflow-hidden
          ${className}
        `}
        layout
        style={{
          x: displayX,
          y: displayY,
          width: displayWidth,
          height: displayHeight,
          zIndex,
          pointerEvents: isHidden ? 'none' : 'auto',
        }}
        initial={{ opacity: 0, scale: 0.94, y: displayY + 10 }}
        animate={{
          opacity: isHidden ? 0 : 1,
          scale: isHidden ? 0.82 : 1,
          y: isHidden ? displayY + 24 : displayY,
          boxShadow: isFocused
            ? '0 30px 60px -12px rgba(56, 189, 248, 0.15), 0 18px 36px -8px rgba(0, 0, 0, 0.3)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
          borderColor: isFocused ? 'rgba(56, 189, 248, 0.2)' : 'rgba(100, 116, 139, 0.3)',
        }}
        exit={{ opacity: 0, scale: 0.9, y: displayY + 16 }}
        transition={{
          ...WINDOW_ANIMATIONS.open.transition,
          boxShadow: { duration: 0.2 },
          opacity: { duration: isHidden ? 0.22 : 0.18 },
          scale: { duration: isHidden ? 0.22 : 0.18 },
          y: { duration: isHidden ? 0.22 : 0.18 },
        }}
        onMouseDown={() => {
          // Focus on click (will be handled by useFocusManager)
        }}
        whileHover={{
          borderColor: isFocused ? 'rgba(56, 189, 248, 0.3)' : 'rgba(100, 116, 139, 0.4)',
        }}
      >
        {/* Title Bar */}
        <WindowTitleBar
          ref={titleBarRef}
          title={title}
          icon={icon}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          isMaximized={maximized}
          isFocused={isFocused}
        />

        {/* Content */}
        <div className={`flex-1 overflow-auto ${isHidden ? 'pointer-events-none' : ''}`}>
          {children}
        </div>
      </motion.div>
    );
  }
);

WindowFrame.displayName = 'WindowFrame';
