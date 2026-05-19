import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import wallpaperManifest from '../generated/wallpapers.json';

const BUILTIN_WALLPAPERS = [
  {
    id: 'dark-gradient',
    name: 'Dark Gradient',
    type: 'gradient',
    value: 'linear-gradient(135deg, #020617 0%, #0f172a 45%, #1d4ed8 100%)',
  },
  {
    id: 'mountain',
    name: 'Mountain Glow',
    type: 'gradient',
    value: 'radial-gradient(circle at 30% 20%, rgba(196, 181, 253, 0.22), transparent 45%), linear-gradient(170deg, #0b1028 0%, #1e293b 45%, #334155 100%)',
  },
  {
    id: 'neural-mesh',
    name: 'Neural Mesh',
    type: 'gradient',
    value: 'radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.25), transparent 35%), radial-gradient(circle at 80% 70%, rgba(56, 189, 248, 0.25), transparent 35%), linear-gradient(135deg, #020617 0%, #0f172a 50%, #082f49 100%)',
  },
  {
    id: 'glass-abstract',
    name: 'Glass Abstract',
    type: 'gradient',
    value: 'linear-gradient(145deg, #111827 0%, #1f2937 35%, #0f172a 100%)',
  },
];

const GENERATED_WALLPAPERS = (wallpaperManifest || []).map((path, idx) => ({
  id: `tahoe-${idx}`,
  name: `macOS Tahoe ${idx + 1}`,
  type: 'image',
  value: path,
}));

const WALLPAPERS = [...BUILTIN_WALLPAPERS, ...GENERATED_WALLPAPERS];

export const useSystemStore = create(
  persist(
    (set, get) => ({
      wallpapers: WALLPAPERS,
      activeWallpaperId: 'dark-gradient',
      theme: 'dark',
      animationsEnabled: true,
      hasEnteredDesktop: false,
      clockPreferences: {
        timeFormat: '24h',
        showWeekday: true,
        showMonth: false,
        showSeconds: false,
      },
      bootTime: Date.now(),

      setWallpaper: (wallpaperId) => {
        const exists = get().wallpapers.some((w) => w.id === wallpaperId);
        if (!exists) return;
        set({ activeWallpaperId: wallpaperId });
      },

      getActiveWallpaper: () => {
        const { wallpapers, activeWallpaperId } = get();
        return wallpapers.find((w) => w.id === activeWallpaperId) || wallpapers[0];
      },

      toggleAnimations: () => set((state) => ({ animationsEnabled: !state.animationsEnabled })),
      setTheme: (theme) => set({ theme }),
      markDesktopEntered: () => set({ hasEnteredDesktop: true }),
      setClockPreferences: (updates) =>
        set((state) => ({
          clockPreferences: {
            ...state.clockPreferences,
            ...updates,
          },
        })),
    }),
    {
      name: 'arhanos-system-store',
      partialize: (state) => ({
        activeWallpaperId: state.activeWallpaperId,
        theme: state.theme,
        animationsEnabled: state.animationsEnabled,
        hasEnteredDesktop: state.hasEnteredDesktop,
        clockPreferences: state.clockPreferences,
        bootTime: state.bootTime,
      }),
    }
  )
);

export default useSystemStore;
