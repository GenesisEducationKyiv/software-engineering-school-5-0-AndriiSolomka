export interface ICacheRepository {
  get(prefix: string, key: string): Promise<string | null>;
  set(prefix: string, key: string, value: string): Promise<void>;
  setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void>;
}

export const ICacheRepositoryToken = Symbol('ICacheRepository');
