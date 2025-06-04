import { Injectable } from '@nestjs/common';
import { Frequency } from '@prisma/client';
import { SubscriptionDomainService } from 'src/subscription-domain/subscription-domain.service';
import { WeatherHandlersService } from 'src/weather-handlers/weather-handlers.service';
import { EmailService } from 'src/email/email.service';
import { buildWeatherNotification } from 'src/utils/notification/notification-builder';

@Injectable()
export class NotificationService {
  constructor(
    private readonly subService: SubscriptionDomainService,
    private readonly weatherService: WeatherHandlersService,
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
