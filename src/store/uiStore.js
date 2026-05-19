import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Constants ────────────────────────────────────────────────────────────────
const MIN_SPACES = 1;
const MAX_SPACES = 9; // Ctrl+1…9 are the most you'd ever want

// ─── Store ────────────────────────────────────────────────────────────────────
export const useUIStore = create(
  persist(
    (set, get) => ({
      // ── Spaces / Desktops ────────────────────────────────────────────────
      spaces: [
        { id: 1, name: 'Desktop 1' },
        { id: 2, name: 'Desktop 2' },
        { id: 3, name: 'Desktop 3' },
      ],
      activeSpace: 1,

      /**
       * Jump to a specific space by its id.
       */
      setActiveSpace: (spaceId) => {
        const { spaces } = get();
        if (spaces.find((s) => s.id === spaceId)) {
          set({ activeSpace: spaceId });
        }
      },

      /**
       * Move to the next space (wraps around).
       */
      nextSpace: () => {
        const { spaces, activeSpace } = get();
        const currentIndex = spaces.findIndex((s) => s.id === activeSpace);
        const nextIndex = (currentIndex + 1) % spaces.length;
        set({ activeSpace: spaces[nextIndex].id });
      },

      /**
       * Move to the previous space (wraps around).
       */
      previousSpace: () => {
        const { spaces, activeSpace } = get();
        const currentIndex = spaces.findIndex((s) => s.id === activeSpace);
        const prevIndex = (currentIndex - 1 + spaces.length) % spaces.length;
        set({ activeSpace: spaces[prevIndex].id });
      },

      /**
       * Add a new desktop (like clicking "+" in real macOS Mission Control).
       * Returns the new space's id, or null if the max is reached.
       */
      addSpace: () => {
        const { spaces } = get();
        if (spaces.length >= MAX_SPACES) return null;

        // Pick the next available numeric id (never reuse deleted ones)
        const maxId = spaces.reduce((m, s) => Math.max(m, s.id), 0);
        const newId = maxId + 1;
        const newSpace = { id: newId, name: `Desktop ${newId}` };

        set((state) => ({
          spaces: [...state.spaces, newSpace],
          activeSpace: newId, // switch to the newly created desktop
        }));

        return newId;
      },

      /**
       * Remove a desktop by id (like dragging it off in real macOS).
       * Windows on the removed space are moved to the previous space (or space 1).
       */
      removeSpace: (spaceId) => {
        const { spaces, activeSpace } = get();
        if (spaces.length <= MIN_SPACES) return; // must keep at least one

        const index = spaces.findIndex((s) => s.id === spaceId);
        if (index === -1) return;

        const newSpaces = spaces.filter((s) => s.id !== spaceId);

        // Decide which space becomes active after deletion
        let newActive = activeSpace;
        if (activeSpace === spaceId) {
          // Move to adjacent space
          const fallbackIndex = Math.max(0, index - 1);
          newActive = newSpaces[fallbackIndex]?.id ?? newSpaces[0].id;
        }

        set({ spaces: newSpaces, activeSpace: newActive });
      },

      /**
       * Rename a desktop (optional nice-to-have).
       */
      renameSpace: (spaceId, name) => {
        set((state) => ({
          spaces: state.spaces.map((s) =>
            s.id === spaceId ? { ...s, name } : s
          ),
        }));
      },

      // ── UI Panels ────────────────────────────────────────────────────────
      showControlCenter: false,
      showMissionControl: false,
      toggleControlCenter: () =>
        set((state) => ({ showControlCenter: !state.showControlCenter })),
      toggleMissionControl: () =>
        set((state) => ({ showMissionControl: !state.showMissionControl })),
      closeAllPanels: () =>
        set({ showControlCenter: false, showMissionControl: false }),

      // ── System Settings ──────────────────────────────────────────────────
      displayBrightness: 0.85,
      volumeLevel: 0.72,
      wifiEnabled: true,
      bluetoothEnabled: true,
      doNotDisturb: false,
      setDisplayBrightness: (value) => set({ displayBrightness: value }),
      setVolumeLevel: (value) => set({ volumeLevel: value }),
      toggleWifi: () => set((state) => ({ wifiEnabled: !state.wifiEnabled })),
      toggleBluetooth: () =>
        set((state) => ({ bluetoothEnabled: !state.bluetoothEnabled })),
      toggleDoNotDisturb: () =>
        set((state) => ({ doNotDisturb: !state.doNotDisturb })),
    }),
    {
      name: 'arhanos-ui-store',
      partialize: (state) => ({
        // Persist spaces so user's desktops survive a page refresh
        spaces: state.spaces,
        activeSpace: state.activeSpace,
        displayBrightness: state.displayBrightness,
        volumeLevel: state.volumeLevel,
        wifiEnabled: state.wifiEnabled,
        bluetoothEnabled: state.bluetoothEnabled,
        doNotDisturb: state.doNotDisturb,
      }),
    }
  )
);

export default useUIStore;
