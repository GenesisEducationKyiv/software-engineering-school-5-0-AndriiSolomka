import { Inject, Injectable } from '@nestjs/common';
import {
  EmailInterface,
  EmailToken,
} from 'src/core/abstracts/email/email.interface';
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
import { buildWeatherNotification } from 'src/utils/notification/notification-builder';

@Injectable()
export class SendWeatherUpdatesUseCase implements EmailSenderInterface {
  constructor(
    @Inject(SubscriptionToken)
    private readonly subService: SubscriptionInterface,
    @Inject(WeatherToken)
    private readonly weatherService: WeatherInterface,
    @Inject(EmailToken)
    private readonly emailService: EmailInterface,
  ) {}

  async sendWeatherUpdates(frequency: Frequency): Promise<void> {
    const subscriptions = await this.subService.getByFrequency(frequency);

    for (const sub of subscriptions) {
      const weather = await this.weatherService.getWeather(sub.city);
      const { subject, text } = buildWeatherNotification(sub, weather);

      await this.emailService.sendWeatherEmail({
        email: sub.email,
        subject,
        text,
      });
    }
  }
}
