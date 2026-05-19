import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { Menu, X, Search, ChevronLeft, SlidersHorizontal, Monitor } from 'lucide-react';
import { useWindowStore } from '../store/windowStore';
import { useWindowManager } from '../hooks/useWindowManager';
import { Wallpaper } from '../components/desktop/Wallpaper_Animated';
import SpotlightApp from '../components/apps/SpotlightApp';
import appRegistry from '../components/apps/index';
import { useSystemStore } from '../store/systemStore';
import { DockIcon } from '../components/desktop/DockIcon';
import ControlCenter from '../components/desktop/ControlCenter';
import MissionControl from '../components/desktop/MissionControl';
import { useUIStore } from '../store/uiStore';

/**
 * Mobile ArhanOS Shell
 * Single fullscreen app experience with compact top bar, dock, and gesture navigation.
 */
export const MobileShell = () => {
  const { windows, focusStack } = useWindowStore();
  const { toggleWindow, focusWindow, closeWindow } = useWindowManager();
  const { theme, clockPreferences } = useSystemStore();

  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [clockNow, setClockNow] = useState(() => new Date());
  const [touchStart, setTouchStart] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const { showControlCenter, showMissionControl, toggleControlCenter, toggleMissionControl, closeAllPanels } = useUIStore();

  const longPressTimer = useRef(null);
  const switcherTimer = useRef(null);

  const activeWindowId = focusStack[focusStack.length - 1] || null;
  const activeWindow = activeWindowId ? windows.find((window) => window.id === activeWindowId) : null;

  const recentWindows = useMemo(() => {
    const orderedIds = [...new Set([...focusStack].reverse())];
    return orderedIds
      .map((id) => windows.find((window) => window.id === id))
      .filter(Boolean)
      .slice(0, 5);
  }, [windows, focusStack]);

  const mobileDockApps = ['finder', 'projects', 'notes', 'terminal', 'settings', 'contact'];

  useEffect(() => {
    const tick = () => setClockNow(new Date());
    tick();

    const interval = window.setInterval(tick, clockPreferences?.showSeconds ? 1000 : 60000);
    return () => window.clearInterval(interval);
  }, [clockPreferences?.showSeconds]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      window.clearTimeout(longPressTimer.current);
      window.clearTimeout(switcherTimer.current);
    };
  }, []);

  const formatClock = (time) => {
    const parts = [];

    if (clockPreferences?.showWeekday) {
      parts.push(dayjs(time).format('ddd'));
    }

    parts.push(dayjs(time).format('D'));

    if (clockPreferences?.showMonth) {
      parts.push(dayjs(time).format('MMM'));
    }

    parts.push(dayjs(time).format(clockPreferences?.timeFormat === '12h' ? 'h:mm A' : 'HH:mm'));

    return parts.join(' ');
  };

  const openLaunchpad = () => {
    toggleWindow('launchpad');
    setShowSpotlight(false);
    setShowMobileMenu(false);
    setShowSwitcher(false);
  };

  const handleSwipeFocus = (direction) => {
    if (recentWindows.length <= 1) {
      return;
    }

    const currentIndex = Math.max(
      0,
      recentWindows.findIndex((window) => window.id === activeWindowId)
    );
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % recentWindows.length
      : (currentIndex - 1 + recentWindows.length) % recentWindows.length;
    const nextWindow = recentWindows[nextIndex];

    if (nextWindow) {
      focusWindow(nextWindow.id);
      setShowSwitcher(true);
      window.clearTimeout(switcherTimer.current);
      switcherTimer.current = window.setTimeout(() => setShowSwitcher(false), 900);
    }
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    setTouchStart(touch.clientX);
    setTouchStartY(touch.clientY);

    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => setShowMobileMenu(true), 550);
  };

  const handleTouchEnd = (event) => {
    window.clearTimeout(longPressTimer.current);

    if (touchStart === null || touchStartY === null) {
      setTouchStart(null);
      setTouchStartY(null);
      return;
    }

    const touch = event.changedTouches[0];
    const diffX = touchStart - touch.clientX;
    const diffY = touchStartY - touch.clientY;

    if (Math.abs(diffY) > Math.abs(diffX) && diffY > 60) {
      openLaunchpad();
    } else if (Math.abs(diffY) > Math.abs(diffX) && diffY < -60) {
      if (activeWindowId) {
        closeWindow(activeWindowId);
      }
    } else if (diffX > 60) {
      handleSwipeFocus('next');
    } else if (diffX < -60) {
      handleSwipeFocus('prev');
    }

    setTouchStart(null);
    setTouchStartY(null);
  };

  const renderApp = (windowData) => {
    if (!windowData) {
      return null;
    }

    const app = appRegistry?.[windowData.app];
    const AppComponent = app?.component;

    if (!AppComponent) {
      return (
        <div className="flex h-full items-center justify-center text-neutral-300">
          App not found: {windowData.app}
        </div>
      );
    }

    return (
      <React.Suspense fallback={<div className="flex h-full items-center justify-center text-neutral-300">Loading...</div>}>
        <AppComponent windowId={windowData.id} windowData={windowData} onAppSelect={toggleWindow} />
      </React.Suspense>
    );
  };

  return (
    <motion.div
      className="relative h-screen w-screen overflow-hidden"
      style={{ background: theme === 'light' ? '#f5f5f5' : '#000' }}
      data-theme={theme}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Wallpaper />

      <div className="fixed left-0 right-0 top-0 z-50 flex h-12 items-center justify-between border-b border-white/10 bg-black/40 px-3 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
            <img src="/images/logo.png" alt="Apple Logo" className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-white">ArhanOS Mobile</div>
            <div className="truncate text-[10px] text-white/50">Single fullscreen app</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/80">
          <button onClick={openLaunchpad} className="rounded-full bg-white/10 p-2" title="Launchpad">
            <Search size={14} />
          </button>
          <button onClick={toggleMissionControl} className="rounded-full bg-white/10 p-2" title="Mission Control">
            <Monitor size={14} />
          </button>
          <button onClick={toggleControlCenter} className="rounded-full bg-white/10 p-2" title="Control Center">
            <SlidersHorizontal size={14} />
          </button>
          <div className="min-w-[96px] text-right text-[11px] font-medium tabular-nums text-white/85">
            {formatClock(clockNow)}
          </div>
          <button onClick={() => setShowMobileMenu((value) => !value)} className="rounded-full bg-white/10 p-2" title="Apps">
            {showMobileMenu ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 pt-12 pb-24">
        <AnimatePresence mode="wait">
          {activeWindow ? (
            <motion.div
              key={activeWindow.id}
              className="h-full w-full"
              initial={{ opacity: 0, x: 18, scale: 0.985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -18, scale: 0.985 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={() => focusWindow(activeWindow.id)}
            >
              {renderApp(activeWindow)}
            </motion.div>
          ) : (
            <motion.div
              key="mobile-home"
              className="flex h-full w-full flex-col items-center justify-center text-neutral-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-4 text-5xl"></div>
              <div className="text-lg font-semibold">ArhanOS Mobile</div>
              <div className="mt-2 text-sm text-neutral-400">Swipe up for Launchpad</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSwitcher && recentWindows.length > 1 && (
          <motion.div
            className="fixed inset-x-0 top-16 z-40 flex justify-center px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="flex max-w-[92vw] gap-3 overflow-x-auto rounded-3xl border border-white/10 bg-black/55 p-3 backdrop-blur-2xl">
              {recentWindows.map((windowData, index) => {
                const app = appRegistry?.[windowData.app];
                const active = windowData.id === activeWindowId;

                return (
                  <motion.button
                    key={windowData.id}
                    onClick={() => focusWindow(windowData.id)}
                    className={`flex w-32 shrink-0 flex-col items-center gap-2 rounded-2xl border px-3 py-3 text-left ${active ? 'border-cyan-300/60 bg-cyan-400/15' : 'border-white/10 bg-white/5'}`}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: active ? 1 : 0.96, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <DockIcon icon={app?.icon} label={app?.title || windowData.title} />
                    </div>
                    <div className="w-full truncate text-xs font-medium text-white">{app?.title || windowData.title}</div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/70 px-3 pb-4 pt-3 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto rounded-3xl bg-white/5 p-2">
          {mobileDockApps.map((appId) => {
            const app = appRegistry?.[appId];

            return (
              <button
                key={appId}
                onClick={() => toggleWindow(appId)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  setShowMobileMenu(true);
                }}
                className="flex min-w-[52px] flex-col items-center gap-1 rounded-2xl px-2 py-2 text-white/80"
              >
                <DockIcon icon={app?.icon} label={app?.title || appId} />
                <span className="text-[10px] text-white/55">{app?.name || appId}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              className="fixed right-0 top-12 h-[calc(100%-3rem)] w-72 border-l border-white/10 bg-neutral-950/95 p-4 backdrop-blur-2xl"
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Apps</h3>
                <button onClick={() => setShowMobileMenu(false)} className="text-white/60">
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {['finder', 'projects', 'notes', 'terminal', 'settings', 'contact', 'launchpad', 'safari'].map((appId) => (
                  <button
                    key={appId}
                    onClick={() => {
                      toggleWindow(appId);
                      setShowMobileMenu(false);
                    }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm text-white"
                  >
                    {appRegistry?.[appId]?.name || appId}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-neutral-300">
                Swipe up opens Launchpad. Swipe down closes the active app. Swipe left or right switches recent apps.
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
                <ChevronLeft size={12} />
                Mobile shell active. Desktop traffic lights are hidden here.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SpotlightApp
        isOpen={showSpotlight}
        onClose={() => setShowSpotlight(false)}
        onAppSelect={(appId) => {
          toggleWindow(appId);
          setShowSpotlight(false);
        }}
      />

      <MissionControl isOpen={showMissionControl} onClose={toggleMissionControl} />
      <ControlCenter isOpen={showControlCenter} onClose={toggleControlCenter} />

      <button
        className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200 backdrop-blur-xl"
        onClick={closeAllPanels}
      >
        Close Panels
      </button>
    </motion.div>
  );
};

export default MobileShell;
