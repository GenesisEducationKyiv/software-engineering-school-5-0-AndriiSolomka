import { Inject, Injectable } from '@nestjs/common';
import { EmailConfig } from 'src/config/email.config';
import { EmailSenderInterface } from 'src/core/abstracts/notification/notification.interface';
import {
  SubscriptionInterface,
  SubscriptionToken,
} from 'src/core/abstracts/subscription/subscription.interface';
import {
  WeatherInterface,
  WeatherToken,
} from 'src/core/abstracts/weather/weather.interface';
import { Frequency } from 'src/core/entities/subscription.entity';
import { EmailApiClient } from 'src/infrastructure/api/services/email/email.service';
import { buildWeatherNotification } from 'src/utils/notification/notification-builder';

@Injectable()
export class SendWeatherUpdatesUseCase implements EmailSenderInterface {
  constructor(
    @Inject(SubscriptionToken)
    private readonly subService: SubscriptionInterface,
    @Inject(WeatherToken)
    private readonly weatherService: WeatherInterface,
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
