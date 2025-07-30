import { Injectable } from '@nestjs/common';

import { EmailPublisherInterface } from '../../core/publisher.interface';
import { NotificationMetrics } from '../metrics/notification-metrics';

@Injectable()
export class MetricsPublisherDecorator {
  constructor(
    private readonly decorated: EmailPublisherInterface,
    private readonly metrics: NotificationMetrics,
  ) {}

  async publishEmail(email: string, subject: string, text: string) {
    await this.metrics.withDuration('publishEmail', () =>
      this.decorated.publishEmail(email, subject, text),
    );
  }
}
