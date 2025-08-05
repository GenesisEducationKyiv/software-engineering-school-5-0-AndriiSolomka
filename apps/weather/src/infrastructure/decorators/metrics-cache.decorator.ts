import { Injectable } from '@nestjs/common';
import { CacheInterface } from 'libs/core/cache/cache.interface';

import { CacheMetrics } from '../metrics/cache-metrics';

@Injectable()
export class MetricsCacheDecorator<T> implements CacheInterface<T> {
  constructor(
    private readonly decorated: CacheInterface<T>,
    private readonly metrics: CacheMetrics,
    private readonly cacheType: string,
  ) {}

  async get(key: string): Promise<T | null> {
    return this.metrics.withDuration(this.cacheType, 'get', () =>
      this.decorated.get(key),
    );
  }

  async set(key: string, value: T): Promise<void> {
    return this.metrics.withDuration(this.cacheType, 'set', () =>
      this.decorated.set(key, value),
    );
  }

  async getOrCompute(key: string, fetchFn: () => Promise<T>): Promise<T> {
    return this.metrics.withDuration(this.cacheType, 'getOrCompute', () =>
      this.decorated.getOrCompute(key, fetchFn),
    );
  }
}
