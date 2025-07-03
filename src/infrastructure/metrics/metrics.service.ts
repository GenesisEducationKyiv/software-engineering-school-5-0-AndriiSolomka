import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge, Histogram } from 'prom-client';

import {
  CACHE_METRIC_NAMES,
  CACHE_OPERATION_STATUS,
} from './constants/metrics.constants';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric(CACHE_METRIC_NAMES.HIT_TOTAL)
    private readonly cacheHitCounter: Counter<string>,

    @InjectMetric(CACHE_METRIC_NAMES.MISS_TOTAL)
    private readonly cacheMissCounter: Counter<string>,

    @InjectMetric(CACHE_METRIC_NAMES.SIZE)
    private readonly cacheSize: Gauge<string>,

    @InjectMetric(CACHE_METRIC_NAMES.OPERATION_DURATION_SECONDS)
    private readonly cacheOperationDuration: Histogram<string>,
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

  startCacheOperationTimer(cacheType: string, operation: string) {
    const timer = this.cacheOperationDuration.startTimer();
    return (status: CACHE_OPERATION_STATUS) => {
      timer({ cache_type: cacheType, operation, status });
    };
  }
}
