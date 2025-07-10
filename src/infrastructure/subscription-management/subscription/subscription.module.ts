import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';
import { SubscriptionRepositoryToken } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { SubscriptionToken } from 'src/core/abstracts/subscription/subscription.interface';

import { SubscriptionApiClient } from './api/clients/subscription.client';
import { PrismaModule } from '../infrastructure/database/prisma.module';
import { SubscriptionInternalController } from './api/controllers/subscription.controller';
import { SubscriptionService } from './domain/services/subscription.service';
import { PrismaSubscriptionRepository } from './domain/repositories/prisma-subscription.repository';

@Module({
  imports: [PrismaModule, HttpClientModule],
  controllers: [SubscriptionInternalController],
  providers: [
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
  exports: [SubscriptionApiClient],
})
export class InternalSubscriptionModule {}
