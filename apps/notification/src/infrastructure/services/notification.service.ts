import { Injectable } from '@nestjs/common';
import { EmailConfig } from 'apps/notification/config/email.config';
import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { buildWeatherNotification } from 'libs/utils/notification/notification-builder';

import { NotificationInterface } from '../../core/notification.interface';
import { EmailClientService } from '../clients/email.grcp.client';
import { SubscriptionClientService } from '../clients/subscription.client';
import { WeatherClientService } from '../clients/weather.grcp.client';

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
