import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SunMedium, Volume2, Wifi, Bluetooth, MoonStar, Wallpaper, PanelRightClose } from 'lucide-react';
import { useSystemStore } from '../../store/systemStore';
import { useSystemStateStore } from '../../store/systemStateStore';
import { useUIStore } from '../../store/uiStore';

const ControlCenter = ({ isOpen, onClose }) => {
  const { wallpapers, activeWallpaperId, setWallpaper, theme, setTheme } = useSystemStore();
  const { brightness, setBrightness, wifiEnabled, setWifiEnabled } = useSystemStateStore();
  const {
    volumeLevel,
    setVolumeLevel,
    bluetoothEnabled,
    toggleBluetooth,
    doNotDisturb,
    toggleDoNotDisturb,
  } = useUIStore();

  const quickWallpapers = wallpapers.slice(0, 4);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-[8500] bg-black/25 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside className="fixed right-3 top-10 z-[8501] w-[min(92vw,360px)] overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/95 shadow-2xl backdrop-blur-2xl" initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ type: 'spring', damping: 22, stiffness: 260 }}>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">Control Center</div>
                <div className="text-[11px] text-neutral-500">Quick system toggles</div>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white">
                <PanelRightClose size={16} />
              </button>
            </div>

            <div className="space-y-3 p-4">
              <ControlRow icon={SunMedium} title="Display" value={`${brightness}%`}>
                <input type="range" min="0" max="100" step="1" value={brightness} onChange={(event) => setBrightness(Number(event.target.value))} className="w-full accent-cyan-400" />
              </ControlRow>
              <ControlRow icon={Volume2} title="Sound" value={`${Math.round(volumeLevel * 100)}%`}>
                <input type="range" min="0" max="1" step="0.01" value={volumeLevel} onChange={(event) => setVolumeLevel(Number(event.target.value))} className="w-full accent-cyan-400" />
              </ControlRow>

              <div className="grid grid-cols-2 gap-2">
                <ToggleTile icon={Wifi} label="Wi‑Fi" active={wifiEnabled} onClick={() => setWifiEnabled(!wifiEnabled)} />
                <ToggleTile icon={Bluetooth} label="Bluetooth" active={bluetoothEnabled} onClick={toggleBluetooth} />
                <ToggleTile icon={MoonStar} label="Do Not Disturb" active={doNotDisturb} onClick={toggleDoNotDisturb} />
                <ToggleTile icon={Wallpaper} label={`Theme: ${theme}`} active={theme === 'dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">Wallpaper</div>
                <div className="grid grid-cols-2 gap-2">
                  {quickWallpapers.map((wallpaper) => (
                    <button key={wallpaper.id} onClick={() => setWallpaper(wallpaper.id)} className={`rounded-xl border p-2 text-left ${activeWallpaperId === wallpaper.id ? 'border-cyan-300 bg-cyan-400/15' : 'border-white/10 bg-white/[0.03]'}`}>
                      <div className="h-12 rounded-lg" style={wallpaper.type === 'gradient' ? { background: wallpaper.value } : { backgroundImage: `url(${wallpaper.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <div className="mt-2 truncate text-[11px] text-neutral-200">{wallpaper.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const ControlRow = ({ icon: Icon, title, value, children }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
    <div className="mb-2 flex items-center justify-between gap-3 text-sm text-white">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-cyan-300" />
        {title}
      </div>
      <span className="text-xs text-neutral-500">{value}</span>
    </div>
    {children}
  </div>
);

const ToggleTile = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`rounded-2xl border p-3 text-left transition-colors ${active ? 'border-cyan-300/60 bg-cyan-400/15' : 'border-white/10 bg-white/[0.03] hover:bg-white/10'}`}>
    <div className="flex items-center gap-2 text-sm text-white">
      <Icon size={14} className={active ? 'text-cyan-300' : 'text-neutral-500'} />
      {label}
    </div>
  </button>
);

export default ControlCenter;
