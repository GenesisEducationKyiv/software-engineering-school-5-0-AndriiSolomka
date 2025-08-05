import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { measureDuration } from 'libs/utils/prom/prom.duration';
import { Counter, Gauge, Histogram } from 'prom-client';

import { CACHE_METRIC_NAMES } from './constants/metrics.constants';

@Injectable()
export class CacheMetrics {
  constructor(
    @InjectMetric(CACHE_METRIC_NAMES.HIT_TOTAL)
    private readonly cacheHitCounter: Counter<string>,

    @InjectMetric(CACHE_METRIC_NAMES.MISS_TOTAL)
    private readonly cacheMissCounter: Counter<string>,

    @InjectMetric(CACHE_METRIC_NAMES.SIZE)
    private readonly cacheSize: Gauge<string>,

    @InjectMetric(CACHE_METRIC_NAMES.OPERATION_DURATION_SECONDS)
    private readonly operationDuration: Histogram<string>,
  ) {}

  recordCacheHit(cacheType: string, method: string): void {
    this.cacheHitCounter.inc({ cache_type: cacheType, method });
  }

  recordCacheMiss(cacheType: string, method: string): void {
    this.cacheMissCounter.inc({ cache_type: cacheType, method });
  }

  setCacheSize(cacheType: string, size: number): void {
    this.cacheSize.set({ cache_type: cacheType }, size);
  }

  async withDuration<T>(
    cacheType: string,
    method: string,
    fn: () => Promise<T> | T,
  ): Promise<T> {
    return measureDuration(
      this.operationDuration,
      { cache_type: cacheType, method },
      fn,
    );
  }

  clearAllMetrics(): void {
    this.cacheHitCounter.reset();
    this.cacheMissCounter.reset();
    this.cacheSize.reset();
    this.operationDuration.reset();
  }
}
