import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'admin';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    // 🎯 브랜드 중심 강조 (Primary)
    primary: 'bg-primary text-white hover:bg-secondary focus:ring-primary shadow-sm',
    
    // 🌊 전환 유도용 강조 (Secondary)
    secondary: 'bg-secondary text-white hover:bg-primary focus:ring-secondary shadow-sm',
    
    // ⬛ 진중한 선택 유도 (Outline)
    outline: 'border border-grayscale-border text-primary bg-white hover:bg-grayscale-light hover:text-primary focus:ring-primary shadow-sm',
    
    // 📰 보조 정보 전달 (Ghost)
    ghost: 'text-primary hover:bg-grayscale-light focus:ring-grayscale-light',
    
    // 📢 주의/경고 액션 (Danger)
    danger: 'bg-state-red text-white hover:bg-state-red/90 focus:ring-state-red shadow-sm',
    
    // 🧪 관리자/개발자 전용 (Admin)
    admin: 'bg-state-violet text-white hover:bg-state-violet/90 focus:ring-state-violet shadow-sm',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-body3',
    md: 'px-4 py-2 text-body2',
    lg: 'px-6 py-3 text-body1',
    xl: 'px-8 py-4 text-lg',
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    className
  );

  // Determine which icon to show based on props
  const showLeftIcon = leftIcon || (icon && iconPosition === 'left');
  const showRightIcon = rightIcon || (icon && iconPosition === 'right');
  const leftIconToShow = leftIcon || icon;
  const rightIconToShow = rightIcon || icon;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!loading && showLeftIcon && (
        <span className="mr-2">{leftIconToShow}</span>
      )}
      
      {children}
      
      {!loading && showRightIcon && (
        <span className="ml-2">{rightIconToShow}</span>
      )}
    </button>
  );
};

export default Button;