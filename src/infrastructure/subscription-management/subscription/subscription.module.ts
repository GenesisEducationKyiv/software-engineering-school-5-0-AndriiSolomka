import { Module } from '@nestjs/common';
import { SubscriptionRepositoryToken } from 'src/core/abstracts/subscription/subscription-repository.interface';
import { SubscriptionToken } from 'src/core/abstracts/subscription/subscription.interface';
import { HttpClientModule } from 'src/libs/http/http-client.module';

import { PrismaSubscriptionRepository } from './repositories/prisma-subscription.repository';
import { SubscriptionService } from './services/subscription.service';
import { PrismaModule } from '../infrastructure/database/prisma.module';

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
