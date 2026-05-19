import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';

/**
 * Window Title Bar Component
 * Draggable title bar with control buttons
 */
export const WindowTitleBar = React.forwardRef(
  (
    {
      title,
      icon,
      onClose,
      onMinimize,
      onMaximize,
      isMaximized = false,
      isMobile = false,
      className = '',
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);

    // Render icon - support both images and emojis
    const renderIcon = () => {
      if (!icon) return null;
      
      // If icon starts with /, it's a file path
      if (typeof icon === 'string' && icon.startsWith('/') && !imageError) {
        return (
          <img 
            src={icon} 
            alt="app icon"
            className="w-4 h-4 object-contain"
            onError={() => setImageError(true)}
          />
        );
      }
      
      // Otherwise it's an emoji
      return <span className="text-sm">{icon}</span>;
    };

    return (
      <div
        ref={ref}
        className={`
          flex items-center justify-between
          h-10 px-3 bg-neutral-950/80 backdrop-blur-xl
          border-b border-white/10
          select-none cursor-move
          ${className}
        `}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {!isMobile && (
            <div className="flex items-center gap-2">
              {onClose && (
                <motion.button
                  className="group flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f57] shadow-sm shadow-black/20 ring-1 ring-black/10"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  title="Close"
                >
                  <X size={9} className="opacity-0 text-[#4a0a07] transition-opacity duration-150 group-hover:opacity-100" />
                </motion.button>
              )}

              {onMinimize && (
                <motion.button
                  className="group flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#febc2e] shadow-sm shadow-black/20 ring-1 ring-black/10"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMinimize();
                  }}
                  title="Minimize"
                >
                  <Minus size={9} className="opacity-0 text-[#4a3600] transition-opacity duration-150 group-hover:opacity-100" />
                </motion.button>
              )}

              {onMaximize && (
                <motion.button
                  className="group flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#28c840] shadow-sm shadow-black/20 ring-1 ring-black/10"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMaximize();
                  }}
                  title={isMaximized ? 'Restore' : 'Maximize'}
                >
                  <Square size={8} className="opacity-0 text-[#05330b] transition-opacity duration-150 group-hover:opacity-100" />
                </motion.button>
              )}
            </div>
          )}

          <div className="flex min-w-0 items-center gap-2">
            {renderIcon()}
            <span className="truncate text-sm font-medium text-neutral-200">
              {title}
            </span>
          </div>
        </div>

        <div className="w-20" />
      </div>
    );
  }
);

WindowTitleBar.displayName = 'WindowTitleBar';
