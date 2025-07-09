import { Module } from '@nestjs/common';
import { HttpClientModule } from 'src/application/modules/infrastructure/http-client.module';
import { PrismaModule } from 'src/application/modules/infrastructure/prisma.module';
import { SubscriptionRepositoryToken } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { SubscriptionToken } from 'src/core/abstracts/subscription/subscription.interface';

import { SubscriptionApiClient } from '../clients/subscription-api.client';
import { SubscriptionInternalController } from '../subscription/controllers/subscription.controller';
import { PrismaSubscriptionRepository } from '../subscription/repositories/prisma-subscription.repository';
import { SubscriptionService } from '../subscription/services/subscription.service';

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
