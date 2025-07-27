import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';
import { LoggerModule } from 'libs/infrastructure/logger/logger.module';

import { SubscriptionFactory } from './subscription.factory';
import { SubscriptionRepositoryToken } from '../../core/subscription/subscription-repository.interface';
import { PrismaModule } from '../database/prisma.module';
import { MetricsModule } from '../metrics/metrics.module';
import { PrismaSubscriptionRepository } from '../repositories/prisma-subscription.repository';
import { SubscriptionService } from '../services/subscription.service';

@Module({
  imports: [PrismaModule, HttpClientModule, LoggerModule, MetricsModule],
  providers: [
    SubscriptionFactory,
    {
      provide: SubscriptionRepositoryToken,
      useClass: PrismaSubscriptionRepository,
    },
    {
      provide: SubscriptionService,
      useFactory: (factory: SubscriptionFactory) => factory.create(),
      inject: [SubscriptionFactory],
    },
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
