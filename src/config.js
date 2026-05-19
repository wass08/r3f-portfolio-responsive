// Framer Motion Spring Configuration
// Used across all animations for consistent feel
export const framerMotionConfig = {
  type: "spring",
  mass: 5,
  stiffness: 500,
  damping: 55,
  restDelta: 0.0001,
};

// Note: Theme state has been migrated to Zustand
// See: src/store/themeStore.js
