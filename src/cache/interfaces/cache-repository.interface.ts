export interface CacheRepository {
  get(prefix: string, key: string): Promise<string | null>;
  set(prefix: string, key: string, value: string): Promise<void>;
  setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void>;
}

export const CacheRepositoryToken = Symbol('ICacheRepository');

export interface CacheServiceInterface<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
}
