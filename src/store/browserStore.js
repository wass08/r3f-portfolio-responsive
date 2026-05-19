import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid/non-secure";

const INTERNAL_ROUTES = {
  about: { title: "About ArhanOS", kind: "internal", url: "about" },
  projects: { title: "Projects", kind: "internal", url: "projects" },
  contact: { title: "Contact", kind: "internal", url: "contact" },
  skills: { title: "Skills", kind: "internal", url: "skills" },
  terminal: { title: "Terminal", kind: "internal", url: "terminal" },
  finder: { title: "Finder", kind: "internal", url: "finder" },
  notes: { title: "Notes", kind: "internal", url: "notes" },
  photos: { title: "Photos", kind: "internal", url: "photos" },
  settings: { title: "Settings", kind: "internal", url: "settings" },
  launchpad: { title: "Launchpad", kind: "internal", url: "launchpad" },
};

const DEFAULT_BOOKMARKS = [
  { id: "github", title: "GitHub", url: "https://github.com", favicon: "/icons/github.svg" },
  { id: "youtube", title: "YouTube", url: "https://youtube.com", favicon: "/icons/youtube.png" },
  { id: "openai", title: "OpenAI", url: "https://openai.com", favicon: "🤖" },
  { id: "vercel", title: "Vercel", url: "https://vercel.com", favicon: "▲" },
  {
    id: "codewitharhan",
    title: "CodeWithArhan",
    url: "https://youtube.com/@codewitharhanofficial",
    favicon: "/icons/youtube.png",
  },
];

const DEFAULT_INTERNAL_PAGES = {
  about: {
    title: "About ArhanOS",
    content:
      "ArhanOS Portfolio is a macOS-inspired interactive portfolio environment.",
  },
  projects: {
    title: "Projects",
    content: "Browse Arhan’s project catalog from the Projects app or Finder.",
  },
  contact: {
    title: "Contact",
    content: "Reach out through the Contact app or bookmarked profiles.",
  },
  skills: {
    title: "Skills",
    content: "Frontend, backend, AI, 3D, and product design experiences.",
  },
  terminal: {
    title: "Terminal",
    content: "Use Terminal for filesystem commands and quick app launch.",
  },
  finder: {
    title: "Finder",
    content: "Navigate the virtual filesystem and manage files.",
  },
  notes: {
    title: "Notes",
    content: "Capture notes, ideas, and snippets.",
  },
  photos: {
    title: "Photos",
    content: "Browse generated wallpaper and media assets.",
  },
  settings: {
    title: "Settings",
    content: "Adjust wallpaper, clock, appearance, and preferences.",
  },
  launchpad: {
    title: "Launchpad",
    content: "Open any installed app from the grid.",
  },
};

const isExternalUrl = (url) => /^https?:\/\//i.test(url);

const normalizeUrlInput = (value) => {
  const input = value.trim();

  if (!input) return "about";

  const internal = INTERNAL_ROUTES[input.toLowerCase()];
  if (internal) return internal.url;

  if (
    /^https?:\/\//i.test(input) ||
    /^mailto:/i.test(input) ||
    /^about:/i.test(input)
  ) {
    return input;
  }

  if (input.includes(".") && !input.includes(" ")) {
    return `https://${input}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(input)}`;
};

const resolveTitle = (url) => {
  const internal = INTERNAL_ROUTES[url?.toLowerCase?.()];
  if (internal) return internal.title;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("github")) return "GitHub";
    if (host.includes("youtube")) return "YouTube";
    if (host.includes("openai")) return "OpenAI";
    if (host.includes("vercel")) return "Vercel";
    if (host === "www.google.com" && parsed.pathname === "/search") {
      return "Search Results";
    }
  } catch {}

  return url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "New Tab";
};

const createTab = (url = "about") => {
  const resolvedUrl = normalizeUrlInput(url);

  return {
    id: nanoid(),
    title: resolveTitle(resolvedUrl),
    url: resolvedUrl,
    favicon: isExternalUrl(resolvedUrl) ? "🌐" : "",
    history: [resolvedUrl],
    historyIndex: 0,
    loading: false,
    error: null,
  };
};

const initialTabs = [createTab("about")];

const scheduleLoadFallback = (tabId, get) => {
  window.setTimeout(() => {
    const tab = get().tabs.find((t) => t.id === tabId);

    if (tab?.loading) {
      get().finishTabLoad(tabId);
    }
  }, 5000);
};

const updateTabNavigation = (tab, url, historyIndex = tab.historyIndex) => ({
  ...tab,
  url,
  title: resolveTitle(url),
  favicon: isExternalUrl(url) ? "🌐" : "",
  historyIndex,
  loading: isExternalUrl(url),
  error: null,
});

