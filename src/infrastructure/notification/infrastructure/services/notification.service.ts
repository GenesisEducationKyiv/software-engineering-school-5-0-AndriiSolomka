import { Injectable } from '@nestjs/common';
import { EmailConfig } from 'src/infrastructure/email/config/email.config';
import { EmailApiClient } from 'src/infrastructure/email/interface/clients/email.client';
import { NotificationInterface } from 'src/infrastructure/notification/core/notification.interface';
import { Frequency } from 'src/infrastructure/subscription-management/core/entities/subscription.entity';
import { SubscriptionApiClient } from 'src/infrastructure/subscription-management/interface/clients/application.client';
import { WeatherApiClient } from 'src/infrastructure/weather/interfaces/client/weather.client';
import { buildWeatherNotification } from 'src/utils/notification/notification-builder';

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
