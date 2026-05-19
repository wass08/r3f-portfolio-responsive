import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSystemStateStore } from '../store/systemStateStore';

/**
 * Global Brightness Overlay
 * Applies a dimming overlay based on system brightness setting
 * Affects entire OS, creating consistent visual feedback
 */
export const BrightnessOverlay = () => {
  const { brightness } = useSystemStateStore();

  // Calculate overlay opacity: 0% brightness = fully dark, 100% brightness = no overlay
  const overlayOpacity = (100 - brightness) / 100;

  return (
    <motion.div
      className="fixed inset-0 z-[7999] pointer-events-none bg-black"
      animate={{ opacity: overlayOpacity }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    />
  );
};

export default BrightnessOverlay;
