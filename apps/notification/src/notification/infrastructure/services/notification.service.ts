import { Injectable } from '@nestjs/common';
import { EmailConfig } from 'apps/notification/config/email.config';
import { SubscriptionClientService } from 'apps/notification/src/subscription/infrastructure/subscription.grpc.client';
import { WeatherClientService } from 'apps/notification/src/weather/infrastructure/weather.grpc.client';
import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { EMAIL_EVENTS } from 'libs/common/events/email';
import { KafkaPublisherService } from 'libs/infrastructure/kafka/kafka.publisher';
import { buildWeatherNotification } from 'libs/utils/notification/notification-builder';

import { NotificationInterface } from '../../core/notification.interface';

@Injectable()
export class NotificationService implements NotificationInterface {
  constructor(
    private readonly subService: SubscriptionClientService,
    private readonly weatherService: WeatherClientService,
    private readonly kafka: KafkaPublisherService,
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

      console.log(`Sending weather update to ${sub.email}: ${subject}`);

      await this.kafka.emit(EMAIL_EVENTS.SENDED, {
        email: sub.email,
        subject,
        text,
      });
    }
  }
}
