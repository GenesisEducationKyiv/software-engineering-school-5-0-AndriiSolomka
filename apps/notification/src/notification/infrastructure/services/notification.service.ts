import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EmailConfig } from 'apps/notification/config/email.config';
import { KAFKA_PUBLISHER } from 'apps/notification/src/kafka/kafka.module';
import { SubscriptionClientService } from 'apps/notification/src/subscription/infrastructure/subscription.grpc.client';
import { WeatherClientService } from 'apps/notification/src/weather/infrastructure/weather.grpc.client';
import { Frequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { EMAIL_EVENTS } from 'libs/common/events/email';
import { buildWeatherNotification } from 'libs/utils/notification/notification-builder';

import { NotificationInterface } from '../../core/notification.interface';

@Injectable()
export class NotificationService implements NotificationInterface {
  constructor(
    private readonly subService: SubscriptionClientService,
    private readonly weatherService: WeatherClientService,
    @Inject(KAFKA_PUBLISHER)
    private readonly kafkaClient: ClientKafka,
    private readonly emailConfig: EmailConfig,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async sendWeatherUpdates(frequency: Frequency): Promise<void> {
    const { subscriptions } = await this.subService.getByFrequency(frequency);

    for (const sub of subscriptions) {
      const weather = await this.weatherService.getWeather(sub.city);
      const { subject, text } = buildWeatherNotification(
        sub,
        weather,
        this.emailConfig.unsubscribeLink,
      );

      this.kafkaClient.emit(EMAIL_EVENTS.SENDED, {
        email: sub.email,
        subject,
        text,
      });

      console.log(`Weather update sent to ${sub.email} for city ${sub.city}`);
    }
  }
}
