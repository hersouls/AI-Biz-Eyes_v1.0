interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private cache = new Map<string, CacheItem<unknown>>();

  set<T>(key: string, data: T, ttl: number = 300000): void { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const cache = new Cache();

// 캐시 키 생성 함수
export const createCacheKey = (prefix: string, params: Record<string, unknown>): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  
  return `${prefix}:${sortedParams}`;
};