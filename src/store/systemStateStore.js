import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Global System State Store
 * Manages Wi-Fi, brightness, battery, and other system-wide states
 */
export const useSystemStateStore = create(
  persist(
    (set, get) => ({
      // Wi-Fi state
      wifiEnabled: true,
      wifiStrength: 4, // 0-5 bars

      // Brightness (0-100)
      brightness: 100,

      // Battery state
      batteryPercentage: 100,
      isCharging: false,
      batteryStatus: "full", // 'low', 'critical', 'full', 'charging'

      // Focus mode
      focusMode: false,
      focusApp: null, // which app has focus

      // Screensaver
      screensaverActive: false,
      lastUserActivity: Date.now(),
      screensaverTimeout: 10 * 60 * 1000, // 10 minutes

      // ─── Wi-Fi Actions ────────────────────────────────────────────
      setWifiEnabled: (enabled) => set({ wifiEnabled: enabled }),
      setWifiStrength: (strength) =>
        set({ wifiStrength: Math.max(0, Math.min(5, strength)) }),

      // ─── Brightness Actions ────────────────────────────────────────
      setBrightness: (level) =>
        set({ brightness: Math.max(0, Math.min(100, level)) }),
      increaseBrightness: () =>
        set((state) => ({
          brightness: Math.min(100, state.brightness + 10),
        })),
      decreaseBrightness: () =>
        set((state) => ({
          brightness: Math.max(0, state.brightness - 10),
        })),

      // ─── Battery Actions ──────────────────────────────────────────
      setBatteryPercentage: (percent) =>
        set({ batteryPercentage: Math.max(0, Math.min(100, percent)) }),
      setIsCharging: (charging) => set({ isCharging: charging }),
      updateBatteryStatus: () => {
        const { batteryPercentage, isCharging } = get();
        let status = "full";
        if (isCharging) status = "charging";
        else if (batteryPercentage <= 5) status = "critical";
        else if (batteryPercentage <= 20) status = "low";
        set({ batteryStatus: status });
      },

      // ─── Focus Mode Actions ────────────────────────────────────────
      setFocusMode: (enabled) => set({ focusMode: enabled }),
      setFocusApp: (appId) => set({ focusApp: appId }),

      // ─── Activity & Screensaver ───────────────────────────────────
      recordUserActivity: () => set({ lastUserActivity: Date.now() }),
      activateScreensaver: () => set({ screensaverActive: true }),
      deactivateScreensaver: () => set({ screensaverActive: false }),
      setScreensaverTimeout: (ms) => set({ screensaverTimeout: ms }),

      // ─── Check if screensaver should activate ──────────────────────
      checkScreensaver: () => {
        const { screensaverActive, lastUserActivity, screensaverTimeout } =
          get();
        if (screensaverActive) return; // already active
        const timeInactive = Date.now() - lastUserActivity;
        if (timeInactive > screensaverTimeout) {
          set({ screensaverActive: true });
        }
      },

      // ─── Initialize Real Battery API (if available) ────────────────
      initializeBatteryAPI: async () => {
        if (!navigator.getBattery && !navigator.battery) return;
        try {
          const battery = (await navigator.getBattery?.()) || navigator.battery;
          if (!battery) return;

          const updateBattery = () => {
            set({
              batteryPercentage: Math.round(battery.level * 100),
              isCharging: battery.charging,
            });
            get().updateBatteryStatus();
          };

          battery.addEventListener("levelchange", updateBattery);
          battery.addEventListener("chargingchange", updateBattery);
          updateBattery(); // initial read
        } catch (err) {
          console.warn("Battery API not available:", err);
        }
      },
    }),
    {
      name: "arhanos-system-state",
      partialize: (state) => ({
        wifiEnabled: state.wifiEnabled,
        brightness: state.brightness,
        focusMode: state.focusMode,
        screensaverTimeout: state.screensaverTimeout,
      }),
    },
  ),
);

export default useSystemStateStore;
