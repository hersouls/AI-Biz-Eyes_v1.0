import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface AdvancedInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  error?: string;
  success?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const AdvancedInput = forwardRef<HTMLInputElement, AdvancedInputProps>(({
  label,
  placeholder,
  value,
  type = 'text',
  size = 'md',
  variant = 'default',
  error,
  success,
  disabled = false,
  required = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  onChange,
  onFocus,
  onBlur,
}, ref) => {
  const baseClasses = 'block w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    default: 'border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary/20',
    filled: 'border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary/20 focus:bg-white',
    outlined: 'border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary/20',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-4 py-3 text-base rounded-lg',
  };
  
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
    : success 
    ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20' 
    : '';
  
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const hasIcon = leftIcon || rightIcon;
  const iconPadding = hasIcon ? (leftIcon ? 'pl-10' : 'pr-10') : '';
  
  return (
    <div className={clsx('relative', widthClasses, className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
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
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={clsx(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            stateClasses,
            iconPadding
          )}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
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
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {success && !error && (
        <p className="mt-1 text-sm text-green-600">입력이 완료되었습니다.</p>
      )}
    </div>
  );
});

AdvancedInput.displayName = 'AdvancedInput';