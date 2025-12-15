import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';
import { LoggerModule } from 'libs/infrastructure/logger/logger.module';

import { EmailPublisherFactory } from './email.factory';
import { KafkaPublisherModule } from '../kafka/kafka.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { WeatherModule } from '../weather/weather.module';
import { MetricsModule } from './infrastructure/metrics/metrics.module';
import { EmailPublisher } from './infrastructure/publisher/email.publisher';
import { NotificationService } from './infrastructure/services/notification.service';
import { ScheduleService } from './infrastructure/services/schedule.service';

@Module({
  imports: [
    HttpClientModule,
    WeatherModule,
    SubscriptionModule,
    KafkaPublisherModule,
    LoggerModule,
    MetricsModule,
  ],
  providers: [
    NotificationService,
    ScheduleService,
    EmailPublisherFactory,
    {
      provide: EmailPublisher,
      useFactory: (factory: EmailPublisherFactory) => factory.create(),
      inject: [EmailPublisherFactory],
    },
  ],
})
export class NotificationModule {}
