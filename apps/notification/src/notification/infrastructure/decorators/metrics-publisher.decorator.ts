import { Injectable } from '@nestjs/common';

import { EmailPublisherInterface } from '../../core/publisher.interface';
import { NOTIFICATION_EMAIL_STATUS } from '../metrics/constants/metrics.constants';
import { NotificationMetrics } from '../metrics/notification-metrics';

@Injectable()
export class MetricsPublisherDecorator {
  constructor(
    private readonly decorated: EmailPublisherInterface,
    private readonly metrics: NotificationMetrics,
  ) {}

  publishEmail(email: string, subject: string, text: string) {
    const end = this.metrics.createPublishDurationStopper(
      NOTIFICATION_EMAIL_STATUS.SUCCESS,
    );
    try {
      this.decorated.publishEmail(email, subject, text);
      this.metrics.recordPublished(NOTIFICATION_EMAIL_STATUS.SUCCESS);
      end(NOTIFICATION_EMAIL_STATUS.SUCCESS);
    } catch (error) {
      this.metrics.recordPublished(NOTIFICATION_EMAIL_STATUS.ERROR);

      const failEnd = this.metrics.createPublishDurationStopper(
        NOTIFICATION_EMAIL_STATUS.ERROR,
      );
      failEnd(NOTIFICATION_EMAIL_STATUS.ERROR);
      throw error;
    }
  }
}
