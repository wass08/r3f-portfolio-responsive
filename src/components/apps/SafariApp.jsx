import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  RefreshCw,
  Share2,
  SquareStack,
  PanelLeft,
  MoreHorizontal,
  Loader2,
  X,
  ShieldAlert,
  Link2,
  Bookmark,
  BookmarkPlus,
  Copy,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { useBrowserStore } from '../../store/browserStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useSystemStateStore } from '../../store/systemStateStore';

const INTERNAL_PAGE_RENDERERS = {
  about: {
    title: 'About ArhanOS',
    render: () => (
      <div className="space-y-4 text-neutral-100">
        <div className="text-3xl font-semibold">ArhanOS Safari</div>
        <p className="text-neutral-300">A browser shell for internal routes, live websites, and portfolio navigation.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-medium">Internal routes</div>
            <div className="mt-1 text-xs text-neutral-400">about, projects, skills, contact, terminal, finder, notes, photos, settings</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-medium">Real websites</div>
            <div className="mt-1 text-xs text-neutral-400">GitHub, YouTube, OpenAI, Vercel, and any secure URL.</div>
          </div>
        </div>
      </div>
    ),
  },
  projects: {
    title: 'Projects',
    render: () => (
      <div className="space-y-4 text-neutral-100">
        <div className="text-2xl font-semibold">Projects</div>
        <p className="text-neutral-300">Browse featured work in the portfolio Projects app or jump to the project pages from Spotlight.</p>
      </div>
    ),
  },
  contact: {
    title: 'Contact',
    render: () => (
      <div className="space-y-4 text-neutral-100">
        <div className="text-2xl font-semibold">Contact</div>
        <p className="text-neutral-300">Use the contact app or open live profiles from bookmarks.</p>
      </div>
    ),
  },
  skills: {
    title: 'Skills',
    render: () => (
      <div className="space-y-4 text-neutral-100">
        <div className="text-2xl font-semibold">Skills</div>
        <p className="text-neutral-300">Frontend, backend, AI, and 3D portfolio work.</p>
      </div>
    ),
  },
  terminal: {
    title: 'Terminal',
    render: () => (
      <div className="space-y-4 text-neutral-100">
        <div className="text-2xl font-semibold">Terminal</div>
        <p className="text-neutral-300">Use Terminal for filesystem commands and app launching.</p>
      </div>
    ),
  },
  finder: {
    title: 'Finder',
    render: () => (
      <div className="space-y-4 text-neutral-100">
        <div className="text-2xl font-semibold">Finder</div>
        <p className="text-neutral-300">Navigate the virtual filesystem and preview assets.</p>
      </div>
    ),
  },
  notes: {
    title: 'Notes',
    render: () => (
      <div className="space-y-4 text-neutral-100">
        <div className="text-2xl font-semibold">Notes</div>
        <p className="text-neutral-300">Quick note capture and autosave.</p>
      </div>
    ),
  },
  photos: {
    title: 'Photos',
    render: () => (
      <div className="space-y-4 text-neutral-100">
        <div className="text-2xl font-semibold">Photos</div>
        <p className="text-neutral-300">Wallpaper and media previews render here.</p>
      </div>
    ),
  },
  settings: {
    title: 'Settings',
    render: () => (
      <div className="space-y-4 text-neutral-100">
        <div className="text-2xl font-semibold">Settings</div>
        <p className="text-neutral-300">Theme, wallpaper, and clock preferences live in the system settings app.</p>
      </div>
    ),
  },
};

const DEFAULT_BOOKMARKS = [
  { id: 'github', title: 'GitHub', url: 'https://github.com', favicon: '/icons/github.svg' },
  { id: 'youtube', title: 'YouTube', url: 'https://youtube.com', favicon: '📺' },
  { id: 'openai', title: 'OpenAI', url: 'https://openai.com', favicon: '🤖' },
  { id: 'vercel', title: 'Vercel', url: 'https://vercel.com', favicon: '▲' },
  { id: 'codewitharhan', title: 'CodeWithArhan', url: 'https://youtube.com/@codewitharhanofficial', favicon: '/icons/youtube.png' },
];

