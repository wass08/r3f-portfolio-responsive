import React from 'react';
import { useTrashStore } from '../../store/trashStore';

const TrashApp = () => {
  const { deleted, restoreItem, emptyTrash } = useTrashStore();

  return (
    <div className="h-full overflow-auto p-4 bg-neutral-900 text-neutral-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Trash</h2>
        <div className="space-x-2">
          <button onClick={() => emptyTrash()} className="px-3 py-1 rounded bg-red-600/80">Empty Trash</button>
        </div>
      </div>

      {deleted.length === 0 ? (
        <div className="text-sm text-neutral-400">Trash is empty</div>
      ) : (
        <ul className="space-y-2">
          {deleted.map((item) => (
            <li key={item.id} className="flex items-center justify-between p-2 bg-white/3 rounded">
              <div>
                <div className="text-sm font-medium">{item.name || item.title || item.id}</div>
                <div className="text-xs text-neutral-400">{new Date(item.deletedAt).toLocaleString()}</div>
              </div>
              <div>
                <button onClick={() => restoreItem(item.id)} className="px-2 py-1 rounded bg-cyan-500/80">Restore</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrashApp;
