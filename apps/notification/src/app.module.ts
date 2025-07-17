import { ConfigifyModule } from '@itgorillaz/configify';
import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { KafkaPublisherModule } from './kafka/kafka.module';
import { NotificationModule } from './notification/notification.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigifyModule.forRootAsync({}),
    HttpClientModule,
    WeatherModule,
    SubscriptionModule,
    NotificationModule,
    KafkaPublisherModule,
  ],
})
export class AppModule {}
