import React, { useState } from 'react';
import { useNotesStore } from '../../store/notesStore';
import { useNotificationStore } from '../../store/notificationStore';

const NotesApp = () => {
  const { notes, createNote, updateNote, deleteNote } = useNotesStore();
  const { pushNotification } = useNotificationStore();
  const [activeId, setActiveId] = useState(notes[0]?.id || null);

  const active = notes.find((n) => n.id === activeId) || null;

  return (
    <div className="h-full flex bg-neutral-900 text-neutral-100">
      <aside className="w-72 border-r border-white/6 p-3 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Notes</h3>
          <button
            onClick={() => {
              const note = createNote();
              setActiveId(note.id);
              pushNotification({ type: 'notes', title: 'Note created', description: note.title, source: 'notes' });
            }}
            className="px-2 py-1 rounded bg-cyan-500/80"
          >
            New
          </button>
        </div>
        <ul className="space-y-2">
          {notes.map((n) => (
            <li key={n.id} className={`p-2 rounded ${n.id === activeId ? 'bg-white/6' : 'bg-transparent'}`} onClick={() => setActiveId(n.id)}>
              <div className="text-sm font-medium">{n.title || 'Untitled'}</div>
              <div className="text-xs text-neutral-400">{new Date(n.updatedAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-4">
        {active ? (
          <div className="h-full flex flex-col">
            <input className="w-full p-2 mb-2 rounded bg-white/5" value={active.title} onChange={(e) => {
              updateNote(active.id, { title: e.target.value });
              pushNotification({ type: 'notes', title: 'Note saved', description: e.target.value || 'Untitled note', source: 'notes' });
            }} />
            <textarea className="flex-1 p-2 rounded bg-white/5" value={active.body} onChange={(e) => {
              updateNote(active.id, { body: e.target.value });
              pushNotification({ type: 'notes', title: 'Note saved', description: active.title || 'Untitled note', source: 'notes' });
            }} />
            <div className="mt-3 flex justify-end">
              <button onClick={() => { deleteNote(active.id); pushNotification({ type: 'notes', title: 'Note deleted', description: active.title || 'Untitled note', source: 'notes' }); }} className="px-3 py-1 rounded bg-red-600/80">Delete</button>
            </div>
          </div>
        ) : (
          <div className="text-neutral-400">No note selected</div>
        )}
      </main>
    </div>
  );
};

export default NotesApp;
