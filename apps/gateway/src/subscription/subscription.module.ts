import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubscriptionConfig } from 'apps/gateway/config/subscription.config';
import { GeocodingModule } from 'libs/infrastructure/geocoding/geocoding.module';

import { SUBSCRIPTION_PACKAGE } from './core/subscription.interface';
import { SubscriptionClientService } from './infrastructure/subscription.grpc.client';
import { SubscriptionHandlersController } from './interface/subscription.controller';
import { EmailClientModule } from '../email/email.module';

@Module({
  imports: [
    GeocodingModule,
    EmailClientModule,
    ClientsModule.registerAsync([
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
    ]),
  ],
  providers: [SubscriptionClientService],
  controllers: [SubscriptionHandlersController],
  exports: [SubscriptionClientService],
})
export class SubscriptionClientModule {}
