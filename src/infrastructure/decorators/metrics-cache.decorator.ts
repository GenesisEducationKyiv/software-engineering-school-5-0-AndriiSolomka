import { Injectable } from '@nestjs/common';
import { CACHE_OPERATION_STATUS } from '../metrics/constants/metrics.constants';
import { CacheService } from '../cache/cache.service';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class MetricsCacheDecorator<T> {
  constructor(
    private readonly decorated: CacheService<T>,
    private readonly metrics: MetricsService,
    private readonly cacheType: string,
  ) {}

  async get(key: string): Promise<T | null> {
    const end = this.metrics.startCacheOperationTimer(this.cacheType, 'get');
    try {
      const result = await this.decorated.get(key);
      if (result !== null && result !== undefined) {
        this.metrics.recordCacheHit(this.cacheType, 'get');
      } else {
        this.metrics.recordCacheMiss(this.cacheType, 'get');
      }

      end(CACHE_OPERATION_STATUS.SUCCESS);
      return result;
    } catch (error) {
      end(CACHE_OPERATION_STATUS.ERROR);
      throw error;
    }
  }

  async set(key: string, value: T): Promise<void> {
    const end = this.metrics.startCacheOperationTimer(this.cacheType, 'set');
    try {
      await this.decorated.set(key, value);
      end(CACHE_OPERATION_STATUS.SUCCESS);
    } catch (error) {
      end(CACHE_OPERATION_STATUS.ERROR);
      throw error;
    }
  }
}
