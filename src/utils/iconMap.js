/**
 * Icon mapping for system apps
 * Maps app IDs to actual image file paths from /public
 */
export const APP_ICON_MAP = {
  // System apps with PNG files
  finder: '/images/finder.png',
  safari: '/images/safari.png',
  notes: '/images/notes.png',
  photos: '/images/photos.png',
  terminal: '/images/terminal.png',
  settings: '/images/settings.png',
  trash: '/images/trash.png',
  
  // System apps with SVG files
  mail: '/icons/mail.svg',
  calendar: '/icons/calendar.svg',
  music: '/icons/music.svg',
  messages: '/icons/messages.svg',
  calculator: '/icons/calculator.svg',
  maps: '/icons/maps.svg',
  weather: '/icons/weather.svg',
  stocks: '/icons/stocks.svg',
  appstore: '/icons/appstore.svg',
  
  // Portfolio apps
  about: '/icons/info.svg',
  projects: '/icons/work.svg',
  skills: '/icons/atom.svg',
  resume: '/images/pdf.png',
  contact: '/images/contact.png',
  
  // Links
  github: '/icons/github.svg',
};

/**
 * Get icon path for an app
 */
export const getAppIcon = (appId) => {
  return APP_ICON_MAP[appId] || null;
};

/**
 * Check if an icon path is a valid image path
 */
export const isImagePath = (iconPath) => {
  if (!iconPath) return false;
  return typeof iconPath === 'string' && (iconPath.startsWith('/') || iconPath.startsWith('http'));
};

/**
 * Get emoji fallback if image fails to load
 */
export const EMOJI_FALLBACK = {
  finder: '📁',
  safari: '🔍',
  mail: '✉️',
  calendar: '📅',
  notes: '📝',
  photos: '🖼️',
  terminal: '⌨️',
  settings: '⚙️',
  music: '🎵',
  messages: '💬',
  calculator: '🧮',
  maps: '🗺️',
  weather: '⛅',
  stocks: '📈',
  appstore: '🛍️',
  trash: '🗑️',
  github: '🐙',
  resume: '📄',
  contact: '📧',
  about: 'ℹ️',
  projects: '💻',
  skills: '⚡',
};

/**
 * Get emoji fallback for an app
 */
export const getAppEmoji = (appId) => {
  return EMOJI_FALLBACK[appId] || '🧩';
};

export default APP_ICON_MAP;
