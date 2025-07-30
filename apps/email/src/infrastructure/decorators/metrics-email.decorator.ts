import { Injectable } from '@nestjs/common';
import {
  EmailInterface,
  EmailPayload,
} from 'apps/email/src/core/email.interface';

import { EmailMetrics } from '../metrics/email-metrics';

@Injectable()
export class MetricsEmailServiceDecorator implements EmailInterface {
  constructor(
    private readonly decorated: EmailInterface,
    private readonly metrics: EmailMetrics,
  ) {}

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    return this.metrics.withDuration('confirmation', () =>
      this.decorated.sendConfirmationEmail(email, token),
    );
  }

  async sendWeatherEmail(emailPayload: EmailPayload): Promise<void> {
    return this.metrics.withDuration('weather', () =>
      this.decorated.sendWeatherEmail(emailPayload),
    );
  }
}
