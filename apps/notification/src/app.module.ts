import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';
import { LoggerModule } from 'libs/infrastructure/logger/logger.module';

import { KafkaPublisherModule } from './kafka/kafka.module';
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
    LoggerModule,
  ],
})
export class AppModule {}
