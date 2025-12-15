export interface CacheInterface<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  getOrCompute(key: string, fetchFn: () => Promise<T>): Promise<T>;
}
