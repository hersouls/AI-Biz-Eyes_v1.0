import React from 'react';
import clsx from 'clsx';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

const Table: React.FC<TableProps> = ({
  children,
  className,
  striped = false,
  hover = true,
  bordered = false,
  compact = false
}) => {
  const classes = clsx(
    'min-w-full divide-y divide-gray-200',
    bordered && 'border border-gray-200 rounded-5',
    className
  );

  return (
    <div className="overflow-hidden">
      <table className={classes}>
        <tbody className={clsx(
          'bg-white divide-y divide-gray-200',
          striped && 'divide-y-0'
        )}>
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                striped,
                hover,
                compact,
                index
              });
            }
            return child;
          })}
        </tbody>
      </table>
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className
}) => {
  return (
    <thead className="bg-gray-50">
      <tr className={clsx('', className)}>
        {children}
      </tr>
    </thead>
  );
};

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
}

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  children,
  className,
  align = 'left',
  sortable = false,
  onSort,
  sortDirection
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const classes = clsx(
    'px-6 py-3 text-body3 font-bold text-gray-700 uppercase tracking-wider',
    alignClasses[align],
    sortable && 'cursor-pointer hover:bg-gray-100',
    className
  );

  return (
    <th className={classes} onClick={sortable ? onSort : undefined}>
      <div className="flex items-center justify-between">
        <span>{children}</span>
        {sortable && (
          <div className="ml-2">
            {sortDirection === 'asc' && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
            {sortDirection === 'desc' && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            {!sortDirection && (
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        )}
      </div>
    </th>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  index?: number;
  onClick?: () => void;
  selected?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className,
  striped = false,
  hover = true,
  compact = false,
  index = 0,
  onClick,
  selected = false
}) => {
  const classes = clsx(
    compact ? 'px-4 py-2' : 'px-6 py-4',
    striped && index % 2 === 1 && 'bg-gray-50',
    hover && 'hover:bg-gray-50',
    selected && 'bg-primary-50 border-l-4 border-primary',
    onClick && 'cursor-pointer',
    'transition-colors duration-150',
    className
  );

  return (
    <tr className={classes} onClick={onClick}>
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  compact?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className,
  align = 'left',
  compact = false
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const classes = clsx(
    compact ? 'px-4 py-2' : 'px-6 py-4',
    'text-body3 text-gray-900',
    alignClasses[align],
    'whitespace-nowrap',
    className
  );

  return (
    <td className={classes}>
      {children}
    </td>
  );
};

interface TableEmptyProps {
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const TableEmpty: React.FC<TableEmptyProps> = ({
  message = '데이터가 없습니다.',
  icon,
  action
}) => {
  return (
    <tr>
      <td colSpan={100} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center">
          {icon && (
            <div className="w-12 h-12 text-gray-400 mb-4">
              {icon}
            </div>
          )}
          <p className="text-body2 text-gray-500 mb-4">{message}</p>
          {action && (
            <div>{action}</div>
          )}
        </div>
      </td>
    </tr>
  );
};

interface TableLoadingProps {
  columns?: number;
  rows?: number;
}

export const TableLoading: React.FC<TableLoadingProps> = ({
  columns = 5,
  rows = 3
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default Table;