import React from 'react';
import { clsx } from 'clsx';

interface AdvancedBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
  removable?: boolean;
  className?: string;
  onRemove?: () => void;
}

export const AdvancedBadge: React.FC<AdvancedBadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  dot = false,
  removable = false,
  className,
  onRemove,
}) => {
  const baseClasses = 'inline-flex items-center font-medium';
  
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    light: 'bg-gray-100 text-gray-800',
    dark: 'bg-gray-800 text-white',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };
  
  const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';
  
  return (
    <span
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses,
        className
      )}
    >
      {dot && (
        <div className={clsx(
          'mr-1.5 rounded-full',
          size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5',
          variant === 'primary' ? 'bg-white/20' :
          variant === 'secondary' ? 'bg-white/20' :
          variant === 'success' ? 'bg-green-400' :
          variant === 'warning' ? 'bg-yellow-400' :
          variant === 'danger' ? 'bg-red-400' :
          variant === 'info' ? 'bg-blue-400' :
          variant === 'light' ? 'bg-gray-400' :
          'bg-gray-400'
        )} />
      )}
      
      {children}
      
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={clsx(
            'ml-1.5 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-current hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
            variant === 'primary' ? 'focus:ring-white' :
            variant === 'secondary' ? 'focus:ring-white' :
            variant === 'success' ? 'focus:ring-green-400' :
            variant === 'warning' ? 'focus:ring-yellow-400' :
            variant === 'danger' ? 'focus:ring-red-400' :
            variant === 'info' ? 'focus:ring-blue-400' :
            variant === 'light' ? 'focus:ring-gray-400' :
            'focus:ring-gray-400'
          )}
        >
          <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
};