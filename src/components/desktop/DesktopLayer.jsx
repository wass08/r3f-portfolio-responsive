import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, FolderPlus, Terminal, Folder, Info, Image as ImageIcon } from 'lucide-react';
import { useDesktopStore } from '../../store/desktopStore';
import { useTrashStore } from '../../store/trashStore';
import { getAppEmoji, isImagePath } from '../../utils/iconMap';

const DesktopContextMenu = ({ x, y, onAction }) => {
  const items = [
    { id: 'new-folder', label: 'New Folder', icon: FolderPlus },
    { id: 'change-wallpaper', label: 'Change Wallpaper', icon: ImageIcon },
    { id: 'open-terminal', label: 'Open Terminal', icon: Terminal },
    { id: 'open-finder', label: 'Open Finder', icon: Folder },
    { id: 'refresh-desktop', label: 'Refresh Desktop', icon: RefreshCw },
    { id: 'about', label: 'About ArhanOS', icon: Info },
  ];

  return (
    <motion.div
      className="fixed z-[7001] min-w-56 rounded-xl border border-white/20 bg-neutral-900/85 backdrop-blur-xl shadow-2xl py-2"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 6 }}
      transition={{ duration: 0.14 }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onAction(item.id)}
            className="w-full px-3 py-2 text-left text-sm text-neutral-100 hover:bg-primary-500/25 transition-colors flex items-center gap-2"
          >
            <Icon size={14} className="text-neutral-300" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </motion.div>
  );
};

const IconContextMenu = ({ x, y, icon, onAction }) => {
  const isTrashIcon = icon?.id === 'trash';
  const items = [
    { id: 'open', label: 'Open' },
    { id: 'rename', label: 'Edit Name' },
    { id: 'properties', label: 'Properties' },
    ...(!isTrashIcon ? [{ id: 'move-to-trash', label: 'Move to Trash' }] : []),
  ];

  return (
    <motion.div
      className="fixed z-[7001] min-w-56 rounded-xl border border-white/20 bg-neutral-900/85 backdrop-blur-xl shadow-2xl py-2"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 6 }}
      transition={{ duration: 0.14 }}
    >
      <div className="px-3 py-1 text-[11px] uppercase tracking-wide text-neutral-400 border-b border-white/10 mb-1">
        {icon?.name || 'Item'}
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onAction(item.id)}
          className="w-full px-3 py-2 text-left text-sm text-neutral-100 hover:bg-primary-500/25 transition-colors"
        >
          {item.label}
        </button>
      ))}
    </motion.div>
  );
};

const DesktopIcon = ({ icon, selected, onClick, onDoubleClick, onDragStart }) => {
  const [imageError, setImageError] = useState(false);

  // Determine what to display
  const shouldTryImage = isImagePath(icon.icon) && !imageError;
  const fallbackEmoji = getAppEmoji(icon.appId) || icon.icon || '🧩';

  return (
    <motion.button
      type="button"
      className={`
        w-20 h-24 p-2 rounded-xl
        flex flex-col items-center justify-start gap-1
        transition-all
        ${selected ? 'bg-primary-500/28 ring-1 ring-primary-300/80' : 'bg-transparent hover:bg-white/10'}
      `}
      whileHover={{ scale: 1.03, boxShadow: '0 0 18px rgba(56, 189, 248, 0.3)' }}
      onMouseDown={onDragStart}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {shouldTryImage ? (
        <img
          src={icon.icon}
          alt={icon.name}
          className="w-10 h-10 object-contain mt-1"
          onError={() => setImageError(true)}
          draggable={false}
        />
      ) : (
        <span className="text-3xl mt-1">{fallbackEmoji}</span>
      )}
      <span className="text-[11px] text-white leading-tight text-center line-clamp-2 text-shadow-sm">
        {icon.name}
      </span>
    </motion.button>
  );
};

