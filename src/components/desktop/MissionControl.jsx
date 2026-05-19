import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useWindowStore } from '../../store/windowStore';
import { useUIStore } from '../../store/uiStore';

const MissionControl = ({ isOpen, onClose }) => {
  const { windows, focusWindow } = useWindowStore();
  const {
    spaces,
    activeSpace,
    setActiveSpace,
    nextSpace,
    previousSpace,
    addSpace,
    removeSpace,
  } = useUIStore();

  // Group windows by whichever space they belong to
  const grouped = spaces.map((space) => ({
    space,
    windows: windows.filter((w) => (w.spaceId || 1) === space.id),
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[8400] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-0 z-[8401] flex items-start justify-center p-6 pt-16"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.22 }}
          >
            <div className="w-[min(96vw,1200px)] rounded-[32px] border border-white/10 bg-neutral-950/90 p-5 shadow-2xl backdrop-blur-2xl">
              {/* Header */}
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Monitor size={18} className="text-cyan-300" />
                    Mission Control
                  </div>
                  <div className="text-xs text-neutral-500">
                    Desktop overview · {spaces.length} space{spaces.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Prev / Next */}
                  <button
                    onClick={previousSpace}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-300 hover:bg-white/10"
                    title="Previous Desktop  (Ctrl+←)"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={nextSpace}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-300 hover:bg-white/10"
                    title="Next Desktop  (Ctrl+→)"
                  >
                    <ChevronRight size={14} />
                  </button>

                  {/* Add new desktop – like the "+" in real macOS Mission Control */}
                  <button
                    onClick={addSpace}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-300 hover:bg-cyan-400/20 hover:text-cyan-300"
                    title="New Desktop  (Ctrl+Shift+N)"
                  >
                    <Plus size={14} />
                  </button>

                  <button
                    onClick={onClose}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Space Selector Tabs */}
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {spaces.map((space, index) => (
                  <div key={space.id} className="relative flex items-center group">
                    <button
                      onClick={() => setActiveSpace(space.id)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors pr-7 ${
                        activeSpace === space.id
                          ? 'border-cyan-300/60 bg-cyan-400/15 text-cyan-100'
                          : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10'
                      }`}
                      title={`Ctrl+${index + 1}`}
                    >
                      {space.name}
                    </button>

                    {/* Remove button – only visible on hover, only if more than 1 space */}
                    {spaces.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSpace(space.id);
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 text-white"
                        title={`Remove ${space.name}`}
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                ))}

                {/* Inline + button at the end of the tab row */}
                <button
                  onClick={addSpace}
                  className="rounded-full border border-dashed border-white/20 bg-white/5 px-3 py-2 text-neutral-500 hover:border-cyan-300/40 hover:text-cyan-300 text-sm"
                  title="New Desktop  (Ctrl+Shift+N)"
                >
                  +
                </button>
              </div>

              {/* Space Cards */}
              <div
                className={`grid max-h-[70vh] gap-4 overflow-auto ${
                  grouped.length <= 2
                    ? 'md:grid-cols-2'
                    : grouped.length <= 3
                    ? 'md:grid-cols-3'
                    : 'md:grid-cols-4'
                }`}
              >
                {grouped.map(({ space, windows: spaceWindows }) => (
                  <div
                    key={space.id}
                    className={`rounded-3xl border p-3 ${
                      activeSpace === space.id
                        ? 'border-cyan-300/40 bg-cyan-400/10'
                        : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between text-sm text-white">
                      <span>{space.name}</span>
                      <span className="text-xs text-neutral-500">
                        {spaceWindows.length} window{spaceWindows.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {spaceWindows.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-neutral-500">
                          No windows open
                        </div>
                      ) : (
                        spaceWindows.map((win) => (
                          <button
                            key={win.id}
                            onClick={() => {
                              setActiveSpace(space.id);
                              focusWindow(win.id);
                              onClose?.();
                            }}
                            className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-left hover:bg-white/10"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                              {win.icon || '◻︎'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium text-white">
                                {win.title}
                              </div>
                              <div className="text-xs text-neutral-500">{win.app}</div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Keyboard shortcut hint */}
              <div className="mt-4 text-center text-[10px] text-neutral-600">
                Ctrl+← → to switch · Ctrl+1–{spaces.length} to jump · Ctrl+Shift+N to add · Ctrl+Shift+W to remove
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MissionControl;
              
