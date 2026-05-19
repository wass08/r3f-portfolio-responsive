import React from 'react';

/**
 * Reusable Card Component
 */
export const Card = React.forwardRef(
  (
    {
      children,
      className = '',
      variant = 'default', // 'default' | 'glass' | 'ghost'
      ...props
    },
    ref
  ) => {
    const variants = {
      default:
        'bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 shadow-md',
      glass: 'glass-morphism rounded-lg p-4',
      ghost: 'rounded-lg p-4 hover:bg-neutral-800/30 transition-colors',
    };

    const variantClass = variants[variant] || variants.default;

    return (
      <div ref={ref} className={`${variantClass} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Reusable Badge Component
 */
export const Badge = React.forwardRef(
  (
    {
      children,
      className = '',
      variant = 'primary', // 'primary' | 'secondary' | 'accent'
      size = 'md', // 'sm' | 'md' | 'lg'
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
      secondary: 'bg-neutral-700 text-neutral-200 border border-neutral-600',
      accent: 'bg-accent-500/20 text-accent-300 border border-accent-500/30',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base',
    };

    const variantClass = variants[variant] || variants.primary;
    const sizeClass = sizes[size] || sizes.md;

    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full font-medium ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
