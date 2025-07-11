import { Injectable } from '@nestjs/common';
import { EmailConfig } from 'apps/weather_api/src/infrastructure/email/config/email.config';
import { EmailApiClient } from 'apps/weather_api/src/infrastructure/email/interface/clients/email.client';
import { NotificationInterface } from 'apps/weather_api/src/infrastructure/notification/core/notification.interface';
import { Frequency } from 'apps/weather_api/src/infrastructure/subscription-management/core/entities/subscription.entity';
import { SubscriptionApiClient } from 'apps/weather_api/src/infrastructure/subscription-management/interface/clients/application.client';
import { WeatherApiClient } from 'apps/weather_api/src/infrastructure/weather/interfaces/client/weather.client';
import { buildWeatherNotification } from 'libs/utils/notification/notification-builder';

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
