import { Inject, Injectable } from '@nestjs/common';

import {
  CacheRepositoryInterface,
  CacheRepositoryToken,
} from '../../core/cache/cache-repository.interface';
import { CacheInterface } from '../../core/cache/cache.interface';

@Injectable()
export class CacheService<T> implements CacheInterface<T> {
  constructor(
    @Inject(CacheRepositoryToken)
    private readonly cache: CacheRepositoryInterface,
    private readonly prefix: string,
    private readonly ttl: number,
  ) {}

  private getKey(key: string): string {
    return key.toLowerCase();
  }

  async get(key: string): Promise<T | null> {
    const data = await this.cache.get(this.prefix, this.getKey(key));
    return data ? (JSON.parse(data) as T) : null;
  }

  async set(key: string, value: T): Promise<void> {
    await this.cache.setWithExpiry(
      this.prefix,
      this.getKey(key),
      JSON.stringify(value),
      this.ttl,
    );
  }

  async getOrSet(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = await this.get(key);
    if (cached) return cached;

    const data = await fetchFn();
    await this.set(key, data);
    return data;
  }
}