const getOriginLabel = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

// Helper to render favicon (image or emoji)
const renderFavicon = (favicon) => {
  if (favicon.startsWith('/') || favicon.endsWith('.svg') || favicon.endsWith('.png')) {
    return <img src={favicon} alt="favicon" className="h-5 w-5 object-contain" />;
  }
  return <span className="text-lg">{favicon}</span>;
};

const SafariApp = () => {
  const {
    tabs,
    activeTabId,
    bookmarks,
    resolveUrl,
    getActiveTab,
    openTab,
    closeTab,
    duplicateTab,
    setActiveTab,
    navigateTab,
    goBack,
    goForward,
    refreshTab,
    addBookmark,
    removeBookmark,
  } = useBrowserStore();
  const { pushNotification } = useNotificationStore();
  const wifiEnabled = useSystemStateStore((state) => state.wifiEnabled);

  const activeTab = getActiveTab();
  const [addressInput, setAddressInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [iframeError, setIframeError] = useState(null);
  const [proxyContent, setProxyContent] = useState(null);
  const progressRef = useRef(null);
  const currentTabId = activeTab?.id;

  useEffect(() => {
    setAddressInput(activeTab?.url || '');
  }, [activeTabId]);

  useEffect(() => {
    if (!activeTab?.loading) {
      setLoadProgress(100);
      window.clearInterval(progressRef.current);
      return;
    }

    setLoadProgress(8);
    window.clearInterval(progressRef.current);
    progressRef.current = window.setInterval(() => {
      setLoadProgress((value) => Math.min(92, value + Math.random() * 12));
    }, 140);

    return () => window.clearInterval(progressRef.current);
  }, [activeTab?.loading, activeTabId]);

  useEffect(() => {
    if (!activeTab?.url) return;
    if (activeTab.url.startsWith('http')) {
      setIframeError(null);
      return;
    }
    setIframeError(null);
  }, [activeTab?.url]);

  // Auto-detect blocked iframes by timeout - most external sites are blocked
  useEffect(() => {
    if (!activeTab?.url?.startsWith('http') || currentTabId !== activeTab.id) return;
    
    const timer = window.setTimeout(() => {
      // Most external sites that try to load in iframe get blocked
      // Show error after load completes (browserStore timeout is 5s)
      setIframeError('Failed to load this site in the sandboxed browser frame.');
    }, 5500);
    
    return () => clearTimeout(timer);
  }, [activeTab?.url, activeTab?.id, currentTabId]);

  useEffect(() => {
  if (!activeTab) {
    openTab('about');
  }
}, [activeTab, openTab]);

  const internalPage = activeTab && !activeTab.url.startsWith('http') ? INTERNAL_PAGE_RENDERERS[activeTab.url] : null;
  const resolvedUrl = useMemo(() => resolveUrl(addressInput || activeTab?.url || 'about'), [addressInput, activeTab?.url, resolveUrl]);

  const navigate = (input) => {
    const nextUrl = resolveUrl(input);
    setIframeError(null);
    navigateTab(activeTabId, nextUrl);
    if (/^https?:\/\//i.test(nextUrl)) {
      pushNotification({
        type: 'safari',
        title: 'Safari navigation',
        description: getOriginLabel(nextUrl),
        source: 'safari',
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(addressInput);
  };

  const handleBookmark = () => {
    if (!activeTab) return;
    addBookmark({ title: activeTab.title, url: activeTab.url, favicon: activeTab.favicon || '🌐' });
    pushNotification({ type: 'safari', title: 'Bookmark saved', description: activeTab.title, source: 'safari' });
  };

  const openBookmark = (bookmark) => {
    setAddressInput(bookmark.url);
    navigate(bookmark.url);
  };

  const renderActiveContent = () => {
    if (!activeTab) {
      return null;
    }

    // Check Wi-Fi state for internet pages
    if (!wifiEnabled && (!activeTab.url || activeTab.url.startsWith('http') || activeTab.url.includes('.'))) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-neutral-100 p-6 text-center">
          <ShieldAlert size={48} className="text-yellow-400 opacity-50" />
          <div className="text-2xl font-medium">You are not connected to the Internet</div>
          <p className="max-w-md text-neutral-400">
            ArhanOS cannot connect to the server because you turned off Wi-Fi in the Control Center.
          </p>
          <button 
            onClick={() => useSystemStateStore.getState().setWifiEnabled(true)}
            className="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-500 rounded-full text-white transition-colors"
          >
            Turn On Wi-Fi
          </button>
        </div>
      );
    }

    if (activeTab.loading) {
      return (
        <div className="flex h-full items-center justify-center gap-3 text-neutral-200">
          <Loader2 size={20} className="animate-spin text-cyan-300" />
          Loading page...
        </div>
      );
    }

    if (activeTab.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-100">
          <ShieldAlert size={40} className="text-red-300" />
          <div className="text-lg font-semibold">Page blocked or unavailable</div>
          <div className="max-w-lg text-center text-sm text-neutral-400">{activeTab.error}</div>
        </div>
      );
    }

    if (internalPage) {
      const Page = internalPage.render;
      return (
        <div className="h-full overflow-auto bg-gradient-to-br from-neutral-950 via-slate-950 to-neutral-900 p-6">
          <Page />
        </div>
      );
    }

    if (!activeTab.url.startsWith('http')) {
      return (
        <div className="flex h-full items-center justify-center text-neutral-300">
          Open a route or website to begin.
        </div>
      );
    }

    if (iframeError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-neutral-950 text-neutral-100">
          <ShieldAlert size={40} className="text-yellow-300" />
          <div className="text-lg font-semibold">Blocked by browser sandbox</div>
          <div className="max-w-xl text-center text-sm text-neutral-400">This website could not be embedded in the sandboxed iframe. Open it externally or try a different site.</div>
          <div className="flex gap-2">
            <button
              onClick={() => window.open(activeTab.url, '_blank', 'noopener,noreferrer')}
              className="rounded-full bg-cyan-400/20 px-4 py-2 text-sm text-cyan-100"
            >
              Open externally
            </button>
            <button
              onClick={async () => {
                try {
                  setProxyContent('Loading...');
                  const proxyUrl = `https://r.jina.ai/http://${activeTab.url.replace(/^https?:\/\//, '')}`;
                  const res = await fetch(proxyUrl);
                  const html = await res.text();
                  setProxyContent(html);
                } catch (err) {
                  setProxyContent('Proxy fetch failed.');
                }
              }}
              className="rounded-full bg-white/5 px-4 py-2 text-sm text-white"
            >
              Open via proxy (limited)
            </button>
          </div>
          {proxyContent && (
            <div className="w-full h-80 mt-4 overflow-auto bg-white/5 p-4 text-sm text-neutral-100">
              {proxyContent === 'Loading...' ? (
                <div>Loading proxied content...</div>
              ) : proxyContent === 'Proxy fetch failed.' ? (
                <div>Proxy failed to fetch this page.</div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: proxyContent }} />
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <iframe
        key={activeTab.id}
        src={activeTab.url}
        title={activeTab.title}
        className="h-full w-full bg-white"
        sandbox="allow-forms allow-scripts allow-popups allow-popups-to-escape-sandbox allow-downloads allow-top-navigation-by-user-activation"
        referrerPolicy="no-referrer"
        loading="eager"
        onLoad={() => {
          const store = useBrowserStore.getState();

          if (store.tabs.some(tab => tab.id === activeTab.id)) {
            store.finishTabLoad(activeTab.id);
          }

          setIframeError(null);
        }}
        onError={() => {
          setIframeError('Failed to load this site in the sandboxed browser frame.');
          useBrowserStore.getState().setTabError(activeTab.id, 'Failed to load this site in the sandboxed browser frame.');
        }}
      />
    );
  };

  const tabProgress = activeTab?.loading ? loadProgress : 100;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-neutral-950 text-white">
      <div className="border-b border-white/10 bg-neutral-950/95 px-3 py-2 backdrop-blur-xl">
        <div className="flex flex-1 items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => (
              <motion.div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveTab(tab.id);
                  }
                }}
                className={`group flex min-w-[180px] items-center gap-2 rounded-t-xl border px-3 py-2 text-left text-xs transition-colors ${tab.id === activeTabId ? 'border-white/15 bg-white/10 text-white' : 'border-transparent bg-white/[0.03] text-neutral-400 hover:bg-white/5'}`}
                whileHover={{ y: -1 }}
                layout
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-[11px]">{tab.favicon || '🌐'}</span>
                <span className="min-w-0 flex-1 truncate">{tab.title || tab.url}</span>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="rounded p-1 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/10 hover:text-white"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
            <button
              onClick={() => openTab('about')}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
              title="New Tab"
            >
              <Plus size={16} />
            </button>
          </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => goBack(activeTabId)}
            disabled={!activeTab || activeTab.historyIndex <= 0}
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => goForward(activeTabId)}
            disabled={!activeTab || activeTab.historyIndex >= activeTab.history.length - 1}
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            title="Forward"
          >
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => refreshTab(activeTabId)}
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            <Globe size={14} className="text-neutral-500" />
            <input
              value={addressInput}
              onChange={(event) => setAddressInput(event.target.value)}
              placeholder="Search or enter website address"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
            />
            <button type="button" onClick={handleBookmark} className="rounded-full p-1 text-neutral-400 hover:bg-white/10 hover:text-white" title="Add Bookmark">
              <BookmarkPlus size={14} />
            </button>
            <button type="submit" className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-medium text-cyan-100 hover:bg-cyan-400/30">
              Go
            </button>
          </form>
          <button className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white" title="Share">
            <Share2 size={16} />
          </button>
          <button onClick={() => setShowSidebar((value) => !value)} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white" title="Sidebar">
            <PanelLeft size={16} />
          </button>
          <button className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white" title="Tabs">
            <SquareStack size={16} />
          </button>
          <button
            onClick={() => setPendingAction(activeTab ? 'more-menu' : null)}
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
            title="More options"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-300" style={{ width: `${tabProgress}%`, opacity: activeTab?.loading ? 1 : 0 }} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              className="hidden w-72 shrink-0 border-r border-white/10 bg-neutral-950/90 p-4 backdrop-blur-xl md:block"
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
            >
              <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-500">
                <Bookmark size={12} />
                Bookmarks
              </div>
              <div className="space-y-2">
                {bookmarks.map((bookmark) => (
                  <button
                    key={bookmark.id}
                    onClick={() => openBookmark(bookmark)}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10"
                  >
                    <div className="text-lg flex-shrink-0">
                      {renderFavicon(bookmark.favicon)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{bookmark.title}</div>
                      <div className="truncate text-xs text-neutral-500">{bookmark.url}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-300">
                <div className="font-medium text-white">Safari intelligence</div>
                <div className="mt-1 text-xs text-neutral-400">Internal routes open native ArhanOS pages. Type a search phrase for web search. Type a domain like github and Safari resolves it automatically.</div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="relative min-w-0 flex-1 bg-neutral-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab?.id || 'empty'}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.985, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.985, filter: 'blur(10px)' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {renderActiveContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-white/10 bg-neutral-950/95 px-4 py-2 text-xs text-neutral-500">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="uppercase tracking-[0.3em] text-neutral-600">Bookmarks</span>
          {bookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => openBookmark(bookmark)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-neutral-300 hover:bg-white/10 flex-shrink-0"
            >
              <div className="h-4 w-4 flex items-center justify-center">
                {renderFavicon(bookmark.favicon)}
              </div>
              <span>{bookmark.title}</span>
            </button>
          ))}
          <button
            onClick={() => removeBookmark(DEFAULT_BOOKMARKS[0].id)}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-neutral-300 hover:bg-white/10"
            title="Remove a bookmark example"
          >
            Remove GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafariApp;
