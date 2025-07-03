export interface CacheInterface<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
}