export const useBrowserStore = create(
  persist(
    (set, get) => ({
      tabs: initialTabs,
      activeTabId: initialTabs[0].id,
      bookmarks: DEFAULT_BOOKMARKS,
      internalPages: DEFAULT_INTERNAL_PAGES,

      resolveUrl: normalizeUrlInput,
      resolveTitle,

      getActiveTab: () => {
        const state = get();
        return (
          state.tabs.find((tab) => tab.id === state.activeTabId) ||
          state.tabs[0] ||
          null
        );
      },

      openTab: (url = "about") =>
        set((state) => {
          const nextTab = createTab(url);

          return {
            tabs: [...state.tabs, nextTab],
            activeTabId: nextTab.id,
          };
        }),

      closeTab: (tabId) =>
        set((state) => {
          if (state.tabs.length <= 1) {
            const fallback = createTab("about");
            return {
              tabs: [fallback],
              activeTabId: fallback.id,
            };
          }

          const tabs = state.tabs.filter((tab) => tab.id !== tabId);

          return {
            tabs,
            activeTabId:
              state.activeTabId === tabId
                ? tabs[tabs.length - 1]?.id || tabs[0]?.id
                : state.activeTabId,
          };
        }),

      duplicateTab: (tabId) => {
        const tab = get().tabs.find((t) => t.id === tabId);
        if (!tab) return;

        const duplicated = {
          ...tab,
          id: nanoid(),
          history: [...tab.history],
          loading: false,
          error: null,
        };

        set((state) => ({
          tabs: [...state.tabs, duplicated],
          activeTabId: duplicated.id,
        }));
      },

      setActiveTab: (tabId) => set({ activeTabId: tabId }),

      navigateTab: (tabId, urlInput) => {
        const resolvedUrl = normalizeUrlInput(urlInput);

        set((state) => ({
          tabs: state.tabs.map((tab) => {
            if (tab.id !== tabId) return tab;

            const nextHistory = tab.history.slice(0, tab.historyIndex + 1);
            nextHistory.push(resolvedUrl);

            return {
              ...updateTabNavigation(
                tab,
                resolvedUrl,
                nextHistory.length - 1
              ),
              history: nextHistory,
            };
          }),
          activeTabId: tabId,
        }));

        if (isExternalUrl(resolvedUrl)) {
          scheduleLoadFallback(tabId, get);
        }
      },

      finishTabLoad: (tabId) =>
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === tabId ? { ...tab, loading: false } : tab
          ),
        })),

      goBack: (tabId) => {
        let targetUrl = null;

        set((state) => ({
          tabs: state.tabs.map((tab) => {
            if (tab.id !== tabId || tab.historyIndex <= 0) return tab;

            const historyIndex = tab.historyIndex - 1;
            targetUrl = tab.history[historyIndex];

            return updateTabNavigation(tab, targetUrl, historyIndex);
          }),
        }));

        if (targetUrl && isExternalUrl(targetUrl)) {
          scheduleLoadFallback(tabId, get);
        }
      },

      goForward: (tabId) => {
        let targetUrl = null;

        set((state) => ({
          tabs: state.tabs.map((tab) => {
            if (tab.id !== tabId || tab.historyIndex >= tab.history.length - 1)
              return tab;

            const historyIndex = tab.historyIndex + 1;
            targetUrl = tab.history[historyIndex];

            return updateTabNavigation(tab, targetUrl, historyIndex);
          }),
        }));

        if (targetUrl && isExternalUrl(targetUrl)) {
          scheduleLoadFallback(tabId, get);
        }
      },

      refreshTab: (tabId) => {
        const tab = get().tabs.find((t) => t.id === tabId);
        if (!tab) return;

        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === tabId
              ? {
                  ...t,
                  loading: isExternalUrl(t.url),
                  error: null,
                }
              : t
          ),
        }));

        if (isExternalUrl(tab.url)) {
          scheduleLoadFallback(tabId, get);
        }
      },

      setTabError: (tabId, error) =>
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === tabId
              ? { ...tab, loading: false, error }
              : tab
          ),
        })),

      addBookmark: (bookmark) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks.filter(
              (b) =>
                b.title !== bookmark.title &&
                b.url !== bookmark.url
            ),
            { ...bookmark, id: bookmark.id || nanoid() },
          ],
        })),

      removeBookmark: (bookmarkId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter(
            (b) => b.id !== bookmarkId
          ),
        })),

      resetBookmarks: () =>
        set({ bookmarks: DEFAULT_BOOKMARKS }),
    }),
    {
      name: "arhanos-browser-store",

      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        bookmarks: state.bookmarks,
      }),

      merge: (persistedState, currentState) => {
        const merged = {
          ...currentState,
          ...persistedState,
        };

        if (!merged.tabs?.length) {
          const fallback = createTab("about");
          merged.tabs = [fallback];
          merged.activeTabId = fallback.id;
        }

        return merged;
      },
    }
  )
);

export default useBrowserStore;
