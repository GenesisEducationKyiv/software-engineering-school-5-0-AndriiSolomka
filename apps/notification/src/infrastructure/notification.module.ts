import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailConfig } from 'apps/notification/config/email.config';
import { SubscriptionConfig } from 'apps/notification/config/subscription.config';
import { WeatherConfig } from 'apps/notification/config/weather.config';

import { NotificationService } from './services/notification.service';
import { EMAIL_PACKAGE } from '../core/email.interface';
import { SUBSCRIPTION_PACKAGE } from '../core/subscription.interface';
import { WEATHER_PACKAGE } from '../core/weather.interface';
import { EmailClientService } from './clients/email.grcp.client';
import { SubscriptionClientService } from './clients/subscription.client';
import { WeatherClientService } from './clients/weather.grcp.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: WEATHER_PACKAGE,
        useFactory: (config: WeatherConfig) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.weatherHost}:${config.weatherPort}`,
            package: 'weather',
            protoPath: 'libs/proto/weather.proto',
          },
        }),
        inject: [WeatherConfig],
      },
      {
        name: SUBSCRIPTION_PACKAGE,
        useFactory: (config: SubscriptionConfig) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.subscriptionHost}:${config.subscriptionPort}`,
            package: 'subscription',
            protoPath: 'libs/proto/subscription.proto',
          },
        }),
        inject: [SubscriptionConfig],
      },
      {
        name: EMAIL_PACKAGE,
        useFactory: (config: EmailConfig) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.emailHost}:${config.emailPort}`,
            package: 'email',
            protoPath: 'libs/proto/email.proto',
          },
        }),
        inject: [EmailConfig],
      },
    ]),
  ],
  providers: [
    NotificationService,
    EmailClientService,
    WeatherClientService,
    SubscriptionClientService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
