import { Module } from '@nestjs/common';
import { HttpClientModule } from 'libs/infrastructure/http/http-client.module';

import { SubscriptionRepositoryToken } from '../../core/subscription/subscription-repository.interface';
import { SubscriptionToken } from '../../core/subscription/subscription.interface';
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
