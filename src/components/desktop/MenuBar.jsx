import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { Bell, Wifi, Battery, Search, ChevronDown, CalendarDays, SlidersHorizontal } from 'lucide-react';
import { useWindowStore } from '../../store/windowStore';
import { useSystemStore } from '../../store/systemStore';
import { useUIStore } from '../../store/uiStore';

/**
 * ArhanOS MenuBar
 * Premium system menu bar with dropdowns, system stats, and notifications
 */
const MenuBar = ({ onSpotlightOpen, onNotificationOpen, onAppOpen }) => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [activeMenu, setActiveMenu] = useState(null);
  const [showClockPanel, setShowClockPanel] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [wifiStrength, setWifiStrength] = useState(4);
  const [zoom, setZoom] = useState(1);
  const { clockPreferences, setClockPreferences } = useSystemStore();
  const {
    windows,
    focusStack,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
  } = useWindowStore();
  const {
    toggleControlCenter,
    // ── Space actions (dynamic) ──────────────────────────────────────────
    spaces,
    activeSpace,
    setActiveSpace,
    nextSpace,
    previousSpace,
    addSpace,
    removeSpace,
    toggleMissionControl,
  } = useUIStore();

  // ─────────────────────────────────────────────────────────────────────────
  // KEYBOARD SHORTCUTS
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey;

      // ── Spotlight ── Cmd/Ctrl + Space ──────────────────────────────────
      if (meta && e.code === 'Space') {
        e.preventDefault();
        if (onSpotlightOpen) onSpotlightOpen();
        return;
      }

      // ── Finder ── Cmd/Ctrl + N ─────────────────────────────────────────
      if (meta && e.key.toLowerCase() === 'n') {
        if (onAppOpen) onAppOpen('finder');
        return;
      }

      // ── Close Window ── Cmd/Ctrl + W ───────────────────────────────────
      if (meta && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        const s = useWindowStore.getState();
        if (s?.focusStack?.length) {
          const top = s.focusStack[s.focusStack.length - 1];
          if (top) s.closeWindow(top);
        }
        return;
      }

      // ── App Switcher ── Cmd/Ctrl + Tab ─────────────────────────────────
      if (meta && e.key === 'Tab') {
        e.preventDefault();
        const s = useWindowStore.getState();
        const stack = s.focusStack || [];
        if (stack.length > 1 && s.focusWindow) {
          const next = stack[stack.length - 2] || stack[0];
          s.focusWindow(next);
        }
        return;
      }

      // ── Mission Control ── Ctrl + Up Arrow (mirrors real macOS) ────────
      if (e.ctrlKey && e.key === 'ArrowUp') {
        e.preventDefault();
        toggleMissionControl();
        return;
      }

      // ── Next Space ── Ctrl + Right Arrow ───────────────────────────────
      if (e.ctrlKey && e.key === 'ArrowRight') {
        e.preventDefault();
        nextSpace();
        return;
      }

      // ── Previous Space ── Ctrl + Left Arrow ────────────────────────────
      if (e.ctrlKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSpace();
        return;
      }

      // ── Jump to Space N ── Ctrl + 1…9 ──────────────────────────────────
      // Works for however many spaces currently exist (dynamic).
      if (e.ctrlKey && /^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const targetIndex = parseInt(e.key, 10) - 1; // 0-based
        const currentSpaces = useUIStore.getState().spaces;
        if (targetIndex < currentSpaces.length) {
          setActiveSpace(currentSpaces[targetIndex].id);
        }
        return;
      }

      // ── Add New Space ── Ctrl + Shift + N ─────────────────────────────
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        addSpace();
        return;
      }

      // ── Remove Active Space ── Ctrl + Shift + W ────────────────────────
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        const { activeSpace: current, spaces: currentSpaces } = useUIStore.getState();
        if (currentSpaces.length > 1) {
          removeSpace(current);
        }
        return;
      }

      // ── Escape closes active menus ──────────────────────────────────────
      if (e.key === 'Escape') {
        setActiveMenu(null);
        return;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSpotlightOpen, onAppOpen, nextSpace, previousSpace, setActiveSpace, addSpace, removeSpace, toggleMissionControl]);

  // ─── Second shortcut handler: zoom (kept separate to mirror original) ───
  const menuRef = useRef(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
        e.preventDefault();
        const focusedWindowId = focusStack[focusStack.length - 1] || null;
        if (focusedWindowId) closeWindow(focusedWindowId);
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoom((prev) => Math.min(prev + 0.1, 1.5));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        setZoom((prev) => Math.max(prev - 0.1, 0.7));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        setZoom(1);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [focusStack, closeWindow]);

  // ─── Clock ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const intervalMs = clockPreferences.showSeconds ? 1000 : 60000;
    setCurrentTime(dayjs());
    const interval = setInterval(() => setCurrentTime(dayjs()), intervalMs);
    return () => clearInterval(interval);
  }, [clockPreferences.showSeconds]);

  useEffect(() => {
    document.body.style.zoom = `${zoom}`;
    return () => { document.body.style.zoom = '1'; };
  }, [zoom]);

  // ─── Helpers ───────────────────────────────────────────────────────────
  const formatClock = (time) => {
    const parts = [];
    if (clockPreferences.showWeekday) parts.push(time.format('ddd'));
    parts.push(time.format('D'));
    if (clockPreferences.showMonth) parts.push(time.format('MMM'));
    parts.push(
      clockPreferences.timeFormat === '24h'
        ? time.format('HH:mm')
        : time.format('h:mm A')
    );
    return parts.join(' ');
  };

  const getActiveAppName = () => {
    if (focusStack.length === 0) return 'Finder';
    const activeWindowId = focusStack[focusStack.length - 1];
    const activeWindow = windows.find((w) => w.id === activeWindowId);
    return activeWindow?.title || 'Finder';
  };

  const getFocusedWindowId = () => focusStack[focusStack.length - 1] || null;

  // ─── Menu Actions ──────────────────────────────────────────────────────
  const handleAboutArhanOS = () => onAppOpen?.('about-os');

  const handleSystemPreferences = () => onAppOpen?.('settings');
  const handleRestart = () => confirm('Are you sure you want to restart?') && window.location.reload();
  const handleShutdown = () => confirm('Are you sure you want to shutdown?') && (window.location.href = '/');
  const handleOpenFinder = () => onAppOpen?.('finder');
  const handleCloseWindow = () => { const id = getFocusedWindowId(); if (id) closeWindow(id); };
  const handleMinimizeWindow = () => { const id = getFocusedWindowId(); if (id) minimizeWindow(id); };
  const handleFocusFinderWindow = () => {
    const finderWindow = windows.find((w) => w.app === 'finder');
    if (finderWindow) { restoreWindow(finderWindow.id); focusWindow(finderWindow.id); return; }
    handleOpenFinder();
  };
  const execEditCommand = (command) => {
    try { document.execCommand(command); } catch (err) { console.warn(`Edit command failed: ${command}`, err); }
  };

  // ─── Menu Definitions ──────────────────────────────────────────────────
  const menus = [
    {
      id: 'arhan',
      label: "Arhan's Portfolio",
      items: [
        { label: 'About ArhanOS', action: handleAboutArhanOS },
        { label: 'System Preferences', action: handleSystemPreferences },
        { label: 'Restart', action: handleRestart },
        { label: 'Shutdown', action: handleShutdown },
      ],
    },
    {
      id: 'finder',
      label: getActiveAppName(),
      items: [
        { label: 'Open Finder', action: handleOpenFinder },
        { label: 'Bring Finder to Front', action: handleFocusFinderWindow },
        { label: 'Minimize Active Window', action: handleMinimizeWindow },
        { label: 'Close Active Window', action: handleCloseWindow },
      ],
    },
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'New Window', action: handleOpenFinder },
        { label: 'Open Safari', action: () => onAppOpen?.('safari') },
        { label: 'Close Window  Ctrl+W', action: handleCloseWindow },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { label: 'Undo  Ctrl+Z', action: () => execEditCommand('undo') },
        { label: 'Redo  Ctrl+Y', action: () => execEditCommand('redo') },
        { label: 'Cut  Ctrl+X', action: () => execEditCommand('cut') },
        { label: 'Copy  Ctrl+C', action: () => execEditCommand('copy') },
        { label: 'Paste  Ctrl+V', action: () => execEditCommand('paste') },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { label: 'Zoom In  Ctrl++', action: () => setZoom((p) => Math.min(p + 0.1, 1.5)) },
        { label: 'Zoom Out  Ctrl+-', action: () => setZoom((p) => Math.max(p - 0.1, 0.7)) },
        { label: 'Reset Zoom  Ctrl+0', action: () => setZoom(1) },
        { label: '─────────────────', action: () => {} },
        { label: 'Mission Control  Ctrl+↑', action: toggleMissionControl },
        { label: 'Next Desktop  Ctrl+→', action: nextSpace },
        { label: 'Prev Desktop  Ctrl+←', action: previousSpace },
        { label: 'New Desktop  Ctrl+Shift+N', action: addSpace },
        {
          label: `Remove Desktop ${activeSpace}  Ctrl+Shift+W`,
          action: () => spaces.length > 1 && removeSpace(activeSpace),
        },
      ],
    },
  ];

  const handleMenuClick = (menuId) => setActiveMenu(activeMenu === menuId ? null : menuId);

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <>
      {/* MenuBar Background */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-md border-b border-white/10 z-[9999] flex items-center px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Left Section - Menus */}
        <div className="flex items-center gap-6 flex-1" ref={menuRef}>
          {/* Apple Logo + first menu */}
          <div className="relative">
            <motion.button
              onClick={() => handleMenuClick('arhan')}
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-1 rounded transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">
                <img src="/images/logo.png" alt="Logo" className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-neutral-200">Arhan's Portfolio</span>
            </motion.button>
            <AnimatePresence>
              {activeMenu === 'arhan' && (
                <motion.div
                  className="absolute top-full left-0 mt-2 bg-neutral-900/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl w-56 py-2 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {menus[0].items.map((item, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => { item.action(); setActiveMenu(null); }}
                      className="block w-full text-left px-4 py-2 text-xs text-neutral-200 hover:bg-primary-500/30 transition-colors"
                      whileHover={{ paddingLeft: '1.25rem' }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Remaining menus */}
          {menus.slice(1).map((menu) => (
            <div key={menu.id} className="relative">
              <motion.button
                onClick={() => handleMenuClick(menu.id)}
                className="text-xs hover:bg-white/10 px-2 py-1 rounded transition-colors text-neutral-200 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {menu.label}
              </motion.button>
              <AnimatePresence>
                {activeMenu === menu.id && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 bg-neutral-900/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl w-64 py-2 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {menu.items.map((item, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => { item.action(); setActiveMenu(null); }}
                        className={`block w-full text-left px-4 py-2 text-xs transition-colors ${
                          item.label.startsWith('─')
                            ? 'text-neutral-600 pointer-events-none'
                            : 'text-neutral-200 hover:bg-primary-500/30'
                        }`}
                        whileHover={item.label.startsWith('─') ? {} : { paddingLeft: '1.25rem' }}
                      >
                        {item.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right Section - System Stats & Clock */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Active Space Indicator */}
          <div className="flex items-center gap-1">
            {spaces.map((space, index) => (
              <button
                key={space.id}
                onClick={() => setActiveSpace(space.id)}
                title={`${space.name}  (Ctrl+${index + 1})`}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeSpace === space.id
                    ? 'bg-cyan-300 scale-125'
                    : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Spotlight */}
          <motion.button
            onClick={onSpotlightOpen}
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Spotlight (Ctrl+Space)"
          >
            <Search size={12} className="text-neutral-400" />
          </motion.button>

          {/* WiFi */}
          <motion.div
            className="flex items-center text-neutral-400 text-xs"
            whileHover={{ color: '#fff' }}
            title={`WiFi: ${wifiStrength}/5`}
          >
            <Wifi size={12} />
          </motion.div>

          {/* Battery */}
          <motion.div
            className="flex items-center gap-1 text-neutral-400 text-xs"
            whileHover={{ color: '#fff' }}
            title={`Battery: ${batteryLevel}%`}
          >
            <Battery
              size={12}
              className={`${
                batteryLevel < 20
                  ? 'text-red-400'
                  : batteryLevel < 50
                  ? 'text-yellow-400'
                  : 'text-green-400'
              }`}
            />
            <span className={`w-6 text-right ${batteryLevel < 20 ? 'text-red-400' : ''}`}>
              {batteryLevel}%
            </span>
          </motion.div>

          {/* Notifications */}
          <motion.button
            onClick={onNotificationOpen}
            className="relative text-neutral-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={12} />
            <motion.span
              className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.button>

          {/* Control Center */}
          <motion.button
            onClick={toggleControlCenter}
            className="relative text-neutral-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Control Center"
          >
            <SlidersHorizontal size={12} />
          </motion.button>

          {/* Clock */}
          <div className="relative ml-2">
            <motion.button
              onClick={() => setShowClockPanel((v) => !v)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-neutral-200 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="min-w-[92px] text-right text-xs font-medium tracking-wide tabular-nums">
                {formatClock(currentTime)}
              </span>
              <ChevronDown size={11} className="text-neutral-500" />
            </motion.button>

            <AnimatePresence>
              {showClockPanel && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-neutral-950/95 p-4 shadow-2xl backdrop-blur-xl"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-500">
                    <CalendarDays size={12} />
                    Calendar
                  </div>
                  <div className="mt-3 text-xl font-semibold text-neutral-100">
                    {currentTime.format('ddd D MMMM')}
                  </div>
                  <div className="mt-1 text-sm text-neutral-300">
                    {currentTime.format(
                      clockPreferences.timeFormat === '24h' ? 'HH:mm' : 'h:mm A'
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-neutral-300">
                    <button
                      onClick={() => setClockPreferences({ timeFormat: '24h' })}
                      className={`rounded-lg px-2 py-1 ${
                        clockPreferences.timeFormat === '24h'
                          ? 'bg-cyan-400/20 text-cyan-200'
                          : 'bg-white/5'
                      }`}
                    >
                      24h
                    </button>
                    <button
                      onClick={() => setClockPreferences({ timeFormat: '12h' })}
                      className={`rounded-lg px-2 py-1 ${
                        clockPreferences.timeFormat === '12h'
                          ? 'bg-cyan-400/20 text-cyan-200'
                          : 'bg-white/5'
                      }`}
                    >
                      12h
                    </button>
                    <button
                      onClick={() =>
                        setClockPreferences({ showSeconds: !clockPreferences.showSeconds })
                      }
                      className={`rounded-lg px-2 py-1 ${
                        clockPreferences.showSeconds
                          ? 'bg-cyan-400/20 text-cyan-200'
                          : 'bg-white/5'
                      }`}
                    >
                      Seconds
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Click outside to close menus */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </>
  );
};

export default MenuBar;
