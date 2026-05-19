import React from "react";

/**
 * App Registry
 * Maps app IDs to their components with lazy loading
 */

// Lazy load existing app components
const AboutApp = React.lazy(() => import("./AboutApp"));
const ProjectsApp = React.lazy(() => import("./ProjectsApp_Enhanced"));
const SkillsApp = React.lazy(() => import("./SkillsApp"));
const TerminalApp = React.lazy(() => import("./TerminalApp"));
const ContentApp = React.lazy(() => import("./ContentApp"));
const ContactApp = React.lazy(() => import("./ContactApp"));
const ResumeApp = React.lazy(() => import("./ResumeApp"));
const AITwinApp = React.lazy(() => import("./AITwinApp_Enhanced"));

// Lazy load Phase 3 apps
const FinderApp = React.lazy(() => import("./FinderApp"));
const SafariApp = React.lazy(() => import("./SafariApp"));
const LaunchpadApp = React.lazy(() => import("./LaunchpadApp"));
const NotificationCenterApp = React.lazy(
  () => import("./NotificationCenterApp"),
);
const CodeWithArhanStudio = React.lazy(() => import("./CodeWithArhanStudio"));
const SaaSDashboard = React.lazy(() => import("./SaaSDashboard"));
const DevTimeline = React.lazy(() => import("./DevTimeline"));
const TrashApp = React.lazy(() => import("./TrashApp"));
const NotesApp = React.lazy(() => import("./NotesApp"));
const PhotosApp = React.lazy(() => import("./PhotosApp"));
const SettingsApp = React.lazy(() => import("./SettingsApp"));
const FileViewerApp = React.lazy(() => import("./FileViewerApp"));
const AboutOSApp = React.lazy(() => import("./AboutOSApp"));

// System Apps
const MailApp = React.lazy(() => import("./MailApp"));
const CalendarApp = React.lazy(() => import("./CalendarApp"));
const MusicApp = React.lazy(() => import("./MusicApp"));
const MessagesApp = React.lazy(() => import("./MessagesApp"));
const AppStoreApp = React.lazy(() => import("./AppStoreApp"));
const MapsApp = React.lazy(() => import("./MapsApp"));
const WeatherApp = React.lazy(() => import("./WeatherApp"));
const StocksApp = React.lazy(() => import("./StocksApp"));
const CalculatorApp = React.lazy(() => import("./CalculatorApp"));

/**
 * App Registry
 * Central mapping of app IDs to components
 */
export const appRegistry = {
  about: {
    id: "about",
    name: "About",
    title: "About Arhan",
    icon: "/icons/info.svg",
    component: AboutApp,
  },
  projects: {
    id: "projects",
    name: "Projects",
    title: "Portfolio Projects",
    icon: "/icons/work.svg",
    component: ProjectsApp,
  },
  skills: {
    id: "skills",
    name: "Skills",
    title: "Technical Skills",
    icon: "/icons/atom.svg",
    component: SkillsApp,
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    title: "Terminal",
    icon: "/images/terminal.png",
    component: TerminalApp,
  },
  content: {
    id: "content",
    name: "Content",
    title: "Content & Videos",
    icon: "/images/notes.png",
    component: ContentApp,
  },
  contact: {
    id: "contact",
    name: "Contact",
    title: "Get in Touch",
    icon: "/images/contact.png",
    component: ContactApp,
  },
  resume: {
    id: "resume",
    name: "Resume",
    title: "Resume & CV",
    icon: "/images/pdf.png",
    component: ResumeApp,
  },
  ai: {
    id: "ai",
    name: "AI Twin",
    title: "Arhan's AI Assistant",
    icon: "/icons/info.svg",
    component: AITwinApp,
  },
  // Phase 3 Apps
  finder: {
    id: "finder",
    name: "Finder",
    title: "Finder",
    icon: "/images/finder.png",
    component: FinderApp,
  },
  safari: {
    id: "safari",
    name: "Safari",
    title: "Safari Browser",
    icon: "/images/safari.png",
    component: SafariApp,
  },
  launchpad: {
    id: "launchpad",
    name: "Launchpad",
    title: "Launchpad",
    icon: "/images/pages.png",
    component: LaunchpadApp,
  },
  notifications: {
    id: "notifications",
    name: "Notifications",
    title: "Notification Center",
    icon: "/images/notes.png",
    component: NotificationCenterApp,
  },
  codewitharhan: {
    id: "codewitharhan",
    name: "CodeWithArhan",
    title: "CodeWithArhan Studio",
    icon: "/icons/youtube.png",
    component: CodeWithArhanStudio,
  },
  saas: {
    id: "saas",
    name: "SaaS Dashboard",
    title: "SaaS Dashboard",
    icon: "/icons/work.svg",
    component: SaaSDashboard,
  },
  devtimeline: {
    id: "devtimeline",
    name: "Dev Timeline",
    title: "Development Journey",
    icon: "/icons/info.svg",
    component: DevTimeline,
  },
  settings: {
    id: "settings",
    name: "Settings",
    title: "System Settings",
    icon: "/images/settings.png",
    component: SettingsApp,
  },
  trash: {
    id: "trash",
    name: "Trash",
    title: "Trash",
    icon: "/images/trash.png",
    component: TrashApp,
  },
  notes: {
    id: "notes",
    name: "Notes",
    title: "Notes",
    icon: "/images/notes.png",
    component: NotesApp,
  },
  photos: {
    id: "photos",
    name: "Photos",
    title: "Photos",
    icon: "/images/photos.png",
    component: PhotosApp,
  },
  mail: {
    id: "mail",
    name: "Mail",
    title: "Mail",
    icon: "✉️",
    component: MailApp,
  },
  calendar: {
    id: "calendar",
    name: "Calendar",
    title: "Calendar",
    icon: "📅",
    component: CalendarApp,
  },
  music: {
    id: "music",
    name: "Music",
    title: "Music",
    icon: "🎵",
    component: MusicApp,
  },
  messages: {
    id: "messages",
    name: "Messages",
    title: "Messages",
    icon: "💬",
    component: MessagesApp,
  },
  appstore: {
    id: "appstore",
    name: "App Store",
    title: "App Store",
    icon: "🛍️",
    component: AppStoreApp,
  },
  maps: {
    id: "maps",
    name: "Maps",
    title: "Maps",
    icon: "🗺️",
    component: MapsApp,
  },
  weather: {
    id: "weather",
    name: "Weather",
    title: "Weather",
    icon: "⛅",
    component: WeatherApp,
  },
  stocks: {
    id: "stocks",
    name: "Stocks",
    title: "Stocks",
    icon: "📈",
    component: StocksApp,
  },
  calculator: {
    id: "calculator",
    name: "Calculator",
    title: "Calculator",
    icon: "🧮",
    component: CalculatorApp,
  },
  "file-viewer": {
    id: "file-viewer",
    name: "File Viewer",
    title: "File Viewer",
    icon: "📄",
    component: FileViewerApp,
  },
  "about-os": {
    id: "about-os",
    name: "About This Mac",
    title: "About ArhanOS",
    icon: "/icons/info.svg",
    component: AboutOSApp,
  },
};

export default appRegistry;
