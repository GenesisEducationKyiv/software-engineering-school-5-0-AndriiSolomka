import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

import {
  EMAIL_METRIC_NAMES,
  EMAIL_SEND_STATUS,
} from './constants/metrics.constants';

@Injectable()
export class EmailMetrics {
  constructor(
    @InjectMetric(EMAIL_METRIC_NAMES.SENT_TOTAL)
    private readonly sentCounter: Counter<string>,
    @InjectMetric(EMAIL_METRIC_NAMES.SEND_DURATION)
    private readonly sendDuration: Histogram<string>,
    @InjectMetric(EMAIL_METRIC_NAMES.SEND_ERRORS_TOTAL)
    private readonly sendErrors: Counter<string>,
  ) {}

  recordSent(type: string, status: EMAIL_SEND_STATUS) {
    this.sentCounter.inc({ type, status });
  }

  recordSendError(type: string, error_code: string) {
    this.sendErrors.inc({ type, error_code });
  }

  createSendDurationStopper(type: string, status: EMAIL_SEND_STATUS) {
    const stopTimer = this.sendDuration.startTimer({ type, status });
    return (status: string) => {
      stopTimer({ status });
    };
  }

  clearAllMetrics(): void {
    this.sentCounter.reset();
    this.sendDuration.reset();
    this.sendErrors.reset();
  }
}
