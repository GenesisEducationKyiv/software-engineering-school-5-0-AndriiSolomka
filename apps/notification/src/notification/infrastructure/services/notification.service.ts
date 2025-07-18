import { Injectable } from '@nestjs/common';
import { EmailConfig } from 'apps/notification/config/email.config';
import { SubscriptionClientService } from 'apps/notification/src/subscription/infrastructure/subscription.grpc.client';
import { WeatherClientService } from 'apps/notification/src/weather/infrastructure/weather.grpc.client';
import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { buildWeatherNotification } from 'libs/utils/notification/notification-builder';

import { NotificationInterface } from '../../core/notification.interface';
import { EmailPublisherService } from '../publisher/email.publisher';

@Injectable()
export class NotificationService implements NotificationInterface {
  constructor(
    private readonly subService: SubscriptionClientService,
    private readonly weatherService: WeatherClientService,
    private readonly emailPublisher: EmailPublisherService,
    private readonly emailConfig: EmailConfig,
  ) {}

  async sendWeatherUpdates(frequency: Frequency): Promise<void> {
    const { subscriptions } = await this.subService.getByFrequency(frequency);

    for (const sub of subscriptions) {
      const weather = await this.weatherService.getWeather(sub.city);
      const { subject, text } = buildWeatherNotification(
        sub,
        weather,
        this.emailConfig.unsubscribeLink,
      );

      this.emailPublisher.publishEmail(sub.email, subject, text);
    }
  }
}
