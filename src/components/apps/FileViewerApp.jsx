import React, { useEffect, useState } from 'react';
import { Download, Copy, Share2 } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import { useFilesystemStore } from '../../store/filesystemStore';

/**
 * Universal File Viewer App
 * Opens and displays files (text, images, etc.)
 * Launched by Finder when double-clicking files
 */
const FileViewerApp = ({ windowId, windowState }) => {
  const { pushNotification } = useNotificationStore();
  const { getNode } = useFilesystemStore();
  
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Try to get file from window state
    if (windowState?.fileId) {
      const fileNode = getNode(windowState.fileId);
      if (fileNode) {
        setFile(fileNode);
      }
    }
    setIsLoading(false);
  }, [windowState, getNode]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-neutral-950">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="text-neutral-500 mb-2">No file to display</div>
          <p className="text-xs text-neutral-600">This file viewer could not load the file.</p>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    if (file.content) {
      navigator.clipboard.writeText(file.content);
      pushNotification({
        type: 'finder',
        title: 'Copied',
        description: 'File content copied to clipboard',
        source: 'file-viewer',
      });
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const fileBlob = new Blob([file.content || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = file.name;
    element.click();
    pushNotification({
      type: 'finder',
      title: 'Downloaded',
      description: file.name,
      source: 'file-viewer',
    });
  };

  // Render image files
  if (file.kind === 'image' || file.name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
    return (
      <div className="h-full w-full flex flex-col bg-neutral-950">
        <div className="border-b border-white/10 bg-neutral-950/95 px-4 py-3 flex items-center justify-between backdrop-blur-xl">
          <div>
            <div className="text-sm font-semibold text-white">{file.name}</div>
            <div className="text-xs text-neutral-500">Image Viewer</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
              title="Copy"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto flex items-center justify-center p-6">
          {file.icon ? (
            <img
              src={file.icon}
              alt={file.name}
              className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
            />
          ) : (
            <div className="text-neutral-500">No image to display</div>
          )}
        </div>
      </div>
    );
  }

  // Render text files
  return (
    <div className="h-full w-full flex flex-col bg-neutral-950">
      <div className="border-b border-white/10 bg-neutral-950/95 px-4 py-3 flex items-center justify-between backdrop-blur-xl">
        <div>
          <div className="text-sm font-semibold text-white">{file.name}</div>
          <div className="text-xs text-neutral-500">Text Editor</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
            title="Copy"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
            title="Download"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="p-6 text-sm text-neutral-300 font-mono whitespace-pre-wrap break-words">
          {file.content || '(empty file)'}
        </pre>
      </div>
    </div>
  );
};

export default FileViewerApp;
