import { CacheInterface } from 'libs/core/cache/cache.interface';
import { LoggerInterface } from 'libs/core/logger/logger.interface';

export class LoggingCacheDecorator<T> implements CacheInterface<T> {
  constructor(
    private readonly wrapped: CacheInterface<T>,
    private readonly logger: LoggerInterface,
    private readonly context: string,
  ) {}

  async get(key: string): Promise<T | null> {
    const result = await this.wrapped.get(key);
    this.logger.debug({
      context: this.context,
      operation: 'cache_get',
      key,
      status: result ? 'hit' : 'miss',
    });
    return result;
  }

  async set(key: string, value: T): Promise<void> {
    await this.wrapped.set(key, value);
    this.logger.debug({
      context: this.context,
      operation: 'cache_set',
      key,
      status: 'stored',
    });
  }

  async getOrCompute(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = await this.get(key);
    if (cached) return cached;

    const data = await fetchFn();
    await this.set(key, data);
    this.logger.debug({
      context: this.context,
      operation: 'cache_getOrCompute',
      key,
      status: 'computed',
    });
    return data;
  }
}
