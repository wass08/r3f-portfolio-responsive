import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid/non-secure';

export const useNotesStore = create(
  persist(
    (set, get) => ({
      notes: [],
      createNote: (title = 'Untitled') => {
        const n = { id: nanoid(), title, body: '', updatedAt: Date.now() };
        set((s) => ({ notes: [n, ...s.notes] }));
        return n;
      },
      updateNote: (id, patch) =>
        set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)) })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
    }),
    {
      name: 'arhanos-notes-store',
    }
  )
);

export default useNotesStore;
