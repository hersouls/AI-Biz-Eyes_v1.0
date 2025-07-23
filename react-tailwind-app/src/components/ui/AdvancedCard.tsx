import React from 'react';
import { clsx } from 'clsx';

interface AdvancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const AdvancedCard: React.FC<AdvancedCardProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  padding = 'md',
  hover = false,
  interactive = false,
  header,
  footer,
  onClick,
}) => {
  const baseClasses = 'relative overflow-hidden transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white border border-gray-200 shadow-lg',
    outlined: 'bg-white border-2 border-gray-200',
    filled: 'bg-gray-50 border border-gray-200',
  };
  
  const sizeClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';
  const interactiveClasses = interactive ? 'cursor-pointer active:scale-95' : '';
  
  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        hoverClasses,
        interactiveClasses,
        className
      )}
      onClick={onClick}
    >
      {header && (
        <div className="border-b border-gray-100 px-6 py-4">
          {header}
        </div>
      )}
      
      <div className={clsx(paddingClasses[padding], header && 'pt-0', footer && 'pb-0')}>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50">
          {footer}
        </div>
      )}
    </div>
  );
};