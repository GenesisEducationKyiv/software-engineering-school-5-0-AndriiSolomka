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

  recordSent(method: string, status: EMAIL_SEND_STATUS) {
    this.sentCounter.inc({ method, status });
  }

  recordSendError(method: string, error_code: string) {
    this.sendErrors.inc({ method, error_code });
  }

  async withDuration<T>(method: string, fn: () => Promise<T> | T): Promise<T> {
    const stopTimer = this.sendDuration.startTimer({ method });
    try {
      const result = await fn();
      this.recordSent(method, EMAIL_SEND_STATUS.SUCCESS);
      stopTimer({ status: EMAIL_SEND_STATUS.SUCCESS, method });
      return result;
    } catch (error) {
      this.recordSent(method, EMAIL_SEND_STATUS.ERROR);
      stopTimer({ status: EMAIL_SEND_STATUS.ERROR, method });
      throw error;
    }
  }

  clearAllMetrics(): void {
    this.sentCounter.reset();
    this.sendDuration.reset();
    this.sendErrors.reset();
  }
}
