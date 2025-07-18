import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { KafkaPublisherModule } from '../kafka/kafka.publisher.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { WeatherModule } from '../weather/weather.module';
import { EmailPublisher } from './infrastructure/publisher/email.publisher';
import { NotificationService } from './infrastructure/services/notification.service';
import { ScheduleService } from './infrastructure/services/schedule.service';

@Module({
  imports: [
    HttpClientModule,
    WeatherModule,
    SubscriptionModule,
    KafkaPublisherModule,
  ],
  providers: [NotificationService, ScheduleService, EmailPublisher],
  exports: [NotificationService],
})
export class NotificationModule {}
