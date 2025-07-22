import React from 'react';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  name?: string;
  id?: string;
  multiple?: boolean;
  searchable?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
  disabled = false,
  required = false,
  error,
  label,
  helperText,
  size = 'md',
  fullWidth = false,
  className = '',
  name,
  id,
  multiple = false,
  searchable = false
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-body3',
    md: 'px-4 py-2 text-body3',
    lg: 'px-4 py-3 text-body2'
  };

  const baseClasses = 'border rounded-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none bg-white';
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'text-gray-900 cursor-pointer';
  const widthClass = fullWidth ? 'w-full' : '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      onChange?.(selectedOptions as any);
    } else {
      onChange?.(e.target.value);
    }
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-body3 font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          multiple={multiple}
          className={`
            ${baseClasses} 
            ${stateClasses} 
            ${disabledClasses} 
            ${sizeClasses[size]} 
            ${widthClass}
            pr-10
          `}
        >
          {!multiple && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-detail2 ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Select;