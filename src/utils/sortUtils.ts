import { SortFunction } from '../types';

export const createSortFunction = <T>(): SortFunction<T> => {
  return (a: T, b: T, sortBy: keyof T, sortOrder: 'asc' | 'desc'): number => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
    if (bValue == null) return sortOrder === 'asc' ? 1 : -1;

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      const comparison = aValue - bValue;
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      const comparison = aValue.getTime() - bValue.getTime();
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    // Fallback to string comparison
    const aString = String(aValue);
    const bString = String(bValue);
    const comparison = aString.localeCompare(bString);
    return sortOrder === 'asc' ? comparison : -comparison;
  };
};

export const sortArray = <T>(
  array: T[],
  sortBy: keyof T,
  sortOrder: 'asc' | 'desc' = 'asc'
): T[] => {
  const sortFn = createSortFunction<T>();
  return [...array].sort((a, b) => sortFn(a, b, sortBy, sortOrder));
};