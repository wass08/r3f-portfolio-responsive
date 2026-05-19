import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Command,
  FileText,
  Folder,
  Bookmark,
  AppWindow,
  ArrowRight,
  Eye,
  Trash2,
  Play,
  Link2,
  Terminal,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useBrowserStore } from '../../store/browserStore';
import { useFilesystemStore } from '../../store/filesystemStore';
import { useNotesStore } from '../../store/notesStore';
import { useNotificationStore } from '../../store/notificationStore';

const SpotlightApp = ({ isOpen, onClose, onAppSelect }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const { apps } = useAppStore();
  const { bookmarks, resolveUrl, openTab } = useBrowserStore();
  const { nodes, listFolder, getDescendants, previewNode, deleteNode } = useFilesystemStore();
  const { notes } = useNotesStore();
  const { pushNotification } = useNotificationStore();

  // Track viewport size for responsive positioning
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  const appItems = useMemo(() => Object.values(apps).map((app) => ({
    type: 'app',
    title: app.title,
    subtitle: app.description,
    icon: AppWindow,
    action: app.id,
  })), [apps]);

  const commandItems = useMemo(() => [
    { type: 'command', title: 'Open Safari', subtitle: 'Launch browser', icon: Command, action: 'open safari' },
    { type: 'command', title: 'Open Finder', subtitle: 'Open filesystem browser', icon: Command, action: 'open finder' },
    { type: 'command', title: 'Open Terminal', subtitle: 'Launch terminal', icon: Command, action: 'open terminal' },
    { type: 'command', title: 'Create Note', subtitle: 'Create a new note', icon: FileText, action: 'open notes' },
  ], []);

  const noteItems = notes.map((note) => ({
    type: 'note',
    title: note.title,
    subtitle: note.body || 'Untitled note',
    icon: FileText,
    action: note.id,
  }));

  const fileItems = Object.values(nodes || {})
    .filter((node) => node && node.id !== 'root')
    .map((node) => ({
      type: 'file',
      title: node.name,
      subtitle: node.kind,
      icon: node.kind === 'folder' ? Folder : FileText,
      action: node.id,
    }));

  const bookmarkItems = bookmarks.map((bookmark) => ({
    type: 'bookmark',
    title: bookmark.title,
    subtitle: bookmark.url,
    icon: Bookmark,
    action: bookmark.url,
  }));

  const searchSpace = [...appItems, ...commandItems, ...noteItems, ...fileItems, ...bookmarkItems];

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchSpace;
    return searchSpace.filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(normalized));
  }, [query, searchSpace]);

  const openResult = (item) => {
    switch (item.type) {
      case 'app':
        onAppSelect?.(item.action);
        break;
      case 'command': {
        const [verb, target] = item.action.split(' ');
        if (verb === 'open') onAppSelect?.(target);
        break;
      }
      case 'bookmark':
        openTab(resolveUrl(item.action));
        pushNotification({ type: 'safari', title: 'Bookmark opened', description: item.title, source: 'spotlight' });
        break;
      case 'file': {
        const node = nodes[item.action];
        if (!node) return;
        if (node.kind === 'folder') {
          previewNode(node.id);
        } else {
          previewNode(node.id);
        }
        break;
      }
      case 'note':
        pushNotification({ type: 'notes', title: 'Note selected', description: item.title, source: 'spotlight' });
        break;
      default:
        break;
    }
    onClose?.();
  };

  const quickActions = [
    { label: 'Open', icon: Play },
    { label: 'Preview', icon: Eye },
    { label: 'Delete', icon: Trash2 },
  ];

  const selectedItem = filteredItems[selectedIndex] || null;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((value) => (filteredItems.length ? (value + 1) % filteredItems.length : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((value) => (filteredItems.length ? (value === 0 ? filteredItems.length - 1 : value - 1) : 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedItem) openResult(selectedItem);
        break;
      case 'Escape':
        event.preventDefault();
        onClose?.();
        break;
      default:
        break;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-[8000] bg-black/45 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          
          {/* Viewport-safe modal container with padding constraints */}
          <motion.div 
            ref={modalRef}
            className="fixed left-1/2 top-1/2 z-[8001] w-[min(92vw,960px)] max-h-[min(90vh,85%)]"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.96, y: 0 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.96, y: 0 }} 
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/95 shadow-2xl max-h-[80vh] flex flex-col">
              <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-4 flex-shrink-0">
                <Search size={18} className="text-neutral-500" />
                <input 
                  ref={inputRef} 
                  value={query} 
                  onChange={(event) => setQuery(event.target.value)} 
                  onKeyDown={handleKeyDown} 
                  placeholder="Search apps, files, notes, bookmarks, commands" 
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500" 
                />
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-neutral-500 whitespace-nowrap">Spotlight</span>
              </div>

              <div className="grid max-h-[calc(80vh-80px)] grid-cols-1 min-h-0 md:grid-cols-[1fr_260px] overflow-hidden">
                <div className="min-h-0 overflow-auto p-3">
                  {filteredItems.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-neutral-500">No results found for "{query}"</div>
                  ) : (
                    <div className="space-y-2">
                      {filteredItems.map((item, index) => {
                        const Icon = item.icon;
                        const active = index === selectedIndex;
                        return (
                          <motion.button key={`${item.type}-${item.title}-${index}`} onClick={() => openResult(item)} className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${active ? 'border-cyan-300/60 bg-cyan-400/15' : 'border-white/10 bg-white/[0.03] hover:bg-white/10'}`} whileHover={{ x: 2 }}>
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-neutral-100 flex-shrink-0">
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium text-white">{item.title}</div>
                              <div className="truncate text-xs text-neutral-500">{item.subtitle}</div>
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 flex-shrink-0">{item.type}</div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 bg-white/[0.03] p-4 md:border-l md:border-t-0 flex-shrink-0 min-h-0 overflow-auto">
                  <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">Quick Actions</div>
                  <div className="mt-3 space-y-2">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button key={action.label} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-neutral-200 hover:bg-white/10">
                          <Icon size={14} className="text-cyan-300" />
                          {action.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">Selected</div>
                    <div className="mt-2 text-sm font-medium text-white">{selectedItem?.title || 'Nothing selected'}</div>
                    <div className="mt-1 text-xs text-neutral-500">{selectedItem?.subtitle || 'Use arrows and Enter to launch.'}</div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-neutral-400">
                    Search everything: apps, files, notes, bookmarks, and commands.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SpotlightApp;
