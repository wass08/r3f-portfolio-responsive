import React from 'react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../../store/systemStore';
import { useWindowStore } from '../../store/windowStore';
import { useNotificationStore } from '../../store/notificationStore';

const SettingsApp = () => {
  const {
    wallpapers,
    activeWallpaperId,
    setWallpaper,
    animationsEnabled,
    toggleAnimations,
    theme,
    setTheme,
    clockPreferences,
    setClockPreferences,
  } = useSystemStore();
  const { windows, focusStack } = useWindowStore();
  const { pushNotification } = useNotificationStore();

  return (
    <div className="h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100 overflow-auto">
      <div className="p-6 space-y-6">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="flex items-center gap-3 mb-4">
            <button
              className={`px-3 py-1 rounded-md text-sm ${theme === 'dark' ? 'bg-cyan-500/25 border border-cyan-300/60' : 'bg-white/10'}`}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
            <button
              onClick={() => setTheme('light')}
            >
              Light
            </button>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={animationsEnabled}
              onChange={toggleAnimations}
              className="accent-cyan-400"
            />
            Enable animations
          </label>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-4">Wallpaper</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-2">
            {wallpapers.map((wallpaper) => (
              <motion.button
                key={wallpaper.id}
                onClick={() => {
                  setWallpaper(wallpaper.id);
                  pushNotification({ type: 'wallpaper', title: 'Wallpaper changed', description: wallpaper.name, source: 'settings' });
                }}
                className={`rounded-xl border p-2 text-left flex-shrink-0 ${activeWallpaperId === wallpaper.id ? 'border-cyan-300 bg-cyan-500/20' : 'border-white/15 bg-white/5'}`}
                whileHover={{ scale: 1.02 }}
              >
                {wallpaper.type === 'gradient' ? (
                  <div
                    className="w-full h-16 rounded-lg mb-2"
                    style={{ background: wallpaper.value }}
                  />
                ) : (
                  <img
                    src={wallpaper.value}
                    alt={wallpaper.name}
                    className="w-full h-16 rounded-lg mb-2 object-cover"
                  />
                )}
                <div className="text-xs text-neutral-200 line-clamp-2">{wallpaper.name}</div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-4">Clock</h2>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              className={`px-3 py-1 rounded-md text-sm ${clockPreferences.timeFormat === '24h' ? 'bg-cyan-500/25 border border-cyan-300/60' : 'bg-white/10'}`}
              onClick={() => setClockPreferences({ timeFormat: '24h' })}
            >
              24h default
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${clockPreferences.timeFormat === '12h' ? 'bg-cyan-500/25 border border-cyan-300/60' : 'bg-white/10'}`}
              onClick={() => setClockPreferences({ timeFormat: '12h' })}
            >
              12h
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {[
              { key: 'showWeekday', label: 'Show weekday' },
              { key: 'showMonth', label: 'Show month' },
              { key: 'showSeconds', label: 'Show seconds' },
            ].map((item) => (
              <label key={item.key} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <input
                  type="checkbox"
                  checked={Boolean(clockPreferences[item.key])}
                  onChange={(event) => setClockPreferences({ [item.key]: event.target.checked })}
                  className="accent-cyan-400"
                />
                {item.label}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-3">System Info</h2>
          <div className="text-sm text-neutral-300 space-y-1">
            <p>OS: ArhanOS Portfolio 1.0</p>
            <p>Engine: React + Vite + Zustand + Framer Motion</p>
            <p>Open windows: {windows.length}</p>
            <p>Focused stack depth: {focusStack.length}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-3">Performance</h2>
          <div className="text-sm text-neutral-300 space-y-1">
            <p>Window compositor: active</p>
            <p>Snap engine: active</p>
            <p>Desktop interactivity: active</p>
            <p>Persistence: local storage enabled</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg">
          <h2 className="text-lg font-semibold mb-2">About ArhanOS</h2>
          <p className="text-sm text-neutral-300">
            A premium operating system simulation for portfolio storytelling.
          </p>
        </section>
      </div>
    </div>
  );
};

export default SettingsApp;
