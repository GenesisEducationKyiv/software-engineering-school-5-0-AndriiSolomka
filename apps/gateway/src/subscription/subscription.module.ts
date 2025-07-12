import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubscriptionConfig } from 'apps/gateway/config/subscription.config';

import { SUBSCRIPTION_PACKAGE } from './core/subscription.interface';
import { SubscriptionClientService } from './infrastructure/subscription.grpc.client';

@Module({
  imports: [
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
  exports: [SubscriptionClientService],
})
export class SubscriptionClientModule {}
