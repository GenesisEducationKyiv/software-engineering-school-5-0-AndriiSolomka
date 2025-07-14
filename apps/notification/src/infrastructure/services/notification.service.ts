import { Injectable } from '@nestjs/common';
import { EmailConfig } from 'apps/notification/config/email.config';
import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { buildWeatherNotification } from 'libs/utils/notification/notification-builder';

import { NotificationInterface } from '../../core/notification.interface';
import { EmailClientService } from '../clients/email.grpc.client';
import { SubscriptionClientService } from '../clients/subscription.grpc.client';
import { WeatherClientService } from '../clients/weather.grpc.client';

@Injectable()
export class NotificationService implements NotificationInterface {
  constructor(
    private readonly subService: SubscriptionClientService,
    private readonly weatherService: WeatherClientService,
    private readonly emailService: EmailClientService,
    private readonly emailConfig: EmailConfig,
  ) {}

  async sendWeatherUpdates(frequency: Frequency): Promise<void> {
    const subscriptions = await this.subService.getByFrequency(frequency);

    for (const sub of subscriptions) {
      const weather = await this.weatherService.getWeather(sub.city);
      const { subject, text } = buildWeatherNotification(
        sub,
        weather,
        this.emailConfig.unsubscribeLink,
      );

      await this.emailService.sendWeatherEmail({
        email: sub.email,
        subject,
        text,
      });
    }
  }
}
