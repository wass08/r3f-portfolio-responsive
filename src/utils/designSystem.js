/**
 * Spacing & Typography System
 * Defines intentional, varied spacing rhythm
 */

// Spacing System - not uniform, varied for intentionality
export const spacingSystem = {
  // Generous whitespace sections
  section: {
    mobile: "py-12 px-6",
    tablet: "py-16 px-8",
    desktop: "py-20 px-24",
  },
  
  // Tight spacing for grouped elements
  group: "space-y-3",
  
  // Medium spacing between sections
  medium: "space-y-8",
  
  // Large breathing room
  large: "space-y-12",
  
  // Extra large for major sections
  extraLarge: "space-y-16",
};

// Typography Hierarchy
export const typography = {
  // Hero title - dominant
  hero: {
    className: "text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight",
  },
  
  // Section title - strong
  sectionTitle: {
    className: "text-3xl md:text-4xl font-display font-bold",
  },
  
  // Subsection title
  subsectionTitle: {
    className: "text-2xl md:text-3xl font-display font-semibold",
  },
  
  // Card title
  cardTitle: {
    className: "text-lg md:text-xl font-bold",
  },
  
  // Body text - comfortable
  body: {
    className: "text-base md:text-lg leading-relaxed",
  },
  
  // Small text
  small: {
    className: "text-sm text-neutral-400",
  },
  
  // Label
  label: {
    className: "text-xs uppercase tracking-wider font-semibold",
  },
};

// Color hierarchy - not all bright
export const colorHierarchy = {
  // Primary attention-grabbers
  primary: "text-primary-400",
  
  // Secondary emphasis
  secondary: "text-accent-400",
  
  // Tertiary - subdued
  tertiary: "text-neutral-400",
  
  // Disabled/lowest priority
  muted: "text-neutral-500",
};

/**
 * Create intentional layout rhythm using CSS Grid
 * Asymmetric proportions for human design feel
 */
export const gridLayouts = {
  // 2-1-2 asymmetric rhythm
  asymmetric2Col: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  
  // Varied card sizes - featured larger
  featuredGrid: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max",
  
  // Masonry-like but with gaps
  staggered: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-max",
};

export default {
  spacingSystem,
  typography,
  colorHierarchy,
  gridLayouts,
};
