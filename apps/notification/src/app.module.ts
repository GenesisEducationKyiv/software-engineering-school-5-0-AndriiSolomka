import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { KafkaPublisherModule } from './kafka/kafka.publisher.module';
import { NotificationModule } from './notification/notification.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    ScheduleModule.forRoot(),
    HttpClientModule,
    WeatherModule,
    SubscriptionModule,
    NotificationModule,
    KafkaPublisherModule,
  ],
})
export class AppModule {}
