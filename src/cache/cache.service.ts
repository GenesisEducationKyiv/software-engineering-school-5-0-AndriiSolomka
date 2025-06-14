import { Inject, Injectable } from '@nestjs/common';
import {
  CacheRepository,
  ICacheRepositoryToken,
} from './interfaces/cache-repository.interface';

@Injectable()
export class CacheService<T> {
  constructor(
    @Inject(ICacheRepositoryToken)
    private readonly cache: CacheRepository,
    private readonly prefix: string,
    private readonly ttl: number,
  ) {}

  private getKey(key: string): string {
    return `${this.prefix}:${key.toLowerCase()}`;
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
}
