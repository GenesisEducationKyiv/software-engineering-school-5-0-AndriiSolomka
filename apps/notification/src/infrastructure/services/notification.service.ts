import { Injectable } from '@nestjs/common';
import { EmailConfig } from 'apps/email/config/email.config';
import { EmailApiClient } from 'apps/email/src/interface/clients/email.client';
import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { SubscriptionApiClient } from 'apps/subscription/src/interface/clients/application.client';
import { WeatherApiClient } from 'apps/weather/src/interfaces/client/weather.client';
import { buildWeatherNotification } from 'libs/utils/notification/notification-builder';

import { NotificationInterface } from '../../core/notification.interface';

@Injectable()
export class NotificationService implements NotificationInterface {
  constructor(
    private readonly subService: SubscriptionApiClient,
    private readonly weatherService: WeatherApiClient,
    private readonly emailService: EmailApiClient,
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
