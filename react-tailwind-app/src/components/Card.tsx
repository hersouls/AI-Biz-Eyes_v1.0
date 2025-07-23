import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'nav';
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'md',
  border = true,
  hover = false,
  header,
  footer,
  variant = 'default'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const variantClasses = {
    // 🧾 기본 카드 스타일
    default: 'bg-white border-gray',
    
    // 🧭 네비게이션 카드 스타일
    nav: 'bg-navy text-white border-navy',
  };

  const classes = clsx(
    'rounded-5',
    variantClasses[variant],
    border && 'border',
    shadowClasses[shadow],
    hover && 'hover:shadow-lg transition-shadow duration-200',
    className
  );

  return (
    <div className={classes}>
      {header && (
        <div className={clsx(
          'px-6 py-4 border-b',
          variant === 'default' ? 'border-gray' : 'border-gray/20'
        )}>
          {header}
        </div>
      )}
      
      <div className={paddingClasses[padding]}>
        {children}
      </div>
      
      {footer && (
        <div className={clsx(
          'px-6 py-4 border-t rounded-b-5',
          variant === 'default' ? 'border-gray bg-gray/10' : 'border-gray/20 bg-gray/10'
        )}>
          {footer}
        </div>
      )}
    </div>
  );
};

interface CardHeaderProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  title,
  subtitle,
  action
}) => {
  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <div className="flex-1">
        {title && (
          <h3 className="text-subtitle1 font-bold text-primary">{title}</h3>
        )}
        {subtitle && (
          <p className="mt-1 text-body3 text-gray">{subtitle}</p>
        )}
        {children}
      </div>
      {action && (
        <div className="ml-4">
          {action}
        </div>
      )}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className
}) => {
  return (
    <div className={clsx('', className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className
}) => {
  return (
    <div className={clsx('flex items-center justify-between', className)}>
      {children}
    </div>
  );
};

export default Card;