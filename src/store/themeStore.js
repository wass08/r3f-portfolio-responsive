import { create } from 'zustand';

/**
 * Theme Store
 * Manages application theme (dark/light mode)
 * Migrated from Jotai themeAtom
 */
export const useThemeStore = create((set) => ({
  theme: 'dark', // 'dark' | 'light'

  /**
   * Set theme
   */
  setTheme: (theme) =>
    set(() => {
      // Apply to document
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }

      return { theme };
    }),

  /**
   * Toggle theme between dark and light
   */
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';

      if (newTheme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }

      return { theme: newTheme };
    }),
}));
