import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  readOnly = false,
  required = false,
  error,
  label,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  fullWidth = false,
  className = '',
  name,
  id,
  autoComplete
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-body3',
    md: 'px-4 py-2 text-body3',
    lg: 'px-4 py-3 text-body2'
  };

  const baseClasses = 'border rounded-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900';
  const widthClass = fullWidth ? 'w-full' : '';
  const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-body3 font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400 w-5 h-5">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          className={`
            ${baseClasses} 
            ${stateClasses} 
            ${disabledClasses} 
            ${sizeClasses[size]} 
            ${widthClass} 
            ${iconPadding}
          `}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400 w-5 h-5">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-detail2 ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;