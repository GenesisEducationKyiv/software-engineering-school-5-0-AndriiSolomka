import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

import {
  NOTIFICATION_EMAIL_STATUS,
  NOTIFICATION_METRIC_NAMES,
} from './constants/metrics.constants';

@Injectable()
export class NotificationMetrics {
  constructor(
    @InjectMetric(NOTIFICATION_METRIC_NAMES.EMAIL_PUBLISHED_TOTAL)
    private readonly publishedCounter: Counter<string>,
    @InjectMetric(NOTIFICATION_METRIC_NAMES.EMAIL_PUBLISH_DURATION)
    private readonly publishDuration: Histogram<string>,
    @InjectMetric(NOTIFICATION_METRIC_NAMES.EMAIL_PUBLISH_ERRORS_TOTAL)
    private readonly publishErrors: Counter<string>,
  ) {}

  recordPublished(method: string, status: NOTIFICATION_EMAIL_STATUS) {
    this.publishedCounter.inc({ method, status });
  }

  recordPublishError(method: string, error_code: string) {
    this.publishErrors.inc({ method, error_code });
  }

  async withDuration<T>(method: string, fn: () => Promise<T> | T): Promise<T> {
    const stopTimer = this.publishDuration.startTimer({ method });
    try {
      const result = await fn();
      this.recordPublished(method, NOTIFICATION_EMAIL_STATUS.SUCCESS);
      stopTimer({ status: NOTIFICATION_EMAIL_STATUS.SUCCESS, method });
      return result;
    } catch (error) {
      this.recordPublished(method, NOTIFICATION_EMAIL_STATUS.ERROR);
      stopTimer({ status: NOTIFICATION_EMAIL_STATUS.ERROR, method });
      throw error;
    }
  }

  clearAllMetrics(): void {
    this.publishedCounter.reset();
    this.publishDuration.reset();
    this.publishErrors.reset();
  }
}
