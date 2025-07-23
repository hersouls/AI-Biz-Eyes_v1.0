import React from 'react';
import clsx from 'clsx';
import Button from './Button';

interface Column<T = any> {
  key: string;
  header: string;
  render?: (value: any, record: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TableProps<T = any> {
  children?: React.ReactNode;
  className?: string;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  compact?: boolean;
  // 데이터 기반 테이블을 위한 props
  columns?: Column<T>[];
  data?: T[];
  loading?: boolean;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  // 선택 기능을 위한 props
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedRows: (string | number)[]) => void;
  rowKey?: keyof T | ((record: T) => string | number);
}

const Table = <T extends Record<string, any> = any>({
  children,
  className,
  striped = false,
  hover = true,
  bordered = false,
  compact = false,
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  emptyMessage = '데이터가 없습니다.',
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  rowKey = 'id'
}: TableProps<T>) => {
  const classes = clsx(
    'min-w-full divide-y divide-gray',
    bordered && 'border border-gray rounded-5',
    className
  );

  // 데이터 기반 테이블 렌더링
  if (columns && data) {
    const getRowKey = (record: T, index: number): string | number => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return record[rowKey as keyof T] || index;
    };

    const handleRowSelection = (record: T, index: number) => {
      if (!selectable || !onSelectionChange) return;
      
      const key = getRowKey(record, index);
      const newSelectedRows = selectedRows.includes(key)
        ? selectedRows.filter(id => id !== key)
        : [...selectedRows, key];
      
      onSelectionChange(newSelectedRows);
    };

    return (
      <div className="overflow-hidden">
        <table className={classes}>
          <TableHeader>
            {selectable && (
              <TableHeaderCell>
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectionChange?.(data.map((record, index) => getRowKey(record, index)));
                    } else {
                      onSelectionChange?.([]);
                    }
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </TableHeaderCell>
            )}
            {columns.map((column, index) => (
              <TableHeaderCell
                key={column.key || index}
                align={column.align}
                sortable={column.sortable}
                onSort={column.onSort}
                sortDirection={column.sortDirection}
              >
                {column.header}
              </TableHeaderCell>
            ))}
          </TableHeader>
          <tbody className={clsx(
            'bg-white divide-y divide-gray-200',
            striped && 'divide-y-0'
          )}>
            {loading ? (
              <TableLoading columns={columns.length} rows={3} />
            ) : data.length === 0 ? (
              <TableEmpty message={emptyMessage} />
            ) : (
              data.map((record, rowIndex) => {
                const key = getRowKey(record, rowIndex);
                const isSelected = selectedRows.includes(key);
                
                return (
                  <TableRow
                    key={key}
                    striped={striped}
                    hover={hover}
                    compact={compact}
                    index={rowIndex}
                    selected={isSelected}
                  >
                    {selectable && (
                      <TableCell compact={compact}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleRowSelection(record, rowIndex)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </TableCell>
                    )}
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={column.key || colIndex}
                        align={column.align}
                        compact={compact}
                      >
                        {column.render
                          ? column.render(record[column.key], record)
                          : record[column.key]
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </tbody>
        </table>
        
        {/* 페이지네이션 */}
        {pagination && onPageChange && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-700">
              총 {pagination.total}개 중 {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)}개
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                이전
              </Button>
              <span className="px-3 py-1 text-sm text-gray-700">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                다음
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 기존 children 기반 테이블 렌더링
  return (
    <div className="overflow-hidden">
      <table className={classes}>
        <tbody className={clsx(
          'bg-white divide-y divide-gray-200',
          striped && 'divide-y-0'
        )}>
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              // TableComponentProps를 구현하는 컴포넌트에만 해당 props 전달
              return React.cloneElement(child, {
                striped,
                hover,
                compact,
                index
              } as React.ComponentProps<any>);
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
    <thead className="bg-gray">
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
    'px-6 py-3 text-body3 font-bold text-navy uppercase tracking-wider',
    alignClasses[align],
    sortable && 'cursor-pointer hover:bg-gray/20',
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
              <svg className="w-4 h-4 text-gray" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        )}
      </div>
    </th>
  );
};

// 테이블 컴포넌트들이 공통으로 받을 수 있는 props
interface TableComponentProps {
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  index?: number;
}

interface TableRowProps extends TableComponentProps {
  children: React.ReactNode;
  className?: string;
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
    striped && index % 2 === 1 && 'bg-gray/10',
    hover && 'hover:bg-gray/20',
    selected && 'bg-primary/10 border-l-4 border-primary',
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

interface TableCellProps extends TableComponentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className,
  align = 'left',
  compact = false,
  striped,
  hover,
  index
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