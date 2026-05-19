import { create } from "zustand";

/**
 * App Store
 * Manages app configuration and metadata
 */
export const useAppStore = create((set) => ({
  // App registry with metadata
  apps: {
    about: {
      id: "about",
      name: "About",
      title: "About Arhan",
      icon: "/icons/info.svg",
      description: "Learn about me",
    },
    projects: {
      id: "projects",
      name: "Projects",
      title: "Portfolio Projects",
      icon: "/icons/work.svg",
      description: "My work and creations",
    },
    skills: {
      id: "skills",
      name: "Skills",
      title: "Technical Skills",
      icon: "/icons/atom.svg",
      description: "Languages and technologies",
    },
    terminal: {
      id: "terminal",
      name: "Terminal",
      title: "Terminal",
      icon: "/images/terminal.png",
      description: "Interactive terminal",
    },
    content: {
      id: "content",
      name: "Content",
      title: "Content & Videos",
      icon: "/icons/youtube.png",
      description: "YouTube and media",
    },
    contact: {
      id: "contact",
      name: "Contact",
      title: "Get in Touch",
      icon: "/images/contact.png",
      description: "Contact information",
    },
    resume: {
      id: "resume",
      name: "Resume",
      title: "Resume & CV",
      icon: "/images/pdf.png",
      description: "Interactive resume",
    },
    ai: {
      id: "ai",
      name: "AI Twin",
      title: "Arhan's AI Assistant",
      icon: "/icons/info.svg",
      description: "AI portfolio assistant",
    },
    finder: {
      id: "finder",
      name: "Finder",
      title: "Finder",
      icon: "/images/finder.png",
      description: "Portfolio file explorer",
    },
    safari: {
      id: "safari",
      name: "Safari",
      title: "Safari Browser",
      icon: "/images/safari.png",
      description: "Internal web browser",
    },
    launchpad: {
      id: "launchpad",
      name: "Launchpad",
      title: "Launchpad",
      icon: "/images/pages.png",
      description: "App grid launcher",
    },
    notifications: {
      id: "notifications",
      name: "Notifications",
      title: "Notification Center",
      icon: "/images/notes.png",
      description: "System notifications",
    },
    codewitharhan: {
      id: "codewitharhan",
      name: "CodeWithArhan",
      title: "CodeWithArhan Studio",
      icon: "/images/notes.png",
      description: "YouTube content dashboard",
    },
    saas: {
      id: "saas",
      name: "SaaS Dashboard",
      title: "SaaS Dashboard",
      icon: "/icons/work.svg",
      description: "Product metrics",
    },
    devtimeline: {
      id: "devtimeline",
      name: "Dev Timeline",
      title: "Development Journey",
      icon: "/icons/info.svg",
      description: "Career timeline",
    },
    settings: {
      id: "settings",
      name: "Settings",
      title: "System Settings",
      icon: "/images/settings.png",
      description: "Appearance, wallpaper, and system preferences",
    },
    trash: {
      id: "trash",
      name: "Trash",
      title: "Trash",
      icon: "/images/trash.png",
      description: "Deleted files and restore",
    },
    notes: {
      id: "notes",
      name: "Notes",
      title: "Notes",
      icon: "/images/notes.png",
      description: "Sticky notes, autosave",
    },
    photos: {
      id: "photos",
      name: "Photos",
      title: "Photos",
      icon: "/images/photos.png",
      description: "Photo gallery",
    },
    "about-os": {
      id: "about-os",
      name: "About This Mac",
      title: "About ArhanOS",
      icon: "/icons/info.svg",
      description: "System information",
    },
    mail: {
      id: "mail",
      name: "Mail",
      title: "Mail",
      icon: "/icons/mail.svg",
      description: "Email application",
    },
    calendar: {
      id: "calendar",
      name: "Calendar",
      title: "Calendar",
      icon: "/icons/calendar.svg",
      description: "Calendar and events",
    },
    music: {
      id: "music",
      name: "Music",
      title: "Music",
      icon: "/icons/music.svg",
      description: "Music player",
    },
    messages: {
      id: "messages",
      name: "Messages",
      title: "Messages",
      icon: "/icons/messages.svg",
      description: "Messaging application",
    },
    appstore: {
      id: "appstore",
      name: "App Store",
      title: "App Store",
      icon: "/icons/appstore.svg",
      description: "App marketplace",
    },
    maps: {
      id: "maps",
      name: "Maps",
      title: "Maps",
      icon: "/icons/maps.svg",
      description: "Maps and navigation",
    },
    weather: {
      id: "weather",
      name: "Weather",
      title: "Weather",
      icon: "/icons/weather.svg",
      description: "Weather information",
    },
    stocks: {
      id: "stocks",
      name: "Stocks",
      title: "Stocks",
      icon: "/icons/stocks.svg",
      description: "Stock market data",
    },
    calculator: {
      id: "calculator",
      name: "Calculator",
      title: "Calculator",
      icon: "/icons/calculator.svg",
      description: "Calculator utility",
    },
    "file-viewer": {
      id: "file-viewer",
      name: "File Viewer",
      title: "File Viewer",
      icon: "📄",
      description: "View files opened from Finder",
    },
  },

  /**
   * Get app by ID
   */
  getApp: (appId) => {
    const state = useAppStore.getState();
    return state.apps[appId] || null;
  },

  /**
   * Get all apps as array
   */
  getAllApps: () => {
    const state = useAppStore.getState();
    return Object.values(state.apps);
  },
}));
