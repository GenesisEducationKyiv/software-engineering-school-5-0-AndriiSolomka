import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

import {
  SUBSCRIPTION_METRIC_NAMES,
  SUBSCRIPTION_OPERATION_STATUS,
} from './constants/metrics.constants';

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
    const stopTimer = this.operationDuration.startTimer({ method });
    try {
      const result = await fn();
      stopTimer({ status: SUBSCRIPTION_OPERATION_STATUS.SUCCESS });
      return result;
    } catch (err) {
      stopTimer({ status: SUBSCRIPTION_OPERATION_STATUS.ERROR });
      throw err;
    }
  }

  clearAllMetrics(): void {
    this.operationCounter.reset();
    this.operationDuration.reset();
  }
}
