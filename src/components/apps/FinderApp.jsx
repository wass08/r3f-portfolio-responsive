import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Folder,
  FileText,
  Image as ImageIcon,
  Link2,
  FolderOpen,
  Trash2,
  Copy,
  Pencil,
  MoveRight,
  Eye,
  Space,
  ArrowUp,
  Plus,
  Home,
  File,
  FileCode,
  Music,
  Video,
} from 'lucide-react';
import { useFilesystemStore } from '../../store/filesystemStore';
import { useTrashStore } from '../../store/trashStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useWindowStore } from '../../store/windowStore';
import { useAppStore } from '../../store/appStore';

// File type to app mapping
const FILE_TYPE_MAP = {
  // All file types open in FileViewerApp for now
  '.png': 'file-viewer',
  '.jpg': 'file-viewer',
  '.jpeg': 'file-viewer',
  '.gif': 'file-viewer',
  '.webp': 'file-viewer',
  
  // Text/Code
  '.txt': 'file-viewer',
  '.md': 'file-viewer',
  '.js': 'file-viewer',
  '.jsx': 'file-viewer',
  '.py': 'file-viewer',
  '.html': 'file-viewer',
  '.css': 'file-viewer',
  
  // Media
  '.mp3': 'file-viewer',
  '.mp4': 'file-viewer',
  '.mov': 'file-viewer',
  
  // Documents
  '.pdf': 'file-viewer',
  '.doc': 'file-viewer',
  '.docx': 'file-viewer',
};

const ICON_BY_KIND = {
  folder: Folder,
  text: FileText,
  file: FileText,
  image: ImageIcon,
  shortcut: Link2,
  project: FolderOpen,
};

const getFileExtension = (filename) => {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.substring(dot).toLowerCase();
};

const getAppForFile = (filename) => {
  const ext = getFileExtension(filename);
  return FILE_TYPE_MAP[ext] || 'notes';
};

