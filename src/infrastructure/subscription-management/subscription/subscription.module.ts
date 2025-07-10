import { Module } from '@nestjs/common';
import { SubscriptionRepositoryToken } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { SubscriptionToken } from 'src/core/abstracts/subscription/subscription.interface';
import { HttpClientModule } from 'src/libs/http/http-client.module';

import { SubscriptionApiClient } from './api/clients/subscription.client';
import { PrismaModule } from '../infrastructure/database/prisma.module';
import { SubscriptionInternalController } from './api/controllers/subscription.controller';
import { PrismaSubscriptionRepository } from './domain/repositories/prisma-subscription.repository';
import { SubscriptionService } from './domain/services/subscription.service';

@Module({
  imports: [PrismaModule, HttpClientModule],
  controllers: [SubscriptionInternalController],
  providers: [
    SubscriptionService,
    {
      provide: SubscriptionRepositoryToken,
      useClass: PrismaSubscriptionRepository,
    },
    {
      provide: SubscriptionToken,
      useClass: SubscriptionService,
    },
    SubscriptionApiClient,
  ],
  exports: [SubscriptionApiClient, SubscriptionService],
})
export class InternalSubscriptionModule {}
