import { Injectable } from '@nestjs/common';
import { buildWeatherNotification } from 'src/utils/notification/notification-builder';
import { Frequency } from 'src/core/entities/subscription.entity';
import { SubscriptionDomainService } from '../subscription/subscription-domain.service';
import { EmailService } from 'src/infrastructure/email/email.service';
import { NotificationInterface } from 'src/core/abstracts/notification/notification.interface';
import { WeatherService } from 'src/application/weather/weather.service';

@Injectable()
export class NotificationService implements NotificationInterface {
  constructor(
    private readonly subService: SubscriptionDomainService,
    private readonly weatherService: WeatherService,
    private readonly emailService: EmailService,
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