const FinderApp = () => {
  const {
    initialize,
    currentFolderId,
    previewId,
    getCurrentFolder,
    getNode,
    getNodePath,
    listFolder,
    openFolder,
    goUp,
    createFolder,
    createTextFile,
    renameNode,
    deleteNode,
    moveNode,
    duplicateNode,
    getDescendants,
    previewNode,
    closePreview,
  } = useFilesystemStore();
  
  const { deleteItem } = useTrashStore();
  const { pushNotification } = useNotificationStore();
  const { openWindow } = useWindowStore();
  const appMetadata = useAppStore((state) => state.apps);

  const [selectedIds, setSelectedIds] = useState([]);
  const [renameDraft, setRenameDraft] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [editingLocation, setEditingLocation] = useState(false);
  const [showPreviewPane, setShowPreviewPane] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const currentFolder = getCurrentFolder();
  const items = useMemo(() => listFolder(currentFolderId), [currentFolderId, listFolder]);
  const currentPreview = previewId ? getNode(previewId) : null;
  const breadcrumbs = currentFolderId ? getNodePath(currentFolderId) : [];
  
  // Update location input when folder changes
  useEffect(() => {
    const pathStr = breadcrumbs.slice(1).join('/') || 'ArhanOS';
    setLocationInput(pathStr);
  }, [breadcrumbs]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closePreview();
      }
      if (event.key === ' ' && selectedIds.length === 1) {
        event.preventDefault();
        previewNode(selectedIds[0]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePreview, previewNode, selectedIds]);

  const selectedNode = selectedIds.length === 1 ? getNode(selectedIds[0]) : null;

  const handleLocationSubmit = () => {
    if (!locationInput.trim()) return;
    setEditingLocation(false);
    // For now, navigate to root if user types a path
    // This could be extended to support path navigation
  };

  const handleSelect = (nodeId, additive = false) => {
    setSelectedIds((current) => {
      if (additive) {
        return current.includes(nodeId) ? current.filter((id) => id !== nodeId) : [...current, nodeId];
      }
      return [nodeId];
    });
  };

  const handleOpen = (node) => {
    if (!node) return;

    // Open folders
    if (node.kind === 'folder') {
      openFolder(node.id);
      setSelectedIds([]);
      return;
    }

    // Open files in FileViewerApp
    if (node.kind === 'text' || node.kind === 'image' || node.kind === 'file') {
      const appId = getAppForFile(node.name);
      const appMeta = appMetadata[appId];
      
      if (appMeta && appId === 'file-viewer') {
        // Open with file viewer
        openWindow({
          app: 'file-viewer',  // Use 'app' not 'appId'
          title: `${node.name}`,
          width: 900,
          height: 700,
          state: { 
            fileId: node.id, 
            fileName: node.name, 
            fileContent: node.content,
          },
        });

        pushNotification({
          type: 'finder',
          title: 'Opening file',
          description: node.name,
          source: 'finder',
        });
      }
    }

    previewNode(node.id);
    setSelectedIds([node.id]);
  };

  const handlePreview = () => {
    if (selectedNode) previewNode(selectedNode.id);
  };

  const handleRename = () => {
    if (!selectedNode || !renameDraft.trim()) return;
    renameNode(selectedNode.id, renameDraft.trim());
    pushNotification({ type: 'finder', title: 'File renamed', description: renameDraft.trim(), source: 'finder' });
    setRenameDraft('');
  };

  const handleDuplicate = () => {
    if (!selectedNode) return;
    duplicateNode(selectedNode.id);
    pushNotification({ type: 'finder', title: 'File duplicated', description: selectedNode.name, source: 'finder' });
  };

  const handleDelete = () => {
    if (!selectedNode) return;
    const descendants = getDescendants(selectedNode.id) || [];
    const snapshotNodes = [selectedNode, ...descendants].map((node) => ({
      ...node,
      children: Array.isArray(node.children) ? [...node.children] : node.children,
    }));

    deleteItem({
      id: selectedNode.id,
      name: selectedNode.name,
      type: selectedNode.kind,
      source: 'filesystem',
      original: selectedNode,
      filesystem: {
        rootId: selectedNode.id,
        nodes: snapshotNodes,
      },
    });
    deleteNode(selectedNode.id);
    setSelectedIds([]);
    pushNotification({ type: 'finder', title: 'Moved to Trash', description: selectedNode.name, source: 'finder' });
  };

  const handleDragStart = (event, node) => {
    event.dataTransfer.setData('text/plain', node.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (event, folderId) => {
    event.preventDefault();
    const nodeId = event.dataTransfer.getData('text/plain');
    if (!nodeId) return;
    moveNode(nodeId, folderId);
  };

  const renderPreview = () => {
    if (!currentPreview) {
      return (
        <div className="flex h-full items-center justify-center text-neutral-400 text-sm">
          No preview available
        </div>
      );
    }

    if (currentPreview.kind === 'image') {
      return (
        <img
          src={currentPreview.icon}
          alt={currentPreview.name}
          className="max-h-full max-w-full rounded-lg object-contain"
        />
      );
    }

    if (currentPreview.kind === 'text' || currentPreview.kind === 'file' || currentPreview.kind === 'project') {
      return (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-left text-neutral-200 max-w-2xl max-h-96 overflow-auto">
          <div className="text-sm font-semibold mb-2">{currentPreview.name}</div>
          <div className="text-xs whitespace-pre-wrap text-neutral-400">
            {currentPreview.content || '(empty file)'}
          </div>
        </div>
      );
    }

    return <div className="text-neutral-300 text-sm">Preview unavailable.</div>;
  };

  const SIDEBAR_ITEMS = [
    { id: 'root', label: 'ArhanOS', icon: Home },
    { id: 'documents', label: 'Documents', icon: Folder },
    { id: 'downloads', label: 'Downloads', icon: Folder },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Toolbar */}
      <div className="border-b border-white/10 bg-neutral-950/95 px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-xl overflow-y-auto">
        {/* Navigation buttons */}
        <div className="mb-2 sm:mb-3 flex items-center gap-2">
          <button
            onClick={goUp}
            className="rounded-lg p-2 text-neutral-400 hover:bg-white/10 hover:text-white flex-shrink-0"
            title="Go Up"
          >
            <ArrowUp size={16} />
          </button>
          
          {/* Location/Path Bar */}
          {editingLocation ? (
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onBlur={handleLocationSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleLocationSubmit()}
              autoFocus
              className="flex-1 rounded-lg border border-cyan-400/50 bg-white/[0.08] px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500"
              placeholder="Enter path..."
            />
          ) : (
            <div
              onClick={() => setEditingLocation(true)}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-300 hover:bg-white/10 cursor-pointer"
            >
              {locationInput || 'ArhanOS'}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => createFolder('New Folder')}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Plus size={14} className="inline mr-1" />
            New Folder
          </button>
          <button
            onClick={() => createTextFile('Untitled.txt', 'New text file')}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FileText size={14} className="inline mr-1" />
            New File
          </button>
          <button
            onClick={handlePreview}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
            disabled={!selectedNode}
          >
            <Eye size={14} className="inline mr-1" />
            Preview
          </button>
          <button
            onClick={handleDuplicate}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
            disabled={!selectedNode}
          >
            <Copy size={14} className="inline mr-1" />
            Duplicate
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
            disabled={!selectedNode}
          >
            <Trash2 size={14} className="inline mr-1" />
            Trash
          </button>
          <div className="flex-1"></div>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
            title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
          >
            {showSidebar ? '◀' : '▶'} Sidebar
          </button>
          <button
            onClick={() => setShowPreviewPane(!showPreviewPane)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
            title={showPreviewPane ? 'Hide details' : 'Show details'}
          >
            {showPreviewPane ? '▶' : '◀'} Details
          </button>
        </div>
      </div>

      {/* Main content area - Responsive layout */}
      <div className={`grid min-h-0 flex-1 gap-0 overflow-hidden ${
        showSidebar && showPreviewPane 
          ? 'grid-cols-[max(120px,15%)_1fr_max(200px,25%)]'
          : showSidebar
          ? 'grid-cols-[max(120px,15%)_1fr]'
          : showPreviewPane
          ? 'grid-cols-[1fr_max(200px,25%)]'
          : 'grid-cols-1'
      }`}>
        {/* Left sidebar - Conditionally rendered */}
        {showSidebar && (
        <div className="border-r border-white/10 bg-neutral-950/50 overflow-y-auto">
          <div className="p-3 space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const ItemIcon = item.icon;
              const isActive = currentFolderId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => openFolder(item.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-cyan-400/20 text-cyan-100'
                      : 'text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  <ItemIcon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
        )}

        {/* Main file browser */}
        <div className="overflow-y-auto">
          <div className="p-4">
            {items.length === 0 ? (
              <div className="flex h-full items-center justify-center text-neutral-500">
                <div className="text-center">
                  <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>This folder is empty</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {items.map((node) => {
                  const Icon = ICON_BY_KIND[node.kind] || FileText;
                  const isSelected = selectedIds.includes(node.id);
                  return (
                    <motion.button
                      key={node.id}
                      draggable
                      onDragStart={(event) => handleDragStart(event, node)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => node.kind === 'folder' && handleDrop(event, node.id)}
                      onClick={(event) => handleSelect(node.id, event.ctrlKey || event.metaKey)}
                      onDoubleClick={() => handleOpen(node)}
                      className={`group rounded-2xl border-2 p-3 text-left transition-all ${
                        isSelected
                          ? 'border-cyan-400/70 bg-cyan-400/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                      title={node.name}
                    >
                      <div className="flex items-center justify-center h-16 mb-2">
                        <Icon size={24} className="text-neutral-300" />
                      </div>
                      <div className="truncate text-xs font-medium text-white">{node.name}</div>
                      <div className="text-[10px] text-neutral-500 mt-1 truncate">
                        {node.kind === 'folder' ? `${node.children?.length || 0} items` : node.kind}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right preview pane - Conditionally rendered */}
        {showPreviewPane && (
        <div className="border-l border-white/10 bg-neutral-950/50 overflow-y-auto">
          {selectedNode ? (
            <div className="p-4">
              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Info</div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-sm font-semibold text-white mb-3">{selectedNode.name}</div>
                  <div className="space-y-2 text-xs text-neutral-400">
                    <div><span className="text-neutral-500">Type:</span> {selectedNode.kind}</div>
                    <div><span className="text-neutral-500">Path:</span> {getNodePath(selectedNode.id).join(' / ')}</div>
                    {selectedNode.updatedAt && (
                      <div><span className="text-neutral-500">Modified:</span> {new Date(selectedNode.updatedAt).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Preview</div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 h-40 flex items-center justify-center overflow-hidden">
                  {renderPreview()}
                </div>
              </div>

              {/* Rename */}
              <div>
                <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">Rename</label>
                <input
                  value={renameDraft}
                  onChange={(e) => setRenameDraft(e.target.value)}
                  placeholder={`Rename ${selectedNode.name}`}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 mb-2 focus:border-cyan-400/50"
                />
                <button
                  onClick={handleRename}
                  className="w-full rounded-lg bg-cyan-400/20 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/30 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-4">
              <div className="text-center text-neutral-500 text-sm">
                <p>Select a file to see details</p>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Full-screen preview modal */}
      {currentPreview && (
        <div
          className="fixed inset-0 z-[7000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-xl"
          onClick={closePreview}
        >
          <div
            className="max-h-[90vh] max-w-[90vw] overflow-auto rounded-3xl border border-white/10 bg-neutral-950/95 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-white">{currentPreview.name}</div>
                <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Quick Look</div>
              </div>
              <button onClick={closePreview} className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white">
                ✕
              </button>
            </div>
            <div className="flex items-center justify-center max-h-[calc(90vh-100px)]">
              {renderPreview()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinderApp;
