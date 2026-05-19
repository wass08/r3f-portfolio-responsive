/**
 * Application Constants
 * Static app configurations and defaults
 */

// Dock configuration
export const DOCK_APPS = [
  { id: 'about', name: 'About', icon: '/icons/info.svg' },
  { id: 'projects', name: 'Projects', icon: '/icons/work.svg' },
  { id: 'skills', name: 'Skills', icon: '/icons/atom.svg' },
  { id: 'terminal', name: 'Terminal', icon: '/images/terminal.png' },
  { id: 'content', name: 'Content', icon: '/images/notes.png' },
  { id: 'contact', name: 'Contact', icon: '/images/contact.png' },
  { id: 'resume', name: 'Resume', icon: '/images/pdf.png' },
  { id: 'ai', name: 'AI Twin', icon: '/icons/info.svg' },
  // Phase 3 Apps
  { id: 'finder', name: 'Finder', icon: '/images/finder.png' },
  { id: 'safari', name: 'Safari', icon: '/images/safari.png' },
  { id: 'launchpad', name: 'Launchpad', icon: '/images/pages.png' },
  { id: 'notifications', name: 'Notifications', icon: '/images/notes.png' },
  { id: 'settings', name: 'Settings', icon: '/images/settings.png' },
  { id: 'photos', name: 'Photos', icon: '/images/photos.png' },
  { id: 'codewitharhan', name: 'CodeWithArhan', icon: '/images/notes.png' },
  { id: 'saas', name: 'SaaS', icon: '/icons/work.svg' },
  { id: 'devtimeline', name: 'Timeline', icon: '/icons/info.svg' },
];

// Window defaults
export const WINDOW_DEFAULTS = {
  width: 800,
  height: 600,
  minWidth: 400,
  minHeight: 300,
  maxWidth: 1200,
  maxHeight: 900,
};

// Desktop constants
export const DESKTOP = {
  gridSize: 20,
  dockHeight: 80,
  dockPadding: 16,
  dockItemSize: 48,
  titleBarHeight: 32,
};

// Z-index layers
export const Z_INDEX = {
  wallpaper: 0,
  desktop: 10,
  window: 100,
  modal: 200,
  tooltip: 300,
};

// Animations
export const ANIMATION_TIMING = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
};