export const DesktopLayer = ({ onOpenApp, onOpenExternal, onOpenSettings, onWallpaperCycle }) => {
  const {
    icons,
    selectedIconIds,
    contextMenu,
    selectIcon,
    selectIconsByRect,
    clearSelection,
    moveIcon,
    resetIconPositions,
    renameIcon,
    showContextMenu,
    hideContextMenu,
  } = useDesktopStore();

  const [selectionRect, setSelectionRect] = useState(null);
  const [ripple, setRipple] = useState(null);
  const [iconMenu, setIconMenu] = useState({ visible: false, x: 0, y: 0, iconId: null });
  const [renamingIcon, setRenamingIcon] = useState(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [propertiesIcon, setPropertiesIcon] = useState(null);
  const dragStateRef = useRef(null);

  const sortedIcons = useMemo(() => [...icons], [icons]);

  const openIcon = (icon) => {
    try {
      // Handle folder type - open in Finder
      if (icon.type === 'folder') {
        onOpenApp('finder');
        return;
      }

      if (icon.appId) {
        onOpenApp(icon.appId);
        return;
      }

      if (icon.url) {
        onOpenExternal(icon.url);
      }
    } catch (error) {
      console.error('Error opening icon:', error);
    }
  };

  const moveIconToTrash = (icon) => {
    if (!icon || icon.id === 'trash') return;
    useTrashStore
      .getState()
      .deleteItem({ id: icon.id, name: icon.name, type: icon.type, appId: icon.appId, source: 'desktop', original: icon });
    useDesktopStore.getState().deleteIcon(icon.id);
    useDesktopStore.getState().clearSelection();
  };

  const handleDesktopMouseDown = (e) => {
    if (e.button !== 0) return;
    hideContextMenu();
    setIconMenu({ visible: false, x: 0, y: 0, iconId: null });

    const clickedOnIcon = e.target.closest('[data-desktop-icon="true"]');
    if (clickedOnIcon) return;

    clearSelection();

    const start = { x: e.clientX, y: e.clientY };
    setSelectionRect({ x: start.x, y: start.y, width: 0, height: 0 });

    const onMove = (moveEvent) => {
      const x = Math.min(start.x, moveEvent.clientX);
      const y = Math.min(start.y, moveEvent.clientY);
      const width = Math.abs(moveEvent.clientX - start.x);
      const height = Math.abs(moveEvent.clientY - start.y);
      const rect = { x, y, width, height };
      setSelectionRect(rect);
      selectIconsByRect(rect);
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      setSelectionRect(null);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleIconDragStart = (e, icon) => {
    e.stopPropagation();
    hideContextMenu();
    setIconMenu({ visible: false, x: 0, y: 0, iconId: null });

    dragStateRef.current = {
      id: icon.id,
      offsetX: e.clientX - icon.x,
      offsetY: e.clientY - icon.y,
    };

    const onMove = (moveEvent) => {
      if (!dragStateRef.current) return;
      const newX = moveEvent.clientX - dragStateRef.current.offsetX;
      const newY = moveEvent.clientY - dragStateRef.current.offsetY;
      
      dragStateRef.current.lastX = newX;
      dragStateRef.current.lastY = newY;
      
      moveIcon(
        dragStateRef.current.id,
        newX,
        newY
      );
    };

    const onUp = (upEvent) => {
      // Robust drop handling based on pointer location and rendered trash bounds.
      const trashElement = document.querySelector('[data-icon-id="trash"]');
      if (trashElement && icon.id !== 'trash') {
        const rect = trashElement.getBoundingClientRect();
        const isOverTrash =
          upEvent.clientX >= rect.left &&
          upEvent.clientX <= rect.right &&
          upEvent.clientY >= rect.top &&
          upEvent.clientY <= rect.bottom;

        if (isOverTrash) {
          moveIconToTrash(icon);
        }
      }

      dragStateRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleContextMenuAction = (actionId) => {
    hideContextMenu();
    setIconMenu({ visible: false, x: 0, y: 0, iconId: null });

    if (actionId === 'new-folder') {
      alert('New Folder (simulation): Finder handles folders in this version.');
      return;
    }

    if (actionId === 'change-wallpaper') {
      onWallpaperCycle();
      return;
    }

    if (actionId === 'open-terminal') {
      onOpenApp('terminal');
      return;
    }

    if (actionId === 'open-finder') {
      onOpenApp('finder');
      return;
    }

    if (actionId === 'refresh-desktop') {
      resetIconPositions();
      return;
    }

    if (actionId === 'about') {
      onOpenApp('about-os');
      return;
    }
  };

  const handleIconMenuAction = (actionId) => {
    const icon = sortedIcons.find((i) => i.id === iconMenu.iconId);
    setIconMenu({ visible: false, x: 0, y: 0, iconId: null });

    if (!icon) return;

    if (actionId === 'open') {
      openIcon(icon);
      return;
    }

    if (actionId === 'rename') {
      setRenamingIcon(icon);
      setRenameDraft(icon.name || '');
      return;
    }

    if (actionId === 'properties') {
      setPropertiesIcon(icon);
      return;
    }

    if (actionId === 'move-to-trash') {
      moveIconToTrash(icon);
    }
  };

  const submitRename = () => {
    const nextName = renameDraft.trim();
    if (!renamingIcon || !nextName) {
      setRenamingIcon(null);
      setRenameDraft('');
      return;
    }

    renameIcon(renamingIcon.id, nextName);
    setRenamingIcon(null);
    setRenameDraft('');
  };

  return (
    <div
      className="absolute inset-0 z-[15]"
      onMouseDown={handleDesktopMouseDown}
      onContextMenu={(e) => {
        const iconTarget = e.target.closest('[data-desktop-icon="true"]');
        if (iconTarget) return;
        e.preventDefault();
        setIconMenu({ visible: false, x: 0, y: 0, iconId: null });
        showContextMenu(e.clientX, e.clientY);
      }}
      onClick={(e) => {
        if (!e.target.closest('[data-desktop-icon="true"]')) {
          setRipple({ x: e.clientX, y: e.clientY, id: Date.now() });
          clearSelection();
          hideContextMenu();
          setIconMenu({ visible: false, x: 0, y: 0, iconId: null });
        }
      }}
    >
      {sortedIcons.map((icon) => (
        <div
          key={icon.id}
          data-desktop-icon="true"
          data-icon-id={icon.id}
          className="absolute"
          style={{ left: icon.x, top: icon.y }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            hideContextMenu();
            selectIcon(icon.id, false);
            setIconMenu({ visible: true, x: e.clientX, y: e.clientY, iconId: icon.id });
          }}
        >
          <DesktopIcon
            icon={icon}
            selected={selectedIconIds.includes(icon.id)}
            onClick={(e) => {
              e.stopPropagation();
              selectIcon(icon.id, e.ctrlKey || e.metaKey);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openIcon(icon);
            }}
            onDragStart={(e) => handleIconDragStart(e, icon)}
          />
        </div>
      ))}

      <AnimatePresence>
        {selectionRect && (
          <motion.div
            className="fixed border border-sky-300/80 bg-sky-400/20 backdrop-blur-[1px] pointer-events-none z-[7000]"
            style={{
              left: selectionRect.x,
              top: selectionRect.y,
              width: selectionRect.width,
              height: selectionRect.height,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contextMenu.visible && (
          <>
            <div
              className="fixed inset-0 z-[7000]"
              onMouseDown={() => hideContextMenu()}
            />
            <DesktopContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onAction={handleContextMenuAction}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {iconMenu.visible && (
          <>
            <div
              className="fixed inset-0 z-[7000]"
              onMouseDown={() => setIconMenu({ visible: false, x: 0, y: 0, iconId: null })}
            />
            <IconContextMenu
              x={iconMenu.x}
              y={iconMenu.y}
              icon={sortedIcons.find((icon) => icon.id === iconMenu.iconId)}
              onAction={handleIconMenuAction}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {renamingIcon && (
          <motion.div
            className="fixed inset-0 z-[7100] bg-black/45 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => {
              setRenamingIcon(null);
              setRenameDraft('');
            }}
          >
            <motion.div
              className="w-full max-w-md rounded-xl border border-white/20 bg-neutral-900/90 backdrop-blur-xl p-4"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 6 }}
              transition={{ duration: 0.14 }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-neutral-100 mb-3">Rename Icon</h3>
              <input
                autoFocus
                value={renameDraft}
                onChange={(e) => setRenameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitRename();
                  if (e.key === 'Escape') {
                    setRenamingIcon(null);
                    setRenameDraft('');
                  }
                }}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-neutral-100 outline-none focus:border-cyan-400"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setRenamingIcon(null);
                    setRenameDraft('');
                  }}
                  className="px-3 py-1.5 rounded-lg text-sm bg-white/10 text-neutral-200 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRename}
                  className="px-3 py-1.5 rounded-lg text-sm bg-cyan-500 text-white hover:bg-cyan-400"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {propertiesIcon && (
          <motion.div
            className="fixed inset-0 z-[7100] bg-black/45 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setPropertiesIcon(null)}
          >
            <motion.div
              className="w-full max-w-md rounded-xl border border-white/20 bg-neutral-900/90 backdrop-blur-xl p-4"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 6 }}
              transition={{ duration: 0.14 }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-neutral-100 mb-3">Properties</h3>
              <div className="space-y-2 text-sm text-neutral-200">
                <div><span className="text-neutral-400">Name:</span> {propertiesIcon.name}</div>
                <div><span className="text-neutral-400">Type:</span> {propertiesIcon.type || 'unknown'}</div>
                <div><span className="text-neutral-400">App ID:</span> {propertiesIcon.appId || 'n/a'}</div>
                <div><span className="text-neutral-400">Position:</span> {Math.round(propertiesIcon.x)}, {Math.round(propertiesIcon.y)}</div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setPropertiesIcon(null)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-cyan-500 text-white hover:bg-cyan-400"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ripple && (
          <motion.span
            key={ripple.id}
            className="fixed rounded-full border border-cyan-300/40 pointer-events-none z-[14]"
            style={{ left: ripple.x - 8, top: ripple.y - 8 }}
            initial={{ width: 16, height: 16, opacity: 0.5 }}
            animate={{ width: 140, height: 140, opacity: 0, x: -62, y: -62 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopLayer;
