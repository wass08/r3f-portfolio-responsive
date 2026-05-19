import React from 'react';
import { motion } from 'framer-motion';

/**
 * Dock Icon Component
 * Individual clickable icon in the dock
 */
export const DockIcon = React.forwardRef(
  ({ icon, label, isActive = false, bounce = false, onClick, onMouseEnter, onMouseLeave, className = '', ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    
    // Check if the icon is a path or an emoji
    const isImagePath =
      typeof icon === 'string' &&
      (icon.startsWith('/') || icon.includes('.')) &&
      !imageError;

    const fallbackEmoji = '🧩';

    return (
      <motion.button
        ref={ref}
        className={`
          relative flex items-center justify-center
          w-12 h-12 rounded-lg
          bg-neutral-800/50 border border-neutral-700/50
          hover:bg-neutral-700/50 active:scale-95
          transition-all duration-150
          ${bounce ? 'animate-bounce' : ''}
          ${isActive ? 'bg-neutral-700 border-neutral-600' : ''}
          ${className}
        `}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        title={label}
        {...props}
      >
        {/* Conditional Rendering Logic */}
        {isImagePath ? (
          <img 
            src={icon} 
            alt={label} 
            className="w-8 h-8 object-contain" 
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-2xl">{typeof icon === 'string' ? icon : fallbackEmoji}</span>
        )}

        {/* Active indicator dot */}
        {isActive && (
          <motion.div
            className="absolute bottom-1 w-1.5 h-1.5 bg-primary-500 rounded-full"
            layoutId="activeDot"
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>
    );
  }
);

DockIcon.displayName = 'DockIcon';
