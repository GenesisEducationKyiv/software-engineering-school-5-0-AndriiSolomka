import { Injectable } from '@nestjs/common';
import { measureDuration } from '@weather-utils/core';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

import { SUBSCRIPTION_METRIC_NAMES } from './constants/metrics.constants';

@Injectable()
export class SubscriptionMetrics {
  constructor(
    @InjectMetric(SUBSCRIPTION_METRIC_NAMES.OPERATION_TOTAL)
    private readonly operationCounter: Counter<string>,
    @InjectMetric(SUBSCRIPTION_METRIC_NAMES.OPERATION_DURATION)
    private readonly operationDuration: Histogram<string>,
  ) {}

  recordOperation(method: string, status: string) {
    this.operationCounter.inc({ method, status });
  }

  async withDuration<T>(method: string, fn: () => Promise<T>): Promise<T> {
    return measureDuration(this.operationDuration, { method }, fn);
  }

  clearAllMetrics(): void {
    this.operationCounter.reset();
    this.operationDuration.reset();
  }
}
