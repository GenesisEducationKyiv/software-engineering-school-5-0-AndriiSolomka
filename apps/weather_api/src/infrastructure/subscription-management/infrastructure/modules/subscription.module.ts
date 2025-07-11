import { Module } from '@nestjs/common';
import { SubscriptionRepositoryToken } from 'src/infrastructure/subscription-management/core/subscription/subscription-repository.interface';
import { SubscriptionToken } from 'src/infrastructure/subscription-management/core/subscription/subscription.interface';
import { HttpClientModule } from 'src/libs/infrastructure/http/http-client.module';

import { PrismaModule } from '../database/prisma.module';
import { PrismaSubscriptionRepository } from '../repositories/prisma-subscription.repository';
import { SubscriptionService } from '../services/subscription.service';

@Module({
  imports: [PrismaModule, HttpClientModule],
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
  ],
  exports: [SubscriptionService],
})
export class InternalSubscriptionModule {}
