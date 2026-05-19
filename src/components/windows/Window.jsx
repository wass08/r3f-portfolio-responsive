import React, { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WindowFrame } from './WindowFrame';
import { useWindowManager } from '../../hooks/useWindowManager';

/**
 * Window Container Component
 * Renders all open windows and handles their lifecycle
 */
export const Window = ({ appRegistry, onAppSelect }) => {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    getWindowZIndex,
    focusedWindowId,
  } = useWindowManager();

  return (
    <AnimatePresence>
      {windows.map((window) => {
        const app = appRegistry?.[window.app];
        const AppComponent = app?.component;

        return (
          <WindowFrame
            key={window.id}
            id={window.id}
            title={window.title}
            icon={window.icon}
            x={window.x}
            y={window.y}
            width={window.width}
            height={window.height}
            minimized={window.minimized}
            maximized={window.maximized}
            zIndex={getWindowZIndex(window.id)}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onRestore={restoreWindow}
          >
            {AppComponent ? (
              <Suspense fallback={<div className="p-8">Loading...</div>}>
                <AppComponent
                  windowId={window.id}
                  windowData={window}
                  windowState={window.windowState}
                  onAppSelect={onAppSelect}
                />
              </Suspense>
            ) : (
              <div className="p-8 text-neutral-400">
                App not found: {window.app}
              </div>
            )}
          </WindowFrame>
        );
      })}
    </AnimatePresence>
  );
};
