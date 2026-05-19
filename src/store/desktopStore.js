import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_DESKTOP_ICONS = [
  // Row 1 - Essential System Apps
  {
    id: "finder",
    name: "Finder",
    appId: "finder",
    type: "app",
    icon: "/images/finder.png",
    x: 40,
    y: 72,
  },
  {
    id: "safari",
    name: "Safari",
    appId: "safari",
    type: "app",
    icon: "/images/safari.png",
    x: 160,
    y: 72,
  },
  {
    id: "mail",
    name: "Mail",
    appId: "mail",
    type: "app",
    icon: "/icons/mail.svg",
    x: 280,
    y: 72,
  },
  {
    id: "calendar",
    name: "Calendar",
    appId: "calendar",
    type: "app",
    icon: "/icons/calendar.svg",
    x: 400,
    y: 72,
  },

  // Row 2 - Essential System Apps
  {
    id: "notes",
    name: "Notes",
    appId: "notes",
    type: "app",
    icon: "/images/notes.png",
    x: 40,
    y: 168,
  },
  {
    id: "photos",
    name: "Photos",
    appId: "photos",
    type: "app",
    icon: "/images/photos.png",
    x: 160,
    y: 168,
  },
  {
    id: "terminal",
    name: "Terminal",
    appId: "terminal",
    type: "app",
    icon: "/images/terminal.png",
    x: 280,
    y: 168,
  },
  {
    id: "settings",
    name: "Settings",
    appId: "settings",
    type: "app",
    icon: "/images/settings.png",
    x: 400,
    y: 168,
  },

  // Row 3 - Tools & Utilities
  {
    id: "music",
    name: "Music",
    appId: "music",
    type: "app",
    icon: "/icons/music.svg",
    x: 40,
    y: 264,
  },
  {
    id: "calculator",
    name: "Calculator",
    appId: "calculator",
    type: "app",
    icon: "/icons/calculator.svg",
    x: 160,
    y: 264,
  },
  {
    id: "weather",
    name: "Weather",
    appId: "weather",
    type: "app",
    icon: "/icons/weather.svg",
    x: 280,
    y: 264,
  },
  {
    id: "maps",
    name: "Maps",
    appId: "maps",
    type: "app",
    icon: "/icons/maps.svg",
    x: 400,
    y: 264,
  },

  // Row 4 - Personal / Work Apps (folder)
  {
    id: "work-folder",
    name: "Work",
    appId: "work-folder",
    type: "folder",
    icon: "/images/folder.png",
    x: 40,
    y: 360,
  },

  // Row 5 - Documents
  {
    id: "resume",
    name: "Resume.pdf",
    appId: "resume",
    type: "file",
    icon: "/images/pdf.png",
    x: 160,
    y: 360,
  },
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/ArhanAnsari",
    type: "link",
    icon: "/icons/github.svg",
    x: 280,
    y: 360,
  },
  {
    id: "youtube",
    name: "YouTube",
    url: "https://youtube.com/@codewitharhanofficial",
    type: "link",
    icon: "/icons/youtube.png",
    x: 400,
    y: 360,
  },

  // Dock / system
  {
    id: "trash",
    name: "Trash",
    appId: "trash",
    type: "system",
    icon: "/images/trash.png",
    x: 20,
    y: 640,
  },
];

export const useDesktopStore = create(
  persist(
    (set, get) => ({
      icons: DEFAULT_DESKTOP_ICONS,
      selectedIconIds: [],
      contextMenu: { visible: false, x: 0, y: 0 },

      selectIcon: (iconId, additive = false) => {
        set((state) => ({
          selectedIconIds: additive
            ? Array.from(new Set([...state.selectedIconIds, iconId]))
            : [iconId],
        }));
      },

      selectIconsByRect: (rect) => {
        const { icons } = get();
        const selected = icons
          .filter((icon) => {
            const iconRect = { x: icon.x, y: icon.y, width: 84, height: 92 };
            return !(
              rect.x + rect.width < iconRect.x ||
              iconRect.x + iconRect.width < rect.x ||
              rect.y + rect.height < iconRect.y ||
              iconRect.y + iconRect.height < rect.y
            );
          })
          .map((icon) => icon.id);

        set({ selectedIconIds: selected });
      },

      clearSelection: () => set({ selectedIconIds: [] }),

      moveIcon: (iconId, x, y) =>
        set((state) => ({
          icons: state.icons.map((icon) =>
            icon.id === iconId
              ? {
                  ...icon,
                  x: Math.max(20, Math.min(x, window.innerWidth - 100)),
                  y: Math.max(48, Math.min(y, window.innerHeight - 140)),
                }
              : icon,
          ),
        })),

      resetIconPositions: () => set({ icons: DEFAULT_DESKTOP_ICONS }),

      deleteIcon: (iconId) =>
        set((state) => ({ icons: state.icons.filter((i) => i.id !== iconId) })),

      renameIcon: (iconId, name) =>
        set((state) => ({
          icons: state.icons.map((icon) =>
            icon.id === iconId
              ? {
                  ...icon,
                  name,
                }
              : icon,
          ),
        })),

      showContextMenu: (x, y) => set({ contextMenu: { visible: true, x, y } }),
      hideContextMenu: () =>
        set({ contextMenu: { visible: false, x: 0, y: 0 } }),
    }),
    {
      name: "arhanos-desktop-store",
      partialize: (state) => ({ icons: state.icons }),
    },
  ),
);

export default useDesktopStore;
