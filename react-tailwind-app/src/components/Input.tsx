import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-body3',
    md: 'px-4 py-2 text-body2',
    lg: 'px-4 py-3 text-body1'
  };

  const variantClasses = {
    default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    filled: 'bg-gray-50 border-gray-300 focus:bg-white focus:border-primary-500 focus:ring-primary-500',
    outlined: 'border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500'
  };

  const inputClasses = clsx(
    'block w-full rounded-5 border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
    sizeClasses[size],
    variantClasses[variant],
    error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    fullWidth && 'w-full',
    className
  );

  return (
    <div className={clsx('space-y-1', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-body3 font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-detail1 text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-detail1 text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className,
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-body3',
    md: 'px-4 py-2 text-body2',
    lg: 'px-4 py-3 text-body1'
  };

  const variantClasses = {
    default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    filled: 'bg-gray-50 border-gray-300 focus:bg-white focus:border-primary-500 focus:ring-primary-500',
    outlined: 'border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500'
  };

  const textareaClasses = clsx(
    'block w-full rounded-5 border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 resize-vertical',
    sizeClasses[size],
    variantClasses[variant],
    error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
    fullWidth && 'w-full',
    className
  );

  return (
    <div className={clsx('space-y-1', fullWidth && 'w-full')}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-body3 font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      
      {error && (
        <p className="text-detail1 text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-detail1 text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Search Input Component
interface SearchInputProps extends Omit<InputProps, 'type'> {
  onSearch?: (value: string) => void;
  searchButton?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  searchButton = false,
  placeholder = '검색...',
  ...props
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.currentTarget.value);
    }
  };

  return (
    <div className="relative">
      <Input
        type="search"
        placeholder={placeholder}
        leftIcon={
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        onKeyPress={handleKeyPress}
        {...props}
      />
      
      {searchButton && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 flex items-center bg-primary text-white rounded-r-5 hover:bg-primary-700 transition-colors duration-200"
          onClick={() => {
            const input = document.querySelector('input[type="search"]') as HTMLInputElement;
            if (input && onSearch) {
              onSearch(input.value);
            }
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Input;