import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useDesktopStore } from "./desktopStore";
import { useFilesystemStore } from "./filesystemStore";
import { useToastStore } from "./toastStore";

export const useTrashStore = create(
  persist(
    (set, get) => ({
      deleted: [],

      deleteItem: (item) => {
        const desktop = useDesktopStore.getState();
        const originalIndex = desktop.icons.findIndex((i) => i.id === item.id);
        const stored = {
          ...(item || {}),
          source: item?.source || "desktop",
          originalIndex: originalIndex >= 0 ? originalIndex : null,
          deletedAt: Date.now(),
          original: item.original || item,
        };

        set((state) => ({ deleted: [stored, ...state.deleted] }));

        // Show undo toast
        useToastStore.getState().pushToast({
          title: "Moved to Trash",
          message: item.name || item.title || item.id || "Item",
          actionLabel: "Undo",
          duration: 6000,
          onAction: () => {
            // call restore on the same id
            useTrashStore.getState().restoreItem(item.id);
          },
        });
      },

      // Restore an item by id. Restores original to desktop icons at saved coordinates and index.
      restoreItem: (id) =>
        set((state) => {
          const found = state.deleted.find((d) => d.id === id);
          if (!found) return state;

          if (
            found.source === "filesystem" &&
            found.filesystem?.nodes?.length
          ) {
            useFilesystemStore.getState().restoreSnapshot(found.filesystem);
          } else {
            const desktop = useDesktopStore.getState();
            const exists = desktop.icons.some((i) => i.id === found.id);
            if (!exists) {
              const x = Math.max(
                20,
                Math.min(found.original?.x ?? 60, window.innerWidth - 100),
              );
              const y = Math.max(
                48,
                Math.min(found.original?.y ?? 80, window.innerHeight - 140),
              );
              const iconObj = { ...(found.original || {}), x, y };

              if (
                typeof found.originalIndex === "number" &&
                found.originalIndex >= 0
              ) {
                useDesktopStore.setState((s) => {
                  const newIcons = [...s.icons];
                  newIcons.splice(
                    Math.min(found.originalIndex, newIcons.length),
                    0,
                    iconObj,
                  );
                  return { icons: newIcons };
                });
              } else {
                useDesktopStore.setState((s) => ({
                  icons: [...s.icons, iconObj],
                }));
              }
            }
          }

          useToastStore.getState().pushToast({
            title: "Restored",
            message: found.name || found.title || found.id || "Item",
            duration: 3000,
          });

          return { deleted: state.deleted.filter((d) => d.id !== id) };
        }),

      emptyTrash: () => set({ deleted: [] }),
    }),
    {
      name: "arhanos-trash-store",
    },
  ),
);

export default useTrashStore;
