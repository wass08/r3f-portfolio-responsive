import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Clock3, Trash2, CheckCheck, X } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useSystemStore } from '../../store/systemStore';

const NotificationCenterApp = () => {
  const { items, dismissNotification, clearAll, markAsRead } = useNotificationStore();
  const { clockPreferences, activeWallpaperId, wallpapers } = useSystemStore();

  const latestWallpaper = useMemo(() => wallpapers.find((wallpaper) => wallpaper.id === activeWallpaperId), [activeWallpaperId, wallpapers]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-5 py-4 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Bell size={18} className="text-cyan-300" />
            Notification Center
          </div>
          <div className="text-xs text-neutral-400">System events, app actions, and widgets</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => clearAll()} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-200 hover:bg-white/10">
            Clear all
          </button>
        </div>
      </div>

      <div className="grid gap-4 border-b border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-500">
            <Clock3 size={12} />
            Clock
          </div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">
            {new Intl.DateTimeFormat('en-US', {
              weekday: clockPreferences.showWeekday ? 'short' : undefined,
              month: clockPreferences.showMonth ? 'short' : undefined,
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: clockPreferences.timeFormat === '12h',
            }).format(new Date())}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">Quick Notes</div>
          <div className="mt-2 text-sm text-neutral-300">Notifications surface note saves, wallpaper changes, downloads, and terminal completions.</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">Wallpaper</div>
          <div className="mt-2 text-sm text-neutral-300">{latestWallpaper?.name || 'Unknown wallpaper'}</div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-neutral-400">
            <Bell size={42} className="mb-4 text-neutral-600" />
            <div className="text-lg font-medium text-neutral-200">No notifications</div>
            <div className="mt-1 text-sm text-neutral-500">System notifications will appear here.</div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 18, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 18, scale: 0.98 }}
                  className={`rounded-2xl border px-4 py-3 shadow-lg ${item.read ? 'border-white/10 bg-white/[0.03]' : 'border-cyan-300/30 bg-cyan-400/10'}`}
                  onClick={() => markAsRead(item.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg">{item.type === 'wallpaper' ? '🖼️' : item.type === 'terminal' ? '⌘' : item.type === 'finder' ? '📁' : item.type === 'safari' ? '🧭' : '🔔'}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="truncate font-semibold text-white">{item.title}</div>
                        <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">{item.source}</div>
                      </div>
                      <div className="mt-1 text-sm text-neutral-300">{item.description}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(event) => { event.stopPropagation(); markAsRead(item.id); }} className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white" title="Mark read">
                        <CheckCheck size={14} />
                      </button>
                      <button onClick={(event) => { event.stopPropagation(); dismissNotification(item.id); }} className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white" title="Dismiss">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 bg-black/20 px-4 py-3 text-xs text-neutral-500 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <span>Live system events stay in sync with wallpaper, Finder, Safari, and Terminal.</span>
          <button onClick={() => clearAll()} className="rounded-full bg-white/5 px-3 py-1 text-neutral-300 hover:bg-white/10">
            <Trash2 size={12} className="mr-1 inline-block" /> Clear all
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenterApp;
