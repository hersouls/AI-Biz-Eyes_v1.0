import React from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary' | 'secondary' | 'blue' | 'red' | 'yellow' | 'green';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'full' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ 
  variant, 
  children, 
  className = '',
  size = 'md',
  rounded = 'full'
}) => {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-detail2',
    md: 'px-2.5 py-0.5 text-detail1',
    lg: 'px-3 py-1 text-body3'
  };

  const roundedClasses = {
    full: 'rounded-full',
    md: 'rounded-5'
  };

  return (
    <span className={`inline-flex items-center font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses[rounded]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;