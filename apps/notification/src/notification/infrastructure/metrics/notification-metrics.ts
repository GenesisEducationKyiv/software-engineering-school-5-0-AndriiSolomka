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

  recordPublished(status: NOTIFICATION_EMAIL_STATUS) {
    this.publishedCounter.inc({ status });
  }

  recordPublishError(error_code: string) {
    this.publishErrors.inc({ error_code });
  }

  createPublishDurationStopper(status: NOTIFICATION_EMAIL_STATUS) {
    const stopTimer = this.publishDuration.startTimer({ status });
    return (status: string) => {
      stopTimer({ status });
    };
  }

  clearAllMetrics(): void {
    this.publishedCounter.reset();
    this.publishDuration.reset();
    this.publishErrors.reset();
  }
}
