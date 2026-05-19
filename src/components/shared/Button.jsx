import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Button Component
 */
export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary', // 'primary' | 'secondary' | 'ghost'
      size = 'md', // 'sm' | 'md' | 'lg'
      className = '',
      onClick,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
      secondary:
        'bg-neutral-800 text-neutral-100 hover:bg-neutral-700 active:bg-neutral-600',
      ghost: 'text-neutral-300 hover:text-white hover:bg-neutral-800/50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantClass = variants[variant] || variants.primary;
    const sizeClass = sizes[size] || sizes.md;

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variantClass} ${sizeClass} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
