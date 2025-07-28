import { Injectable } from '@nestjs/common';
import {
  EmailInterface,
  EmailPayload,
} from 'apps/email/src/core/email.interface';

import { EMAIL_SEND_STATUS } from '../metrics/constants/metrics.constants';
import { EmailMetrics } from '../metrics/email-metrics';

@Injectable()
export class MetricsEmailServiceDecorator implements EmailInterface {
  constructor(
    private readonly decorated: EmailInterface,
    private readonly metrics: EmailMetrics,
  ) {}

  private async wrapWithMetrics<T>(
    type: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const end = this.metrics.createSendDurationStopper(
      type,
      EMAIL_SEND_STATUS.SUCCESS,
    );
    try {
      const result = await fn();
      this.metrics.recordSent(type, EMAIL_SEND_STATUS.SUCCESS);
      end(EMAIL_SEND_STATUS.SUCCESS);

      return result;
    } catch (error) {
      this.metrics.recordSent(type, EMAIL_SEND_STATUS.ERROR);
      end(EMAIL_SEND_STATUS.ERROR);

      throw error;
    }
  }

  sendConfirmationEmail(email: string, token: string): Promise<void> {
    return this.wrapWithMetrics('confirmation', () =>
      this.decorated.sendConfirmationEmail(email, token),
    );
  }

  sendWeatherEmail(emailPayload: EmailPayload): Promise<void> {
    return this.wrapWithMetrics('weather', () =>
      this.decorated.sendWeatherEmail(emailPayload),
    );
  }
}
