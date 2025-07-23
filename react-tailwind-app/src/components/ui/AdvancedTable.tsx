import React from 'react';
import { clsx } from 'clsx';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface AdvancedTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  striped?: boolean;
  hover?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AdvancedTable: React.FC<AdvancedTableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = '데이터가 없습니다.',
  sortable = false,
  onSort,
  sortColumn,
  sortDirection,
  striped = true,
  hover = true,
  size = 'md',
  className,
}) => {
  const handleSort = (column: Column) => {
    if (!sortable || !column.sortable || !onSort) return;
    
    const newDirection = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newDirection);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
  };

  const cellPadding = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const SortIcon = ({ column }: { column: Column }) => {
    if (!sortable || !column.sortable) return null;
    
    const isActive = sortColumn === column.key;
    const isAsc = sortDirection === 'asc';
    
    return (
      <svg
        className={clsx(
          'ml-2 h-4 w-4 transition-all',
          isActive ? 'text-primary' : 'text-gray-400',
          isActive && isAsc ? 'rotate-180' : ''
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className={clsx('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
        <div className="animate-pulse">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-3 border-b border-gray-100">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    'text-left font-medium text-gray-700',
                    cellPadding[size],
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.width && `w-${column.width}`,
                    sortable && column.sortable && 'cursor-pointer hover:bg-gray-100 transition-colors'
                  )}
                  onClick={() => handleSort(column)}
                >
                  <div className={clsx(
                    'flex items-center',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end'
                  )}>
                    {column.label}
                    <SortIcon column={column} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={clsx(
                    sizeClasses[size],
                    striped && rowIndex % 2 === 1 && 'bg-gray-50',
                    hover && 'hover:bg-gray-50 transition-colors'
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={clsx(
                        'text-gray-900',
                        cellPadding[size],
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};