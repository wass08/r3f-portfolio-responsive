import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DockIcon } from './DockIcon';
import { DOCK_APPS, DESKTOP } from '../../utils/constants';
import { DOCK_ANIMATIONS } from '../../utils/animations';

/**
 * Dock Component
 * Bottom dock with app launcher icons + magnification effects
 */
export const Dock = ({ onAppOpen }) => {
  const [hoveredApp, setHoveredApp] = useState(null);
  const [mouseX, setMouseX] = useState(null);
  const [bouncedApp, setBouncedApp] = useState(null);

  useEffect(() => {
    if (!bouncedApp) return;
    const timer = window.setTimeout(() => setBouncedApp(null), 450);
    return () => window.clearTimeout(timer);
  }, [bouncedApp]);

  const handleAppClick = (appId) => {
    setBouncedApp(appId);
    if (onAppOpen) {
      onAppOpen(appId);
    }
  };

  const getScaleForIcon = (appId, index) => {
    if (!hoveredApp || mouseX === null) return 1;
    if (appId === hoveredApp) return 1.4;
    
    // Icons to left and right get slight scale boost
    const distance = Math.abs(index - DOCK_APPS.findIndex(app => app.id === hoveredApp));
    if (distance === 1) return 1.2;
    if (distance === 2) return 1.1;
    return 1;
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-[9000] pointer-events-none"
      variants={DOCK_ANIMATIONS.dock}
      initial="initial"
      animate="animate"
    >
      <div className="flex justify-center pb-6">
        <motion.div
          className="flex gap-2 px-4 py-3 rounded-2xl bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50 shadow-2xl pointer-events-auto"
          layout
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMouseX(e.clientX - rect.left);
          }}
          onMouseLeave={() => setMouseX(null)}
        >
          {DOCK_APPS.map((app, index) => (
            <motion.div
              key={app.id}
              className="relative cursor-pointer"
              animate={{
                scale: getScaleForIcon(app.id, index),
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
              }}
            >
              <DockIcon
                icon={app.icon}
                label={app.name}
                bounce={bouncedApp === app.id}
                onClick={() => handleAppClick(app.id)}
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
              />

              {/* App name tooltip */}
              {hoveredApp === app.id && (
                <motion.div
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-neutral-800 text-neutral-200 text-xs whitespace-nowrap pointer-events-none"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                >
                  {app.name}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};
