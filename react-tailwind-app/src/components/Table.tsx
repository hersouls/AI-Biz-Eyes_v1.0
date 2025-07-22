import React from 'react';

interface Column<T> {
  key: string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

function Table<T extends object>({
  data,
  columns,
  loading = false,
  emptyText = '데이터가 없습니다.',
  className = ''
}: TableProps<T>) {
  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 h-8 rounded mb-2"></div>
        <div className="bg-gray-200 h-8 rounded mb-2"></div>
        <div className="bg-gray-200 h-8 rounded"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        {emptyText}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b ${
                  column.width ? `w-${column.width}` : ''
                } ${
                  column.align === 'center' ? 'text-center' : 
                  column.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((record, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {column.render 
                    ? column.render((record as any)[column.key], record)
                    : String((record as any)[column.key] ?? '')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;