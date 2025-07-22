/**
 * Combines class names conditionally
 * @param classes - Array of class names (string) or conditional classes (object)
 * @returns Combined class string
 */
export function classNames(...classes: (string | Record<string, boolean> | undefined | null | false)[]): string {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'string') {
        return cls;
      }
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, condition]) => condition)
          .map(([className]) => className)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}

/**
 * Formats a number with commas
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Formats a date to a readable string
 * @param date - The date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat('ko-KR', options || defaultOptions).format(date);
}

/**
 * Truncates text to a specified length
 * @param text - The text to truncate
 * @param length - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}