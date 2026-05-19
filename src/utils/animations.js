/**
 * Animation Configurations
 * Framer Motion variants and transitions
 */

// Spring configuration (from config.js)
export const SPRING_CONFIG = {
  type: 'spring',
  mass: 5,
  stiffness: 500,
  damping: 55,
  restDelta: 0.0001,
};

// Window animations
export const WINDOW_ANIMATIONS = {
  // Window open
  open: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: SPRING_CONFIG,
  },

  // Window focus (subtle)
  focus: {
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
    transition: { duration: 0.2 },
  },

  // Window unfocus
  unfocus: {
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2 },
  },
};

// Dock animations
export const DOCK_ANIMATIONS = {
  // Icon hover
  iconHover: {
    scale: 1.15,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },

  // Icon click
  iconTap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },

  // Dock container
  dock: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    transition: {
      ...SPRING_CONFIG,
      delay: 0.3,
    },
  },
};

// Wallpaper animations
export const WALLPAPER_ANIMATIONS = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 2 },
  },
};

// Desktop animations
export const DESKTOP_ANIMATIONS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

// Shared transitions
export const TRANSITIONS = {
  default: SPRING_CONFIG,
  fast: { duration: 0.2 },
  slow: { duration: 0.5 },
};
