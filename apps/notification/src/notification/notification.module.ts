import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';
import { KafkaPublisherModule } from 'libs/infrastructure/kafka/kafka.publisher.module';

import { SubscriptionModule } from '../subscription/subscription.module';
import { WeatherModule } from '../weather/weather.module';
import { NotificationService } from './infrastructure/services/notification.service';
import { ScheduleService } from './infrastructure/services/schedule.service';

@Module({
  imports: [
    HttpClientModule,
    WeatherModule,
    SubscriptionModule,
    KafkaPublisherModule,
  ],
  providers: [NotificationService, ScheduleService],
  exports: [NotificationService],
})
export class NotificationModule {}
