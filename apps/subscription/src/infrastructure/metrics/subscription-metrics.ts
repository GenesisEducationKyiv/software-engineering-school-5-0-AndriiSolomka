import { Injectable } from '@nestjs/common';
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

  createOperationStopper(method: string) {
    const stopTimer = this.operationDuration.startTimer({ method });
    return (status: string) => {
      stopTimer({ status });
    };
  }

  clearAllMetrics(): void {
    this.operationCounter.reset();
    this.operationDuration.reset();
  }
}
